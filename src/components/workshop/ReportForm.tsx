'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { submitReport } from '@/lib/submit/submitReport';

interface ReportFormProps {
  sessionId: string;
  isGlider: boolean;
  technicianEmail: string;
  existingReport: {
    airworthy: boolean;
    nextControlHours: number | null;
    nextControlMonths: number | null;
    technicianOpinion: string | null;
    technicianSignature: string | null;
    canopyRepaired: boolean;
    canopyRepairNotes: string | null;
    additionalJobs: string | null;
  } | null;
}

export default function ReportForm({
  sessionId,
  isGlider,
  technicianEmail,
  existingReport,
}: ReportFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [airworthy, setAirworthy] = useState(existingReport?.airworthy ?? true);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');
    setSuccess(false);

    formData.set('sessionId', sessionId);
    formData.set('airworthy', String(airworthy));

    const result = await submitReport(formData);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-bold text-green-800">Session Completed</p>
        <p className="mt-1 text-sm text-green-600">
          Report signed and session marked as completed.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Airworthiness toggle */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Airworthiness Determination
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAirworthy(true)}
            className={`flex-1 rounded-lg border-2 p-4 text-center transition-colors ${
              airworthy
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-zinc-200 text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <p className="text-lg font-bold">AIRWORTHY</p>
            <p className="text-xs mt-1">Equipment is safe for flight</p>
          </button>
          <button
            type="button"
            onClick={() => setAirworthy(false)}
            className={`flex-1 rounded-lg border-2 p-4 text-center transition-colors ${
              !airworthy
                ? 'border-red-500 bg-red-50 text-red-800'
                : 'border-zinc-200 text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <p className="text-lg font-bold">NOT AIRWORTHY</p>
            <p className="text-xs mt-1">Equipment requires further work</p>
          </button>
        </div>
      </div>

      {!airworthy && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          This equipment will be flagged as not airworthy. The customer will see this in
          their service history.
        </div>
      )}

      {/* Next control */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
        <h3 className="text-sm font-medium text-zinc-500">Next Control</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400">
              Hours until next control
            </label>
            <input
              type="number"
              name="nextControlHours"
              min="0"
              defaultValue={existingReport?.nextControlHours ?? ''}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">
              Months until next control
            </label>
            <input
              type="number"
              name="nextControlMonths"
              min="0"
              defaultValue={existingReport?.nextControlMonths ?? ''}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-400">
          Next control at whichever comes first: hours or months.
        </p>
      </div>

      {/* Technician opinion */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
        <label className="block text-sm font-medium text-zinc-500">
          Technician&apos;s Opinion
        </label>
        <textarea
          name="technicianOpinion"
          rows={3}
          defaultValue={existingReport?.technicianOpinion ?? ''}
          placeholder="General assessment of the equipment condition..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Canopy repair (glider only) */}
      {isGlider && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <input
              type="checkbox"
              name="canopyRepaired"
              value="true"
              defaultChecked={existingReport?.canopyRepaired ?? false}
              className="rounded border-zinc-300"
            />
            Canopy was repaired
          </label>
          <textarea
            name="canopyRepairNotes"
            rows={2}
            defaultValue={existingReport?.canopyRepairNotes ?? ''}
            placeholder="Repair details (location, type of repair)..."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      )}

      {/* Additional jobs */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
        <label className="block text-sm font-medium text-zinc-500">
          Additional Work Performed
        </label>
        <textarea
          name="additionalJobs"
          rows={2}
          defaultValue={existingReport?.additionalJobs ?? ''}
          placeholder="Any other work done that isn't captured in the steps above..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Signature */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
        <label className="block text-sm font-medium text-zinc-500">
          Technician Signature
        </label>
        <input
          type="text"
          name="technicianSignature"
          required
          defaultValue={existingReport?.technicianSignature ?? technicianEmail}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <p className="text-xs text-zinc-400">
          Your name or initials. This signs off the report.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing Report...
          </span>
        ) : (
          'Sign Report & Complete Session'
        )}
      </button>
    </form>
  );
}
