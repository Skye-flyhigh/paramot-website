import { CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';
import { summarizeClothTests } from '@/lib/workshop/cloth-calculations';

type SessionData = {
  id: string;
  equipmentType: string;
  serviceTypes: unknown;
  statedHours: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  report: {
    airworthy: boolean;
    nextControlHours: number | null;
    nextControlMonths: number | null;
    technicianOpinion: string | null;
    signedAt: Date | null;
  } | null;
  clothTests: Array<{
    surface: string;
    porosityValue: number | null;
    porosityMethod: string | null;
    tearResistance: number | null;
    result: string | null;
  }>;
  corrections: Array<{
    lineRow: string;
    position: number;
    correctionType: string;
  }>;
};

export default function WorkshopResultCard({ sessions }: { sessions: SessionData[] }) {
  if (sessions.length === 0) return null;

  const latest = sessions[0];
  const report = latest.report;

  if (!report) return null;

  const clothSummary =
    latest.clothTests.length > 0 ? summarizeClothTests(latest.clothTests) : null;

  const serviceTypes = Array.isArray(latest.serviceTypes)
    ? (latest.serviceTypes as string[])
    : [];

  return (
    <div className="space-y-4">
      {/* Latest Inspection Result */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <div className="border-b border-sky-100 p-6">
          <h2 className="text-xl font-bold text-sky-900">Latest Inspection</h2>
          {latest.completedAt && (
            <p className="mt-1 text-sm text-sky-500">
              {new Date(latest.completedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Airworthiness badge */}
          <div
            className={`flex items-center gap-3 rounded-lg border-2 p-4 ${
              report.airworthy
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}
          >
            {report.airworthy ? (
              <CheckCircle className="h-8 w-8 text-green-600 shrink-0" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600 shrink-0" />
            )}
            <div>
              <p
                className={`text-lg font-bold ${
                  report.airworthy ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {report.airworthy ? 'AIRWORTHY' : 'NOT AIRWORTHY'}
              </p>
              {report.technicianOpinion && (
                <p className="text-sm text-zinc-600 mt-1">{report.technicianOpinion}</p>
              )}
            </div>
          </div>

          {/* Service types performed */}
          {serviceTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700"
                >
                  {type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Key metrics grid */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Cloth Assessment */}
            {clothSummary && (
              <MetricCard
                label="Cloth"
                result={clothSummary.overallResult}
                detail={`${clothSummary.passCount}P ${clothSummary.warningCount}W ${clothSummary.failCount}F`}
              />
            )}

            {/* Corrections */}
            {latest.corrections.length > 0 && (
              <div className="rounded-lg border border-sky-100 p-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-sky-500" />
                  <p className="text-xs font-medium text-sky-500">Corrections</p>
                </div>
                <p className="mt-1 text-lg font-semibold text-sky-900">
                  {latest.corrections.length} applied
                </p>
              </div>
            )}

            {/* Next Control */}
            {(report.nextControlHours != null || report.nextControlMonths != null) && (
              <div className="rounded-lg border border-sky-100 p-3">
                <p className="text-xs font-medium text-sky-500">Next Control</p>
                <p className="mt-1 text-lg font-semibold text-sky-900">
                  {report.nextControlHours != null && `${report.nextControlHours}h`}
                  {report.nextControlHours != null &&
                    report.nextControlMonths != null &&
                    ' / '}
                  {report.nextControlMonths != null && `${report.nextControlMonths}m`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Previous inspections (if more than 1) */}
      {sessions.length > 1 && (
        <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
          <div className="border-b border-sky-100 p-6">
            <h2 className="text-lg font-bold text-sky-900">
              Inspection History ({sessions.length})
            </h2>
          </div>
          <div className="divide-y divide-sky-100">
            {sessions.slice(1).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {s.report?.airworthy ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-sky-900">
                      {s.report?.airworthy ? 'Airworthy' : 'Not Airworthy'}
                    </p>
                    {s.completedAt && (
                      <p className="text-xs text-sky-500">
                        {new Date(s.completedAt).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                </div>
                {s.report?.nextControlHours != null && (
                  <span className="text-xs text-sky-500">
                    Next: {s.report.nextControlHours}h
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  result,
  detail,
}: {
  label: string;
  result: 'pass' | 'warning' | 'fail';
  detail: string;
}) {
  const config = {
    pass: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'border-green-100',
      label: 'Pass',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'border-amber-100',
      label: 'Warning',
    },
    fail: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'border-red-100',
      label: 'Fail',
    },
  };

  const c = config[result];
  const Icon = c.icon;

  return (
    <div className={`rounded-lg border p-3 ${c.bg}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${c.color}`} />
        <p className="text-xs font-medium text-sky-500">{label}</p>
      </div>
      <p className={`mt-1 text-lg font-semibold ${c.color}`}>{c.label}</p>
      <p className="text-xs text-sky-500">{detail}</p>
    </div>
  );
}
