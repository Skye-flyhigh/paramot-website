import { Check } from 'lucide-react';

interface GliderService {
  name: string;
  soloCost: number;
  tandemCost: number;
  checks: {
    trim: boolean;
    cloth: boolean;
    porosity: boolean;
    betsometer: boolean;
    line: boolean;
  };
}

const gliderServices: GliderService[] = [
  {
    name: 'Visual Check',
    soloCost: 60,
    tandemCost: 75,
    checks: { trim: false, cloth: true, porosity: false, betsometer: false, line: false },
  },
  {
    name: 'Trim Only',
    soloCost: 100,
    tandemCost: 120,
    checks: { trim: true, cloth: false, porosity: false, betsometer: false, line: false },
  },
  {
    name: 'Full Service',
    soloCost: 180,
    tandemCost: 210,
    checks: { trim: true, cloth: true, porosity: true, betsometer: true, line: true },
  },
];

const checkLabels: { key: keyof GliderService['checks']; label: string }[] = [
  { key: 'trim', label: 'Trim measurement & correction' },
  { key: 'cloth', label: 'Visual cloth inspection' },
  { key: 'porosity', label: 'Porosity testing' },
  { key: 'betsometer', label: 'Tear resistance (Bettsometer)' },
  { key: 'line', label: 'Line strength assessment' },
];

export default function ServiceComparisonGrid() {
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
          <div role="row" className="grid grid-cols-4 gap-2 mb-2">
            <div role="columnheader" className="p-3" />
            {gliderServices.map((service) => (
              <div
                key={service.name}
                role="columnheader"
                className="p-3 text-center rounded-t-xl bg-sky-50 border border-b-0 border-sky-100"
              >
                <h4 className="font-bold text-sky-900 text-lg">{service.name}</h4>
                <div className="mt-1 space-y-0.5 text-sm">
                  <p className="text-sky-700">
                    Solo: <span className="font-semibold">£{service.soloCost}</span>
                  </p>
                  <p className="text-sky-700">
                    Tandem: <span className="font-semibold">£{service.tandemCost}</span>
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
              className={`grid grid-cols-4 gap-2 ${i === checkLabels.length - 1 ? '' : ''}`}
            >
              <div
                role="rowheader"
                className={`p-3 flex items-center text-sm font-medium text-sky-800 ${
                  i === checkLabels.length - 1 ? 'rounded-bl-xl' : ''
                }`}
              >
                {check.label}
              </div>
              {gliderServices.map((service, si) => (
                <div
                  key={`${check.key}-${service.name}`}
                  role="cell"
                  className={`p-3 flex items-center justify-center border-x border-sky-100 ${
                    i === checkLabels.length - 1
                      ? 'border-b rounded-b-xl'
                      : 'border-b border-b-sky-50'
                  } ${si === gliderServices.length - 1 && i === 0 ? '' : ''}`}
                >
                  {service.checks[check.key] ? (
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
        {gliderServices.map((service) => (
          <div
            key={service.name}
            className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm"
          >
            <h4 className="font-bold text-sky-900 text-lg mb-1">{service.name}</h4>
            <div className="flex gap-4 text-sm text-sky-700 mb-3">
              <span>
                Solo: <span className="font-semibold">£{service.soloCost}</span>
              </span>
              <span>
                Tandem: <span className="font-semibold">£{service.tandemCost}</span>
              </span>
            </div>
            <ul className="space-y-1.5">
              {checkLabels.map((check) =>
                service.checks[check.key] ? (
                  <li
                    key={check.key}
                    className="flex items-center gap-2 text-sm text-sky-800"
                  >
                    <Check
                      className="h-4 w-4 text-emerald-500 shrink-0"
                      aria-hidden="true"
                    />
                    {check.label}
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
