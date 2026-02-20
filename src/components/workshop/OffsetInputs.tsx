'use client';

import { saveSessionOffsets } from '@/lib/submit/submitSessionOffsets';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface OffsetInputsProps {
  sessionId: string;
  gliderOffset: number | null;
  brakeOffset: number | null;
}

export default function OffsetInputs({
  sessionId,
  gliderOffset,
  brakeOffset,
}: OffsetInputsProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(formData: FormData) {
    setSaving(true);
    setSaved(false);
    formData.set('sessionId', sessionId);

    await saveSessionOffsets(formData);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form action={handleSave} className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-zinc-600">Line Geometry Offsets</h4>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}
          {saved && <Check className="h-3 w-3 text-green-500" />}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-zinc-400">
            Glider Offset (mm)
          </label>
          <input
            type="number"
            name="gliderOffset"
            step="0.1"
            defaultValue={gliderOffset ?? ''}
            placeholder="0"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400">
            Brake Offset (mm)
          </label>
          <input
            type="number"
            name="brakeOffset"
            step="0.1"
            defaultValue={brakeOffset ?? ''}
            placeholder="0"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Offsets'}
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        Applied to deviation calculations before display. Use for overall line geometry
        adjustments.
      </p>
    </form>
  );
}
