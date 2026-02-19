'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { addClothTest, deleteClothTest } from '@/lib/submit/submitClothTest';
import {
  evaluatePorosity,
  evaluateTearResistance,
  summarizeClothTests,
  type ClothResult,
} from '@/lib/workshop/cloth-calculations';

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
  { value: 'porotest', label: 'Porotest (L/m²/min)' },
];

const RESULT_STYLES: Record<ClothResult, string> = {
  pass: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  fail: 'bg-red-100 text-red-700',
};

export default function ClothTestForm({ sessionId, existingTests }: ClothTestFormProps) {
  const [tests, setTests] = useState(existingTests);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const summary = useMemo(() => summarizeClothTests(tests), [tests]);

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
      {/* Summary card */}
      {tests.length > 0 && (
        <div
          className={`rounded-lg border p-4 ${
            summary.overallResult === 'fail'
              ? 'border-red-200 bg-red-50'
              : summary.overallResult === 'warning'
                ? 'border-amber-200 bg-amber-50'
                : 'border-green-200 bg-green-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {summary.overallResult === 'fail' ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : summary.overallResult === 'warning' ? (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            <h4
              className={`font-semibold ${
                summary.overallResult === 'fail'
                  ? 'text-red-700'
                  : summary.overallResult === 'warning'
                    ? 'text-amber-700'
                    : 'text-green-700'
              }`}
            >
              {summary.overallResult === 'fail'
                ? 'Cloth Failure Detected'
                : summary.overallResult === 'warning'
                  ? 'Cloth Degradation Warning'
                  : 'Cloth OK'}
            </h4>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-green-700">{summary.passCount} pass</span>
            {summary.warningCount > 0 && (
              <span className="text-amber-700">{summary.warningCount} warning</span>
            )}
            {summary.failCount > 0 && (
              <span className="text-red-700">{summary.failCount} fail</span>
            )}
            <span className="text-zinc-500">
              · {summary.totalTests} test{summary.totalTests !== 1 ? 's' : ''}
            </span>
          </div>
          {summary.porosityAvg != null && (
            <p className="mt-1 text-xs text-zinc-500">
              Avg porosity: {summary.porosityAvg.toFixed(0)}
              {summary.tearAvg != null && ` · Avg tear: ${summary.tearAvg.toFixed(0)}g`}
            </p>
          )}
        </div>
      )}

      {/* Existing tests */}
      {tests.length > 0 && (
        <div className="space-y-2">
          {tests.map((test) => {
            // Compute evaluations for display
            const porosityEval =
              test.porosityValue != null && test.porosityMethod
                ? evaluatePorosity(test.porosityValue, test.porosityMethod)
                : null;
            const tearEval =
              test.tearResistance != null
                ? evaluateTearResistance(test.tearResistance)
                : null;
            const resultStr = (test.result ??
              porosityEval?.result ??
              tearEval?.result) as ClothResult | undefined;

            return (
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
                    {resultStr && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          RESULT_STYLES[resultStr] ?? ''
                        }`}
                      >
                        {resultStr}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    {porosityEval && (
                      <span
                        className={porosityEval.result !== 'pass' ? 'text-amber-600' : ''}
                      >
                        Porosity: {test.porosityValue} ({test.porosityMethod}) —{' '}
                        {porosityEval.label}
                      </span>
                    )}
                    {tearEval && (
                      <span
                        className={
                          tearEval.result === 'fail' ? 'text-red-600 font-medium' : ''
                        }
                      >
                        Tear: {test.tearResistance}g — {tearEval.label}
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
            );
          })}
        </div>
      )}

      {/* APPI thresholds reference */}
      <details className="text-xs text-zinc-400">
        <summary className="cursor-pointer hover:text-zinc-600 flex items-center gap-1">
          <Info className="h-3 w-3" />
          APPI Threshold Reference
        </summary>
        <div className="mt-2 rounded-lg border border-zinc-100 bg-zinc-50 p-3 space-y-2">
          <div>
            <p className="font-medium text-zinc-600">Porosity (Porosimeter)</p>
            <p>&lt;360 L/m²/min: Pass · 360–540: Warning · &gt;540: Investigation</p>
          </div>
          <div>
            <p className="font-medium text-zinc-600">Porosity (JDC)</p>
            <p>&gt;15s: Pass · 10–15s: Warning · &lt;10s: Investigation</p>
          </div>
          <div>
            <p className="font-medium text-zinc-600">Tear Resistance (Bettsometer)</p>
            <p>&gt;800g: Good · 600–800g: Used · &lt;600g: Not Airworthy</p>
          </div>
          <p className="text-zinc-400 italic">
            Note: Porosity alone is not sufficient to determine airworthiness. Tear
            resistance is the hard line.
          </p>
        </div>
      </details>

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
                Tear Resistance (g)
              </label>
              <input
                type="number"
                name="tearResistance"
                step="1"
                min="0"
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
