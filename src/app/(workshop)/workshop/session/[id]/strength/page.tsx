import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import {
  calculateLoadDistribution,
  calculateStrengthThresholds,
  classifyLineMaterial,
  getTestGuidance,
} from '@/lib/workshop/strength-calculations';
import ChecklistPanel from '@/components/workshop/ChecklistPanel';

interface StrengthPageProps {
  params: Promise<{ id: string }>;
}

export default async function StrengthPage({ params }: StrengthPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Line strength testing only applies to gliders.
      </div>
    );
  }

  // Load reference data
  const gliderSize = session.gliderSizeId
    ? await findSizeById(session.gliderSizeId)
    : null;

  const numRows = gliderSize?.gliderModel?.numLineRows ?? 3;
  const maxWeight = gliderSize?.maxWeight ?? 100;

  const loadDistribution = calculateLoadDistribution(numRows, maxWeight);
  const lineMaterials = gliderSize?.gliderModel?.lineMaterials ?? [];
  const thresholds = calculateStrengthThresholds(lineMaterials);

  // Get unique material types for guidance
  const materialTypes = new Map<
    string,
    { brand: string; ref: string; type: string; guidance: string }
  >();

  for (const mat of lineMaterials) {
    if (!mat.brand || materialTypes.has(`${mat.brand}-${mat.materialRef}`)) continue;
    const type = classifyLineMaterial(mat.brand, mat.materialRef ?? '');

    materialTypes.set(`${mat.brand}-${mat.materialRef}`, {
      brand: mat.brand,
      ref: mat.materialRef ?? '',
      type,
      guidance: getTestGuidance(type),
    });
  }

  // Strength checklist steps
  const strengthChecklist = session.checklist.filter(
    (c) => c.serviceType === 'strength_check',
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">Line Strength Testing</h3>

      {/* Load distribution */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h4 className="text-sm font-medium uppercase tracking-wide text-zinc-500 mb-3">
          Load Distribution ({numRows} rows · {maxWeight}kg max)
        </h4>
        <div className="grid gap-2 sm:grid-cols-4">
          {loadDistribution.map((ld) => (
            <div
              key={ld.row}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-center"
            >
              <p className="font-mono text-lg font-bold text-zinc-900">{ld.row}</p>
              <p className="text-sm text-zinc-600">{ld.percentage}%</p>
              <p className="text-xs text-zinc-400">{ld.loadKg.toFixed(1)} kg</p>
            </div>
          ))}
        </div>
      </div>

      {/* Material reference + thresholds */}
      {thresholds.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="p-4 pb-2">
            <h4 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Destructive Test Thresholds
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t bg-zinc-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Row
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Cascade
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                    Strength New
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                    <span className="text-amber-600">Warning (&lt;20%)</span>
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                    <span className="text-red-600">Reject (&lt;10%)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {thresholds.map((t, i) => (
                  <tr key={i} className="border-t border-zinc-100">
                    <td className="px-3 py-2 font-mono font-medium text-zinc-700">
                      {t.lineRow}
                    </td>
                    <td className="px-3 py-2 text-zinc-600">L{t.cascadeLevel}</td>
                    <td className="px-3 py-2 text-right font-mono text-zinc-700">
                      {t.strengthNew} daN
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-amber-600">
                      {t.warningThreshold.toFixed(1)} daN
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-red-600">
                      {t.rejectThreshold.toFixed(1)} daN
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Material type guidance */}
      {materialTypes.size > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Line Material Guidance
          </h4>
          {Array.from(materialTypes.values()).map((mat) => (
            <div
              key={`${mat.brand}-${mat.ref}`}
              className="rounded-lg border border-zinc-200 bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-700 text-sm">{mat.brand}</span>
                <span className="font-mono text-xs text-zinc-400">{mat.ref}</span>
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                  {mat.type}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{mat.guidance}</p>
            </div>
          ))}
        </div>
      )}

      {/* Strength checklist */}
      {strengthChecklist.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Checklist
          </h4>
          <ChecklistPanel steps={strengthChecklist} sequential={false} />
        </div>
      )}

      {!gliderSize && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
          No reference data linked to this session. Link a glider model + size to see load
          distribution and strength thresholds.
        </div>
      )}
    </div>
  );
}
