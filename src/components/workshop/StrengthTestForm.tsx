'use client';

import { addStrengthTest, deleteStrengthTest } from '@/lib/submit/submitStrengthTest';
import {
  evaluateDestructiveTest,
  classifyLineMaterial,
} from '@/lib/workshop/strength-calculations';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

// ─── Types ──────────────────────────────────────

interface LineMaterialData {
  lineId: string;
  lineRow: string;
  cascadeLevel: number;
  cascadeIndex: number;
  brand: string;
  materialRef: string;
  strengthNew: number;
}

interface StrengthTestRecord {
  id: string;
  lineId: string;
  lineRow: string;
  cascadeLevel: number;
  side: string;
  testType: string;
  loadApplied: number;
  result: string;
  measuredStrength: number | null;
  percentRemaining: number | null;
  notes: string | null;
}

interface PreviousTest {
  lineId: string;
  side: string;
  testType: string;
  result: string;
  loadApplied: number;
  measuredStrength: number | null;
  percentRemaining: number | null;
  createdAt: Date;
}

interface LoadBreakdown {
  lineId: string;
  lineRow: string;
  loadDaN: number;
  breakdown: string;
}

interface StrengthTestFormProps {
  sessionId: string;
  lineMaterials: LineMaterialData[];
  existingTests: StrengthTestRecord[];
  previousTests: PreviousTest[];
  loadBreakdowns: LoadBreakdown[];
}

const RESULT_STYLES: Record<string, string> = {
  pass: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  fail: 'bg-red-100 text-red-700',
};

// ─── Main Component ─────────────────────────────

