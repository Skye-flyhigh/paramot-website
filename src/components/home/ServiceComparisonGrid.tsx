import { Check } from 'lucide-react';

import { type ServiceChecks, getGridServiceGroups } from '@/lib/schema';

const checkLabels: { key: keyof ServiceChecks; label: string }[] = [
  { key: 'trim', label: 'Trim measurement & correction' },
  { key: 'line', label: 'Visual line assessment' },
  { key: 'cloth', label: 'Visual cloth inspection' },
  { key: 'porosity', label: 'Porosity testing' },
  { key: 'betsometer', label: 'Cloth - tear resistance' },
  { key: 'strength', label: 'Line strength assessment'} 
];

export default function ServiceComparisonGrid() {
  const groups = getGridServiceGroups();

  return (
    <div>
      {/* Desktop table */}
      <div
        className="hidden sm:block overflow-x-auto"
        role="table"
        aria-label="Glider service comparison"
      >
        <div className="min-w-[500px]">
          {/* Header row */}
          <div
            role="row"
            className={`grid gap-2 mb-2`}
            style={{ gridTemplateColumns: `1fr repeat(${groups.length}, 1fr)` }}
          >
            <div role="columnheader" className="p-3" />
            {groups.map((group) => (
              <div
                key={group.gridGroup}
                role="columnheader"
                className="p-3 text-center rounded-t-xl bg-sky-50 border border-b-0 border-sky-100"
              >
                <h4 className="font-bold text-sky-900 text-lg">{group.gridLabel}</h4>
                <div className="mt-1 space-y-0.5 text-sm">
                  <p className="text-sky-700">
                    Solo: <span className="font-semibold">£{group.soloCost}</span>
                  </p>
                  <p className="text-sky-700">
                    Tandem: <span className="font-semibold">£{group.tandemCost}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Check rows */}
          {checkLabels.map((check, i) => (
            <div
              key={check.key}
              role="row"
              className="grid gap-2"
              style={{ gridTemplateColumns: `1fr repeat(${groups.length}, 1fr)` }}
            >
              <div
                role="rowheader"
                className={`p-3 flex flex-col text-sm font-medium text-sky-800 ${
                  i === checkLabels.length - 1 ? 'rounded-bl-xl' : ''
                }`}
              >
                {check.key === "strength" && (
                  <span className="text-xs text-sky-600 font-light">Non-destructive</span>
                )}
                {check.label}
              </div>
              {groups.map((group) => (
                <div
                  key={`${check.key}-${group.gridGroup}`}
                  role="cell"
                  className={`p-3 flex items-center justify-center border-x border-sky-100 ${
                    i === checkLabels.length - 1
                      ? 'border-b rounded-b-xl'
                      : 'border-b border-b-sky-50'
                  }`}
                >
                  {group.checks[check.key] ? (
                    <Check
                      className="h-5 w-5 text-emerald-500"
                      aria-label={`${check.label}: Included`}
                    />
                  ) : (
                    <span
                      className="text-sky-200"
                      aria-label={`${check.label}: Not included`}
                    >
                      —
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stack as cards */}
      <div className="sm:hidden space-y-4">
        {groups.map((group) => (
          <div
            key={group.gridGroup}
            className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm"
          >
            <h4 className="font-bold text-sky-900 text-lg mb-1">{group.gridLabel}</h4>
            <div className="flex gap-4 text-sm text-sky-700 mb-3">
              <span>
                Solo: <span className="font-semibold">£{group.soloCost}</span>
              </span>
              <span>
                Tandem: <span className="font-semibold">£{group.tandemCost}</span>
              </span>
            </div>
            <ul className="space-y-1.5">
              {checkLabels.map((check) =>
                group.checks[check.key] ? (
                  <li
                    key={check.key}
                    className="flex items-center gap-2 text-sm text-sky-800"
                  >
                    <Check
                      className="h-4 w-4 text-emerald-500 shrink-0"
                      aria-hidden="true"
                    />
                    {check.label}
                    {
                      check.key === "strength" && <span className="text-xs text-sky-600 font-light">- non-destructive</span>
                    }
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
