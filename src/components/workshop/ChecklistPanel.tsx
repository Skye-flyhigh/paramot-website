'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toggleChecklistStep, updateChecklistNotes } from '@/lib/submit/submitChecklist';

interface ChecklistStep {
  id: string;
  serviceType: string;
  stepNumber: number;
  description: string;
  completed: boolean;
  completedAt: Date | null;
  notes: string | null;
}

interface ChecklistPanelProps {
  steps: ChecklistStep[];
  sequential?: boolean; // Soft enforcement for reserve/harness
}

export default function ChecklistPanel({
  steps: initialSteps,
  sequential,
}: ChecklistPanelProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Group steps by service type for gliders (multiple checklists)
  const serviceTypes = [...new Set(steps.map((s) => s.serviceType))];
  const grouped = serviceTypes.map((type) => ({
    type,
    label: formatServiceType(type),
    steps: steps.filter((s) => s.serviceType === type),
  }));

  async function handleToggle(stepId: string, currentCompleted: boolean) {
    // Sequential enforcement: warn if skipping ahead
    if (sequential && !currentCompleted) {
      const step = steps.find((s) => s.id === stepId);

      if (step) {
        const previousIncomplete = steps.find(
          (s) =>
            s.serviceType === step.serviceType &&
            s.stepNumber < step.stepNumber &&
            !s.completed,
        );

        if (previousIncomplete) {
          // Soft warning — allow but note it
          console.warn('Skipping ahead in sequential checklist');
        }
      }
    }

    setLoadingId(stepId);
    const result = await toggleChecklistStep(stepId, !currentCompleted);

    if (result.success) {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === stepId
            ? {
                ...s,
                completed: !currentCompleted,
                completedAt: !currentCompleted ? new Date() : null,
              }
            : s,
        ),
      );
    }
    setLoadingId(null);
  }

  async function handleSaveNotes(stepId: string) {
    await updateChecklistNotes(stepId, notesDraft);
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, notes: notesDraft } : s)),
    );
    setEditingNotes(null);
  }

  function startEditNotes(step: ChecklistStep) {
    setEditingNotes(step.id);
    setNotesDraft(step.notes ?? '');
  }

  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {completedCount}/{steps.length} completed
          </span>
          <span>{Math.round((completedCount / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-100">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps grouped by service type */}
      {grouped.map((group) => (
        <div key={group.type} className="space-y-2">
          {serviceTypes.length > 1 && (
            <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              {group.label}
            </h4>
          )}
          {group.steps.map((step) => (
            <div
              key={step.id}
              className={`rounded-lg border p-3 transition-colors ${
                step.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggle(step.id, step.completed)}
                  disabled={loadingId === step.id}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors hover:border-zinc-400"
                >
                  {loadingId === step.id ? (
                    <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                  ) : step.completed ? (
                    <span className="text-xs text-green-600">✓</span>
                  ) : (
                    <span className="text-xs text-zinc-300">{step.stepNumber}</span>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${step.completed ? 'text-green-800' : 'text-zinc-700'}`}
                  >
                    {step.description}
                  </p>

                  {/* Notes */}
                  {editingNotes === step.id ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNotes(step.id)}
                        className="flex-1 rounded border border-zinc-300 px-2 py-1 text-xs"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNotes(step.id)}
                        className="rounded bg-zinc-900 px-2 py-1 text-xs text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotes(null)}
                        className="text-xs text-zinc-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditNotes(step)}
                      className="mt-1 text-xs text-zinc-400 hover:text-zinc-600"
                    >
                      {step.notes ?? 'Add note...'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function formatServiceType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
