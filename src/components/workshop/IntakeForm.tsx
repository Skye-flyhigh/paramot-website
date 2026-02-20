'use client';

import { saveDiagnosis } from '@/lib/submit/submitDiagnosis';
import { Check, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';

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

interface IntakeFormProps {
  sessionId: string;
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
}

export default function IntakeForm({ sessionId, existingDiagnosis }: IntakeFormProps) {
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

  const save = useCallback(
    async (updated: DiagnosisData) => {
      setSaving(true);
      setSaved(false);
      setError('');

      const result = await saveDiagnosis({
        sessionId,
        ...updated,
      });

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

  // Auto-save on blur
  function handleBlur() {
    save(data);
  }

  function updateField<K extends keyof DiagnosisData>(key: K, value: DiagnosisData[K]) {
    const updated = { ...data, [key]: value };

    setData(updated);

    // Auto-save condition dropdowns immediately
    if (key.endsWith('Condition')) {
      save(updated);
    }
  }

  const areas = [
    { key: 'lineset' as const, label: 'Lineset' },
    { key: 'risers' as const, label: 'Risers' },
    { key: 'canopy' as const, label: 'Canopy' },
    { key: 'cloth' as const, label: 'Cloth' },
  ];

  return (
    <div className="space-y-4">
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

      {/* Condition ratings */}
      {areas.map((area) => {
        const conditionKey = `${area.key}Condition` as keyof DiagnosisData;
        const notesKey = `${area.key}Notes` as keyof DiagnosisData;

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
    </div>
  );
}

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
