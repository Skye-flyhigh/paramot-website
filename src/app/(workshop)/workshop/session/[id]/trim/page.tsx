import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import { getToleranceMm } from '@/lib/workshop/trim-calculations';
import TrimGrid from '@/components/workshop/TrimGrid';

interface TrimPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrimPage({ params }: TrimPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Trim analysis only applies to gliders.
      </div>
    );
  }

  // Load reference data for the grid
  const gliderSize = session.gliderSizeId
    ? await findSizeById(session.gliderSizeId)
    : null;

  if (!gliderSize) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-900">Trim Analysis</h3>
        <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
          No reference data linked to this session. The glider size must be linked to load
          manufacturer reference lengths for trim analysis.
        </div>
      </div>
    );
  }

  const aspectRatio = gliderSize.aspectRatio;
  const tolerance = getToleranceMm(aspectRatio);
  const numLineRows = gliderSize.gliderModel?.numLineRows ?? 3;
  const lineRows = ['A', 'B', 'C', 'D'].slice(0, numLineRows);
  const loopGroups = ['G1', 'G2', 'G3', 'ST'];

  const initialLoopsLeft = (session.initialLoopsLeft ?? {}) as Record<
    string,
    Record<string, number>
  >;
  const initialLoopsRight = (session.initialLoopsRight ?? {}) as Record<
    string,
    Record<string, number>
  >;

  const hasLoopData =
    Object.keys(initialLoopsLeft).length > 0 || Object.keys(initialLoopsRight).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Trim Analysis</h3>
        <span className="text-sm text-zinc-400">{session.measureMethod} method</span>
      </div>

      {/* TRM-1: AR info banner */}
      {aspectRatio && (
        <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="text-sm">
            <span className="font-medium text-zinc-700">Flat AR: {aspectRatio}</span>
            <span className="mx-2 text-zinc-300">·</span>
            <span className="text-zinc-500">Tolerance: ±{tolerance}mm</span>
          </div>
        </div>
      )}

      {/* TRM-1: Initial loop matrix (read-only) */}
      {hasLoopData && (
        <details className="rounded-lg border border-zinc-200 bg-white">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-800">
            Initial Loop State
          </summary>
          <div className="border-t border-zinc-100 px-4 py-3">
            <div className="grid gap-4 sm:grid-cols-2">
              {(['Left', 'Right'] as const).map((side) => {
                const loops = side === 'Left' ? initialLoopsLeft : initialLoopsRight;

                return (
                  <div key={side}>
                    <p className="mb-1 text-xs font-medium text-zinc-500">{side}</p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100">
                          <th className="py-1 pr-2 text-left text-zinc-400">Row</th>
                          {loopGroups.map((g) => (
                            <th key={g} className="px-2 py-1 text-center text-zinc-400">
                              {g}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lineRows.map((row) => (
                          <tr key={row} className="border-b border-zinc-50">
                            <td className="py-1 pr-2 font-medium text-zinc-600">{row}</td>
                            {loopGroups.map((g) => (
                              <td key={g} className="px-2 py-1 text-center text-zinc-500">
                                {loops[row]?.[g] ?? 0}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </details>
      )}

      <TrimGrid
        sessionId={session.id}
        gliderSize={gliderSize}
        existingMeasurements={session.trimMeasurements}
        measureMethod={session.measureMethod ?? 'differential'}
      />
    </div>
  );
}
