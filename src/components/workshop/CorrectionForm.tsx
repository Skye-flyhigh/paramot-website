'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { addCorrection, deleteCorrection } from '@/lib/submit/submitCorrection';

interface CorrectionRecord {
  id: string;
  lineRow: string;
  position: number;
  side: string | null;
  groupLabel: string | null;
  correctionType: string | null;
  loopsBefore: number | null;
  loopsAfter: number | null;
  loopType: number | null;
  shorteningMm: number | null;
  notes: string | null;
}

interface CorrectionFormProps {
  sessionId: string;
  existingCorrections: CorrectionRecord[];
  lineRows: string[]; // Available rows from reference data
}

const CORRECTION_TYPES = [
  { value: 'loop_add', label: 'Add Loop' },
  { value: 'loop_remove', label: 'Remove Loop' },
  { value: 'line_replace', label: 'Line Replacement' },
  { value: 'other', label: 'Other' },
];

const LOOP_TYPES = [
  { value: 1, label: '1 — Simple loop (~10mm)' },
  { value: 2, label: "2 — Lark's foot (~15mm)" },
  { value: 3, label: "3 — Lark's foot + maillon loop (~25mm)" },
  { value: 4, label: "4 — Lark's foot + extra upper loop (~35mm)" },
  { value: 5, label: "5 — Lark's foot + maillon + upper loop (~45mm)" },
];

export default function CorrectionForm({
  sessionId,
  existingCorrections,
  lineRows,
}: CorrectionFormProps) {
  const [corrections, setCorrections] = useState(existingCorrections);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.set('sessionId', sessionId);

    const result = await addCorrection(formData);

    if (result.success && result.correction) {
      setCorrections((prev) => [...prev, result.correction]);
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const result = await deleteCorrection(id);

    if (result.success) {
      setCorrections((prev) => prev.filter((c) => c.id !== id));
    }
  }

  // Check for soft-link warning — if any correction has loopType >= 3
  const hasSoftLinkWarning = corrections.some(
    (c) => c.loopType != null && c.loopType >= 3,
  );

  return (
    <div className="space-y-4">
      {hasSoftLinkWarning && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Some corrections use complex loop types. Shortening values are approximate for
          soft-link connections.
        </div>
      )}

      {/* Existing corrections */}
      {corrections.length > 0 && (
        <div className="space-y-2">
          {corrections.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono font-medium text-zinc-900">
                    {c.lineRow}
                    {c.position} {c.side}
                  </span>
                  {c.groupLabel && (
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                      {c.groupLabel}
                    </span>
                  )}
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {c.correctionType?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-zinc-400">
                  {(c.loopsBefore != null || c.loopsAfter != null) && (
                    <span>
                      Loops: {c.loopsBefore ?? '?'} → {c.loopsAfter ?? '?'}
                    </span>
                  )}
                  {c.loopType != null && <span>Type {c.loopType}</span>}
                  {c.shorteningMm != null && <span>{c.shorteningMm}mm shortening</span>}
                </div>
                {c.notes && <p className="text-xs text-zinc-400">{c.notes}</p>}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-zinc-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add correction form */}
      {showForm ? (
        <form
          action={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Line Row</label>
              <select
                name="lineRow"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                {lineRows.map((row) => (
                  <option key={row} value={row}>
                    {row}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Position</label>
              <input
                type="number"
                name="position"
                min="1"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Side</label>
              <select
                name="side"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Group</label>
              <input
                type="text"
                name="groupLabel"
                placeholder="e.g. G1"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Correction Type
              </label>
              <select
                name="correctionType"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                {CORRECTION_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Loops Before
              </label>
              <input
                type="number"
                name="loopsBefore"
                min="0"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Loops After
              </label>
              <input
                type="number"
                name="loopsAfter"
                min="0"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Loop Type</label>
              <select
                name="loopType"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {LOOP_TYPES.map((lt) => (
                  <option key={lt.value} value={lt.value}>
                    {lt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Estimated Shortening (mm)
              </label>
              <input
                type="number"
                name="shorteningMm"
                step="0.1"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
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
              disabled={saving}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Log Correction'}
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
          Add Correction
        </button>
      )}
    </div>
  );
}
