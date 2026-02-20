'use client';

import { addCanopyDamage, deleteCanopyDamage } from '@/lib/submit/submitCanopyDamage';
import { addDamagedLine, deleteDamagedLine } from '@/lib/submit/submitDamagedLine';
import { saveDiagnosis } from '@/lib/submit/submitDiagnosis';
import { saveInitialLoops } from '@/lib/submit/submitInitialLoops';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// ─── Types ──────────────────────────────────────

const CONDITION_OPTIONS = [
  { value: 'not_checked', label: 'Not Checked' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'used', label: 'Used' },
  { value: 'worn_out', label: 'Worn Out' },
] as const;

type ConditionValue = (typeof CONDITION_OPTIONS)[number]['value'];

interface DiagnosisData {
  linesetCondition: ConditionValue;
  risersCondition: ConditionValue;
  canopyCondition: ConditionValue;
  clothCondition: ConditionValue;
  linesetNotes: string;
  risersNotes: string;
  canopyNotes: string;
  clothNotes: string;
  generalNotes: string;
}

interface DamagedLineRecord {
  id: string;
  side: string;
  lineCode: string;
  notes: string | null;
}

interface CanopyDamageRecord {
  id: string;
  surface: string;
  cellNumber: string | null;
  notes: string | null;
}

type LoopMatrix = Record<string, Record<string, number>>;

interface IntakeFormProps {
  sessionId: string;
  numLineRows: number; // from GliderModel or default 3
  existingDiagnosis: {
    linesetCondition: string | null;
    risersCondition: string | null;
    canopyCondition: string | null;
    clothCondition: string | null;
    linesetNotes: string | null;
    risersNotes: string | null;
    canopyNotes: string | null;
    clothNotes: string | null;
    generalNotes: string | null;
  } | null;
  existingDamagedLines: DamagedLineRecord[];
  existingCanopyDamages: CanopyDamageRecord[];
  initialLoopsLeft: LoopMatrix;
  initialLoopsRight: LoopMatrix;
}

// ─── Placeholder guidance per area ──────────────

const AREA_GUIDANCE: Record<string, string> = {
  lineset:
    'Visual aspect, colours, feel. Check for knots, tangles, fraying, sheath damage.',
  risers:
    'Abrasion, jammed pulleys, missing line holders. Check maillon/soft-link condition.',
  canopy: 'Leading edge shape, trailing edge integrity, seam condition, cell openings.',
  cloth: 'Fabric feel, porosity (hand test), colour fading, coating condition.',
};

const LOOP_GROUPS = ['G1', 'G2', 'G3', 'ST'];

function getLineRows(numLineRows: number): string[] {
  return ['A', 'B', 'C', 'D'].slice(0, numLineRows);
}

// ─── Main Component ─────────────────────────────

