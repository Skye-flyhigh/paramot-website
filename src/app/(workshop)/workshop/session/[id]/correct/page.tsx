import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import CorrectionForm from '@/components/workshop/CorrectionForm';
import TrimComparison from '@/components/workshop/TrimComparison';

interface CorrectPageProps {
  params: Promise<{ id: string }>;
}

export default async function CorrectPage({ params }: CorrectPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Corrections only apply to gliders.
      </div>
    );
  }

  // Load reference data
  const gliderSize = session.gliderSizeId
    ? await findSizeById(session.gliderSizeId)
    : null;

  // Get available line rows from reference data
  let lineRows = ['A', 'B', 'C', 'D', 'K'];

  if (gliderSize) {
    const lineLengths = gliderSize.lineLengths as Array<{ row: string }> | null;

    if (Array.isArray(lineLengths)) {
      const rows = new Set(lineLengths.map((l) => l.row));
      const rowOrder = ['A', 'B', 'C', 'D', 'E', 'K'];

      lineRows = Array.from(rows).sort(
        (a, b) => rowOrder.indexOf(a) - rowOrder.indexOf(b),
      );
    }
  }

  // Split measurements by phase for comparison
  const initialMeasurements = session.trimMeasurements
    .filter((m) => m.phase === 'initial' && m.measuredLength != null)
    .map((m) => ({
      lineRow: m.lineRow,
      position: m.position,
      measuredLength: m.measuredLength!,
    }));

  const correctedMeasurements = session.trimMeasurements
    .filter((m) => m.phase === 'corrected' && m.measuredLength != null)
    .map((m) => ({
      lineRow: m.lineRow,
      position: m.position,
      measuredLength: m.measuredLength!,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Corrections & Repairs</h3>
        <span className="text-sm text-zinc-400">
          {session.corrections.length} correction
          {session.corrections.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Trim deviation summary if measurements exist */}
      {session.trimMeasurements.length > 0 && (
        <TrimDeviationSummary measurements={session.trimMeasurements} />
      )}

      <CorrectionForm
        sessionId={session.id}
        existingCorrections={session.corrections}
        lineRows={lineRows}
      />

      {/* Before/After comparison */}
      {gliderSize && correctedMeasurements.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Before / After Comparison
          </h4>
          <TrimComparison
            lineLengths={gliderSize.lineLengths}
            groupMappings={gliderSize.groupMappings}
            aspectRatio={gliderSize.aspectRatio}
            initialMeasurements={initialMeasurements}
            correctedMeasurements={correctedMeasurements}
          />
        </div>
      )}

      {/* Link back to trim for corrected measurements */}
      {session.corrections.length > 0 && correctedMeasurements.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          After making corrections, go back to{' '}
          <a
            href={`/workshop/session/${session.id}/trim`}
            className="font-medium text-zinc-900 underline"
          >
            Trim Analysis
          </a>{' '}
          and enter corrected measurements (switch to &quot;Corrected&quot; phase) to
          verify the corrections worked.
        </div>
      )}
    </div>
  );
}

function TrimDeviationSummary({
  measurements,
}: {
  measurements: Array<{
    lineRow: string;
    position: number;
    side: string;
    phase: string;
    deviation: number | null;
  }>;
}) {
  const initialDeviations = measurements
    .filter((m) => m.phase === 'initial' && m.deviation !== null)
    .sort((a, b) => Math.abs(b.deviation!) - Math.abs(a.deviation!));

  const outOfTolerance = initialDeviations.filter((m) => Math.abs(m.deviation!) > 15);

  if (outOfTolerance.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h4 className="text-sm font-medium text-amber-800 mb-2">
        Lines Out of Tolerance ({outOfTolerance.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {outOfTolerance.slice(0, 10).map((m) => (
          <span
            key={`${m.lineRow}-${m.position}-${m.side}`}
            className="rounded bg-amber-100 px-2 py-1 text-xs font-mono text-amber-800"
          >
            {m.lineRow}
            {m.position} {m.side}: {m.deviation! > 0 ? '+' : ''}
            {m.deviation!.toFixed(0)}mm
          </span>
        ))}
        {outOfTolerance.length > 10 && (
          <span className="text-xs text-amber-600">
            +{outOfTolerance.length - 10} more
          </span>
        )}
      </div>
    </div>
  );
}
