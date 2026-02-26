import Link from 'next/link';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findAllManufacturers } from '@/lib/db/reference';

export default async function ReferencePage() {
  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const manufacturers = await findAllManufacturers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Reference Data</h2>
        <Link href="/workshop" className="text-sm text-zinc-500 hover:text-zinc-700">
          Back to Dashboard
        </Link>
      </div>

      <p className="text-sm text-zinc-500">
        Browse manufacturer specifications from ACT files. This data is read-only —
        updated via the ACT parser and seed scripts.
      </p>

      {manufacturers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
          No reference data loaded. Run the seed script to populate manufacturer data.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {manufacturers.map((mfr) => (
            <Link
              key={mfr.id}
              href={`/workshop/reference/${mfr.id}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <p className="font-medium text-zinc-900">{mfr.name}</p>
              <p className="text-sm text-zinc-400">
                {mfr._count.models} model{mfr._count.models !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