export default function StrengthTestForm({
  sessionId,
  lineMaterials,
  existingTests,
  previousTests,
  loadBreakdowns,
}: StrengthTestFormProps) {
  const [tests, setTests] = useState(existingTests);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedLineId, setSelectedLineId] = useState('');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');
  const [testType, setTestType] = useState<'non_destructive' | 'destructive'>(
    'non_destructive',
  );

  // Derive tested line IDs
  const testedLineIds = useMemo(() => {
    const ids = new Set<string>();

    for (const t of tests) ids.add(`${t.lineId}-${t.side}`);

    return ids;
  }, [tests]);

  // Derive previously-tested line IDs
  const prevTestedLineIds = useMemo(() => {
    const ids = new Set<string>();

    for (const t of previousTests) ids.add(`${t.lineId}-${t.side}`);

    return ids;
  }, [previousTests]);

  // Mandatory lines: aramid/vectran at cascade 1-2
  const mandatoryLines = useMemo(() => {
    const lines = new Set<string>();

    for (const mat of lineMaterials) {
      const type = classifyLineMaterial(mat.brand, mat.materialRef);

      if ((type === 'aramid' || type === 'vectran') && mat.cascadeLevel <= 2) {
        lines.add(mat.lineId);
      }
    }

    return lines;
  }, [lineMaterials]);

  // Untested mandatory lines
  const untestedMandatory = useMemo(() => {
    const untested: string[] = [];

    for (const lineId of mandatoryLines) {
      const testedLeft =
        testedLineIds.has(`${lineId}-left`) || prevTestedLineIds.has(`${lineId}-left`);
      const testedRight =
        testedLineIds.has(`${lineId}-right`) || prevTestedLineIds.has(`${lineId}-right`);

      if (!testedLeft || !testedRight) {
        untested.push(lineId);
      }
    }

    return untested;
  }, [mandatoryLines, testedLineIds, prevTestedLineIds]);

  // Selected line material reference
  const selectedMat = lineMaterials.find((m) => m.lineId === selectedLineId);
  const selectedBreakdown = loadBreakdowns.find((b) => b.lineId === selectedLineId);

  async function handleSubmit(formData: FormData) {
    if (!selectedMat) return;

    setSaving(true);
    formData.set('sessionId', sessionId);
    formData.set('lineId', selectedMat.lineId);
    formData.set('lineRow', selectedMat.lineRow);
    formData.set('cascadeLevel', String(selectedMat.cascadeLevel));
    formData.set('side', selectedSide);
    formData.set('testType', testType);

    // Pre-fill load for non-destructive
    if (testType === 'non_destructive' && selectedBreakdown) {
      formData.set('loadApplied', String(selectedBreakdown.loadDaN));
    }

    // Calculate percentRemaining for destructive
    if (testType === 'destructive') {
      const measured = Number(formData.get('measuredStrength') || 0);

      if (measured > 0 && selectedMat.strengthNew > 0) {
        const pct = (measured / selectedMat.strengthNew) * 100;

        formData.set('percentRemaining', String(Math.round(pct * 10) / 10));

        // Auto-compute result for destructive
        const eval_ = evaluateDestructiveTest(measured, selectedMat.strengthNew);

        formData.set('result', eval_.result === 'reject' ? 'fail' : eval_.result);
      }
    }

    const result = await addStrengthTest(formData);

    if (result.success && result.test) {
      setTests((prev) => [...prev, result.test as StrengthTestRecord]);
      setShowForm(false);
      setSelectedLineId('');
    }
    setSaving(false);
  }

  async function handleDelete(testId: string) {
    const result = await deleteStrengthTest(testId);

    if (result.success) {
      setTests((prev) => prev.filter((t) => t.id !== testId));
    }
  }

  return (
    <div className="space-y-4">
      {/* STR-1: Mandatory lines warning */}
      {untestedMandatory.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div className="text-xs text-amber-700">
              <p className="font-medium">
                {untestedMandatory.length} mandatory line
                {untestedMandatory.length > 1 ? 's' : ''} untested
              </p>
              <p className="mt-1">
                Aramid/Vectran lines at cascade 1-2 require testing:{' '}
                {untestedMandatory.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing test results */}
      {tests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Recorded Tests ({tests.length})
          </h4>
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono font-medium text-zinc-700">
                    {test.lineId}
                  </span>
                  <span className="text-zinc-400">{test.side}</span>
                  <span className="text-xs text-zinc-400">
                    {test.testType === 'destructive' ? 'Destructive' : 'Non-destructive'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${RESULT_STYLES[test.result] ?? ''}`}
                  >
                    {test.result}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-zinc-400">
                  <span>Load: {test.loadApplied} daN</span>
                  {test.measuredStrength != null && (
                    <span>Measured: {test.measuredStrength} daN</span>
                  )}
                  {test.percentRemaining != null && (
                    <span
                      className={
                        test.percentRemaining < 10
                          ? 'text-red-600 font-medium'
                          : test.percentRemaining < 20
                            ? 'text-amber-600'
                            : ''
                      }
                    >
                      {test.percentRemaining.toFixed(1)}% remaining
                    </span>
                  )}
                </div>
                {test.notes && <p className="text-xs text-zinc-400">{test.notes}</p>}
              </div>
              <button
                onClick={() => handleDelete(test.id)}
                className="text-zinc-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add test form */}
      {showForm ? (
        <form
          action={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4"
        >
          {/* STR-4: Line selector */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-400">Line</label>
              <select
                value={selectedLineId}
                onChange={(e) => setSelectedLineId(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                required
              >
                <option value="">Select line...</option>
                {lineMaterials.map((mat) => {
                  const key = mat.lineId;
                  const isTested =
                    testedLineIds.has(`${key}-left`) && testedLineIds.has(`${key}-right`);
                  const wasPrevTested =
                    prevTestedLineIds.has(`${key}-left`) ||
                    prevTestedLineIds.has(`${key}-right`);
                  const isMandatory = mandatoryLines.has(key);

                  return (
                    <option key={key} value={key} disabled={isTested}>
                      {key} — {mat.lineRow} row, cascade {mat.cascadeLevel} |{' '}
                      {mat.strengthNew}daN new
                      {isMandatory ? ' ★' : ''}
                      {isTested ? ' (done)' : ''}
                      {wasPrevTested && !isTested ? ' (tested prev.)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Side</label>
              <select
                value={selectedSide}
                onChange={(e) => setSelectedSide(e.target.value as 'left' | 'right')}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          {/* STR-2: Calculation breakdown */}
          {selectedBreakdown && (
            <div className="rounded-md bg-zinc-50 border border-zinc-100 px-3 py-2 font-mono text-xs text-zinc-600">
              {selectedBreakdown.breakdown}
            </div>
          )}

          {/* Test type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTestType('non_destructive')}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                testType === 'non_destructive'
                  ? 'border-sky-300 bg-sky-50 text-sky-700'
                  : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              Non-Destructive
            </button>
            <button
              type="button"
              onClick={() => setTestType('destructive')}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                testType === 'destructive'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              Destructive
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {testType === 'non_destructive' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Load Applied (daN)
                  </label>
                  <input
                    type="number"
                    name="loadApplied"
                    step="0.1"
                    defaultValue={selectedBreakdown?.loadDaN ?? ''}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Result
                  </label>
                  <select
                    name="result"
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="pass">Pass</option>
                    <option value="warning">Warning</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* STR-5: Destructive test fields */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Load Applied (daN)
                  </label>
                  <input
                    type="number"
                    name="loadApplied"
                    step="0.1"
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Measured Strength (daN)
                  </label>
                  <input
                    type="number"
                    name="measuredStrength"
                    step="0.1"
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    required
                  />
                  {selectedMat && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Original: {selectedMat.strengthNew} daN
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Result
                  </label>
                  <select
                    name="result"
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="pass">Pass</option>
                    <option value="warning">Warning</option>
                    <option value="fail">Fail / Reject</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400">Notes</label>
            <input
              type="text"
              name="notes"
              placeholder="Optional notes..."
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || !selectedLineId}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Record Test'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          <Plus className="h-4 w-4" />
          Record Strength Test
        </button>
      )}

      {/* STR-3: Previous test history */}
      {previousTests.length > 0 && (
        <details className="text-xs text-zinc-400">
          <summary className="cursor-pointer hover:text-zinc-600">
            Previous session tests ({previousTests.length})
          </summary>
          <div className="mt-2 space-y-1">
            {previousTests.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded bg-zinc-50 px-3 py-1.5"
              >
                <span className="font-mono text-zinc-600">{t.lineId}</span>
                <span className="text-zinc-400">{t.side}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${RESULT_STYLES[t.result] ?? ''}`}
                >
                  {t.result}
                </span>
                {t.percentRemaining != null && (
                  <span>{t.percentRemaining.toFixed(0)}%</span>
                )}
                <span className="ml-auto text-zinc-300">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