export default function IntakeForm({
  sessionId,
  numLineRows,
  existingDiagnosis,
  existingDamagedLines,
  existingCanopyDamages,
  initialLoopsLeft,
  initialLoopsRight,
}: IntakeFormProps) {
  // Visual diagnosis state
  const [data, setData] = useState<DiagnosisData>({
    linesetCondition:
      (existingDiagnosis?.linesetCondition as ConditionValue) ?? 'not_checked',
    risersCondition:
      (existingDiagnosis?.risersCondition as ConditionValue) ?? 'not_checked',
    canopyCondition:
      (existingDiagnosis?.canopyCondition as ConditionValue) ?? 'not_checked',
    clothCondition:
      (existingDiagnosis?.clothCondition as ConditionValue) ?? 'not_checked',
    linesetNotes: existingDiagnosis?.linesetNotes ?? '',
    risersNotes: existingDiagnosis?.risersNotes ?? '',
    canopyNotes: existingDiagnosis?.canopyNotes ?? '',
    clothNotes: existingDiagnosis?.clothNotes ?? '',
    generalNotes: existingDiagnosis?.generalNotes ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Damaged lines state
  const [damagedLines, setDamagedLines] = useState(existingDamagedLines);
  const [addingLine, setAddingLine] = useState(false);

  // Canopy damage state
  const [canopyDamages, setCanopyDamages] = useState(existingCanopyDamages);
  const [addingDamage, setAddingDamage] = useState(false);

  // Loop matrix state
  const [loopsExpanded, setLoopsExpanded] = useState(false);
  const [loopSide, setLoopSide] = useState<'left' | 'right'>('left');
  const [loopsLeft, setLoopsLeft] = useState<LoopMatrix>(initialLoopsLeft);
  const [loopsRight, setLoopsRight] = useState<LoopMatrix>(initialLoopsRight);
  const [loopsSaving, setLoopsSaving] = useState(false);

  const lineRows = getLineRows(numLineRows);

  // ─── Diagnosis save ─────────────────────────

  const save = useCallback(
    async (updated: DiagnosisData) => {
      setSaving(true);
      setSaved(false);
      setError('');

      const result = await saveDiagnosis({ sessionId, ...updated });

      setSaving(false);

      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    },
    [sessionId],
  );

  function handleBlur() {
    save(data);
  }

  function updateField<K extends keyof DiagnosisData>(key: K, value: DiagnosisData[K]) {
    const updated = { ...data, [key]: value };

    setData(updated);

    if (key.endsWith('Condition')) {
      save(updated);
    }
  }

  // ─── Loop matrix save ──────────────────────

  async function saveLoops(side: 'left' | 'right', matrix: LoopMatrix) {
    setLoopsSaving(true);
    await saveInitialLoops({ sessionId, side, loops: matrix });
    setLoopsSaving(false);
  }

  function updateLoop(row: string, group: string, value: number) {
    const currentMatrix = loopSide === 'left' ? loopsLeft : loopsRight;
    const updated = {
      ...currentMatrix,
      [row]: { ...(currentMatrix[row] ?? {}), [group]: value },
    };

    if (loopSide === 'left') {
      setLoopsLeft(updated);
    } else {
      setLoopsRight(updated);
    }

    saveLoops(loopSide, updated);
  }

  // ─── Damaged line actions ──────────────────

  async function handleAddDamagedLine(formData: FormData) {
    formData.set('sessionId', sessionId);
    const result = await addDamagedLine(formData);

    if (result.success && result.line) {
      setDamagedLines((prev) => [...prev, result.line as DamagedLineRecord]);
      setAddingLine(false);
    }
  }

  async function handleDeleteDamagedLine(lineId: string) {
    const result = await deleteDamagedLine(lineId);

    if (result.success) {
      setDamagedLines((prev) => prev.filter((l) => l.id !== lineId));
    }
  }

  // ─── Canopy damage actions ─────────────────

  async function handleAddCanopyDamage(formData: FormData) {
    formData.set('sessionId', sessionId);
    const result = await addCanopyDamage(formData);

    if (result.success && result.damage) {
      setCanopyDamages((prev) => [...prev, result.damage as CanopyDamageRecord]);
      setAddingDamage(false);
    }
  }

  async function handleDeleteCanopyDamage(damageId: string) {
    const result = await deleteCanopyDamage(damageId);

    if (result.success) {
      setCanopyDamages((prev) => prev.filter((d) => d.id !== damageId));
    }
  }

  // ─── Render ────────────────────────────────

  const areas = [
    { key: 'lineset' as const, label: 'Lineset' },
    { key: 'risers' as const, label: 'Risers' },
    { key: 'canopy' as const, label: 'Canopy' },
    { key: 'cloth' as const, label: 'Cloth' },
  ];

  const currentLoops = loopSide === 'left' ? loopsLeft : loopsRight;

  return (
    <div className="space-y-6">
      {/* Save indicator */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        {saving && (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </>
        )}
        {saved && (
          <>
            <Check className="h-3 w-3 text-green-500" />
            Saved
          </>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </div>

      {/* ─── Visual Diagnosis ──────────────── */}
      {areas.map((area) => {
        const conditionKey = `${area.key}Condition` as keyof DiagnosisData;
        const notesKey = `${area.key}Notes` as keyof DiagnosisData;
        const guidance = AREA_GUIDANCE[area.key];

        return (
          <div
            key={area.key}
            className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-zinc-700">{area.label}</h4>
              <select
                value={data[conditionKey]}
                onChange={(e) =>
                  updateField(conditionKey, e.target.value as ConditionValue)
                }
                className={`rounded-md border px-3 py-1 text-sm ${conditionColor(data[conditionKey] as ConditionValue)}`}
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {guidance && <p className="text-xs text-zinc-400 italic">{guidance}</p>}
            <textarea
              value={data[notesKey]}
              onChange={(e) => updateField(notesKey, e.target.value)}
              onBlur={handleBlur}
              placeholder={`Notes about ${area.label.toLowerCase()}...`}
              rows={2}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        );
      })}

      {/* General notes */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
        <h4 className="text-sm font-medium text-zinc-700">General Notes</h4>
        <textarea
          value={data.generalNotes}
          onChange={(e) => updateField('generalNotes', e.target.value)}
          onBlur={handleBlur}
          placeholder="Overall observations, issues, anything noteworthy..."
          rows={4}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {/* ─── Initial Loop State ────────────── */}
      <div className="rounded-lg border border-zinc-200 bg-white">
        <button
          type="button"
          onClick={() => setLoopsExpanded(!loopsExpanded)}
          className="flex w-full items-center justify-between p-4"
        >
          <h4 className="text-sm font-medium text-zinc-700">Initial Loop State</h4>
          <div className="flex items-center gap-2">
            {loopsSaving && <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />}
            {loopsExpanded ? (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            )}
          </div>
        </button>

        {loopsExpanded && (
          <div className="border-t border-zinc-100 p-4 space-y-3">
            <p className="text-xs text-zinc-400">
              Record the number of loops on each riser group before any work is done. 0 =
              factory default (no extra loops).
            </p>

            {/* Side tabs */}
            <div className="flex gap-1 rounded-md bg-zinc-100 p-0.5">
              {(['left', 'right'] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setLoopSide(side)}
                  className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    loopSide === side
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {side === 'left' ? 'Left' : 'Right'}
                </button>
              ))}
            </div>

            {/* Loop matrix grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="py-1.5 pr-3 text-left font-medium text-zinc-500">
                      Row
                    </th>
                    {LOOP_GROUPS.map((g) => (
                      <th
                        key={g}
                        className="px-2 py-1.5 text-center font-medium text-zinc-500"
                      >
                        {g}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineRows.map((row) => (
                    <tr key={row} className="border-b border-zinc-50">
                      <td className="py-1.5 pr-3 font-medium text-zinc-700">{row}</td>
                      {LOOP_GROUPS.map((group) => (
                        <td key={group} className="px-1 py-1.5 text-center">
                          <select
                            value={currentLoops[row]?.[group] ?? 0}
                            onChange={(e) =>
                              updateLoop(row, group, Number(e.target.value))
                            }
                            className="w-12 rounded border border-zinc-200 px-1 py-0.5 text-center text-xs"
                          >
                            {[0, 1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── Damaged Lines ─────────────────── */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-700">Damaged Lines</h4>
          <button
            type="button"
            onClick={() => setAddingLine(true)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-sky-600 hover:bg-sky-50"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {damagedLines.length === 0 && !addingLine && (
          <p className="text-xs text-zinc-400 italic">No damaged lines recorded</p>
        )}

        {/* Existing lines */}
        {damagedLines.map((line) => (
          <div
            key={line.id}
            className="flex items-center gap-3 rounded border border-amber-200 bg-amber-50 px-3 py-2"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <div className="flex-1 text-xs">
              <span className="font-medium text-amber-800">{line.lineCode}</span>
              <span className="text-amber-600"> ({line.side})</span>
              {line.notes && <span className="text-amber-600"> — {line.notes}</span>}
            </div>
            <button
              type="button"
              onClick={() => handleDeleteDamagedLine(line.id)}
              className="text-amber-400 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {/* Add form */}
        {addingLine && (
          <form
            action={handleAddDamagedLine}
            className="space-y-2 rounded border border-zinc-200 p-3"
          >
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-zinc-500">Side</label>
                <select
                  name="side"
                  className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                  required
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Line Code</label>
                <input
                  name="lineCode"
                  placeholder="e.g. A3"
                  className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Notes</label>
                <input
                  name="notes"
                  placeholder="Optional"
                  className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-sky-600 px-3 py-1 text-xs text-white hover:bg-sky-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setAddingLine(false)}
                className="rounded px-3 py-1 text-xs text-zinc-500 hover:bg-zinc-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ─── Canopy Damage ─────────────────── */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-700">Canopy Damage</h4>
          <button
            type="button"
            onClick={() => setAddingDamage(true)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-sky-600 hover:bg-sky-50"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {canopyDamages.length === 0 && !addingDamage && (
          <p className="text-xs text-zinc-400 italic">No canopy damage recorded</p>
        )}

        {/* Existing damage records */}
        {canopyDamages.map((damage) => (
          <div
            key={damage.id}
            className="flex items-center gap-3 rounded border border-orange-200 bg-orange-50 px-3 py-2"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-orange-500" />
            <div className="flex-1 text-xs">
              <span className="font-medium text-orange-800 capitalize">
                {damage.surface}
              </span>
              {damage.cellNumber && (
                <span className="text-orange-600"> — Cell {damage.cellNumber}</span>
              )}
              {damage.notes && <span className="text-orange-600"> — {damage.notes}</span>}
            </div>
            <button
              type="button"
              onClick={() => handleDeleteCanopyDamage(damage.id)}
              className="text-orange-400 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {/* Add form */}
        {addingDamage && (
          <form
            action={handleAddCanopyDamage}
            className="space-y-2 rounded border border-zinc-200 p-3"
          >
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-zinc-500">Surface</label>
                <select
                  name="surface"
                  className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                  required
                >
                  <option value="top">Top Surface</option>
                  <option value="bottom">Bottom Surface</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Cell Number</label>
                <input
                  name="cellNumber"
                  placeholder="e.g. 4"
                  className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Notes</label>
                <input
                  name="notes"
                  placeholder="Describe damage"
                  className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-sky-600 px-3 py-1 text-xs text-white hover:bg-sky-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setAddingDamage(false)}
                className="rounded px-3 py-1 text-xs text-zinc-500 hover:bg-zinc-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────

function conditionColor(value: ConditionValue): string {
  switch (value) {
    case 'excellent':
      return 'border-blue-300 bg-blue-50 text-blue-700';
    case 'good':
      return 'border-green-200 bg-green-50 text-green-600';
    case 'average':
      return 'border-amber-300 bg-amber-50 text-amber-700';
    case 'used':
      return 'border-orange-300 bg-orange-50 text-orange-700';
    case 'worn_out':
      return 'border-red-300 bg-red-50 text-red-700';
    default:
      return 'border-zinc-300 bg-white text-zinc-500';
  }
}
