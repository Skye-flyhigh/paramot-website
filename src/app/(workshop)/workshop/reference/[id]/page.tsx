import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findManufacturerById, findModelById } from '@/lib/db/reference';

interface ReferenceDetailProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ modelId?: string }>;
}

export default async function ReferenceDetailPage({
  params,
  searchParams,
}: ReferenceDetailProps) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const { id } = await params;
  const { modelId } = await searchParams;

  // If modelId is provided, show model detail
  if (modelId) {
    return <ModelDetail modelId={modelId} />;
  }

  // Otherwise show manufacturer with models
  const manufacturer = await findManufacturerById(id);

  if (!manufacturer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/workshop/reference"
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-bold text-zinc-900">{manufacturer.name}</h2>
      </div>

      {manufacturer.website && (
        <p className="text-sm text-zinc-500">
          <a
            href={manufacturer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-700"
          >
            {manufacturer.website}
          </a>
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {manufacturer.models.map((model) => (
          <Link
            key={model.id}
            href={`/workshop/reference/${id}?modelId=${model.id}`}
            className="rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <p className="font-medium text-zinc-900">{model.name}</p>
            <div className="mt-1 flex gap-2 text-xs text-zinc-400">
              {model.certificationClass && (
                <span className="rounded bg-zinc-100 px-2 py-0.5">
                  {model.certificationClass}
                </span>
              )}
              <span>
                {model._count.sizes} size{model._count.sizes !== 1 ? 's' : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {manufacturer.models.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
          No models loaded for this manufacturer.
        </div>
      )}
    </div>
  );
}

async function ModelDetail({ modelId }: { modelId: string }) {
  const model = await findModelById(modelId);

  if (!model) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/workshop/reference/${model.manufacturerId}`}
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs text-zinc-400">{model.manufacturer.name}</p>
          <h2 className="text-2xl font-bold text-zinc-900">{model.name}</h2>
        </div>
      </div>

      {/* Model info */}
      <div className="grid gap-4 sm:grid-cols-3">
        {model.certificationClass && (
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-400">Certification</p>
            <p className="text-sm font-medium text-zinc-900">
              {model.certificationClass}
            </p>
          </div>
        )}
        {model.numLineRows && (
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-400">Line Rows</p>
            <p className="text-sm font-medium text-zinc-900">{model.numLineRows}</p>
          </div>
        )}
        {model.measurementMethod && (
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-400">Measurement Method</p>
            <p className="text-sm font-medium text-zinc-900">{model.measurementMethod}</p>
          </div>
        )}
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Sizes ({model.sizes.length})
        </h3>
        <div className="space-y-3">
          {model.sizes.map((size) => (
            <details key={size.id} className="rounded-lg border border-zinc-200 bg-white">
              <summary className="cursor-pointer p-4 hover:bg-zinc-50">
                <div className="inline-flex items-center gap-4">
                  <span className="font-medium text-zinc-900">{size.sizeLabel}</span>
                  <span className="text-sm text-zinc-400">
                    {size.minWeight}–{size.maxWeight} kg
                  </span>
                  {size.wingArea && (
                    <span className="text-sm text-zinc-400">{size.wingArea} m²</span>
                  )}
                  {size.aspectRatio && (
                    <span className="text-sm text-zinc-400">AR {size.aspectRatio}</span>
                  )}
                  {size.numLinesPerSide && (
                    <span className="text-sm text-zinc-400">
                      {size.numLinesPerSide} lines/side
                    </span>
                  )}
                </div>
              </summary>
              <div className="border-t border-zinc-100 p-4">
                <LineLengthTable lineLengths={size.lineLengths} />
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Line materials */}
      {model.lineMaterials.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Line Materials ({model.lineMaterials.length})
          </h3>
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Line ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Row
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Cascade
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Brand
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Ref
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                    Strength New
                  </th>
                </tr>
              </thead>
              <tbody>
                {model.lineMaterials.map((mat) => (
                  <tr key={mat.id} className="border-t border-zinc-100">
                    <td className="px-3 py-2 font-mono">{mat.lineId}</td>
                    <td className="px-3 py-2">{mat.lineRow}</td>
                    <td className="px-3 py-2">{mat.cascadeLevel}</td>
                    <td className="px-3 py-2">{mat.brand}</td>
                    <td className="px-3 py-2 font-mono">{mat.materialRef}</td>
                    <td className="px-3 py-2">
                      {mat.strengthNew ? `${mat.strengthNew} daN` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface LineLengthEntry {
  lineId: string;
  row: string;
  position: number;
  cascade: number;
  lengthMm: number;
}

function LineLengthTable({ lineLengths }: { lineLengths: unknown }) {
  const entries = lineLengths as LineLengthEntry[] | null;

  if (!Array.isArray(entries) || entries.length === 0) {
    return <p className="text-sm text-zinc-400">No line length data available.</p>;
  }

  // Build grid: rows × positions, cascade 1 only
  const cascade1 = entries.filter((e) => e.cascade === 1);
  const rows = [...new Set(cascade1.map((e) => e.row))];
  const positions = [...new Set(cascade1.map((e) => e.position))].sort((a, b) => a - b);

  const rowOrder = ['A', 'B', 'C', 'D', 'E', 'K'];

  rows.sort((a, b) => rowOrder.indexOf(a) - rowOrder.indexOf(b));

  const lookup = new Map<string, number>();

  cascade1.forEach((e) => lookup.set(`${e.row}-${e.position}`, e.lengthMm));

  return (
    <div className="overflow-x-auto">
      <table className="text-xs">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left font-medium text-zinc-500">Row</th>
            {positions.map((pos) => (
              <th key={pos} className="px-2 py-1 text-center font-medium text-zinc-500">
                {pos}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="px-2 py-1 font-mono font-bold text-zinc-700">{row}</td>
              {positions.map((pos) => {
                const val = lookup.get(`${row}-${pos}`);

                return (
                  <td key={pos} className="px-2 py-1 text-center font-mono text-zinc-600">
                    {val != null ? val : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
