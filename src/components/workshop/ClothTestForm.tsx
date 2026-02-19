'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { addClothTest, deleteClothTest } from '@/lib/submit/submitClothTest';

interface ClothTestRecord {
  id: string;
  surface: string | null;
  panelZone: string | null;
  cellId: string | null;
  porosityValue: number | null;
  porosityMethod: string | null;
  tearResistance: number | null;
  tearResult: string | null;
  result: string | null;
  notes: string | null;
}

interface ClothTestFormProps {
  sessionId: string;
  existingTests: ClothTestRecord[];
}

const SURFACES = [
  { value: 'top', label: 'Top Surface' },
  { value: 'bottom', label: 'Bottom Surface' },
  { value: 'internal', label: 'Internal' },
];

const METHODS = [
  { value: 'bettsometer', label: 'Bettsometer (L/m²/min)' },
  { value: 'jdc', label: 'JDC (seconds)' },
  { value: 'porotest', label: 'Porotest' },
];

const RESULTS = [
  { value: 'pass', label: 'Pass', color: 'bg-green-100 text-green-700' },
  { value: 'warning', label: 'Warning', color: 'bg-amber-100 text-amber-700' },
  { value: 'fail', label: 'Fail', color: 'bg-red-100 text-red-700' },
];

export default function ClothTestForm({ sessionId, existingTests }: ClothTestFormProps) {
  const [tests, setTests] = useState(existingTests);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasFailure = tests.some((t) => t.result === 'fail');

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.set('sessionId', sessionId);

    const result = await addClothTest(formData);

    if (result.success && result.test) {
      setTests((prev) => [...prev, result.test]);
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(testId: string) {
    const result = await deleteClothTest(testId);

    if (result.success) {
      setTests((prev) => prev.filter((t) => t.id !== testId));
    }
  }

  return (
    <div className="space-y-4">
      {/* Failure warning */}
      {hasFailure && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Cloth failure detected — glider may be unairworthy.
        </div>
      )}

      {/* Existing tests */}
      {tests.length > 0 && (
        <div className="space-y-2">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-zinc-700">
                    {test.surface ?? 'Unknown surface'}
                  </span>
                  {test.panelZone && (
                    <span className="text-zinc-400">· {test.panelZone}</span>
                  )}
                  {test.cellId && (
                    <span className="font-mono text-zinc-400">Cell {test.cellId}</span>
                  )}
                  {test.result && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        RESULTS.find((r) => r.value === test.result)?.color ?? ''
                      }`}
                    >
                      {test.result}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-zinc-400">
                  {test.porosityValue != null && (
                    <span>
                      Porosity: {test.porosityValue} ({test.porosityMethod})
                    </span>
                  )}
                  {test.tearResistance != null && (
                    <span>Tear: {test.tearResistance} daN</span>
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

      {/* Add new test form */}
      {showForm ? (
        <form
          action={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Surface</label>
              <select
                name="surface"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                {SURFACES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Panel Zone
              </label>
              <input
                type="text"
                name="panelZone"
                placeholder="e.g. LE center"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Cell ID</label>
              <input
                type="text"
                name="cellId"
                placeholder="e.g. 12"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Porosity Value
              </label>
              <input
                type="number"
                name="porosityValue"
                step="0.01"
                min="0"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Porosity Method
              </label>
              <select
                name="porosityMethod"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Tear Resistance (daN)
              </label>
              <input
                type="number"
                name="tearResistance"
                step="0.1"
                min="0"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Result</label>
              <select
                name="result"
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {RESULTS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
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
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Test Point'}
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
          Add Test Point
        </button>
      )}
    </div>
  );
}
