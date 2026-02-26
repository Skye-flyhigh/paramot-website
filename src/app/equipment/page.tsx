import { Search } from 'lucide-react';

import EquipmentSearchForm from '@/components/equipment/EquipmentSearchForm';

export const metadata = {
  title: 'Equipment Registry | paraMOT',
  description:
    'Look up any paraglider, reserve, or harness by serial number. View full service history and airworthiness status.',
};

export default function EquipmentRegistryPage() {
  return (
    <main className="min-h-screen bg-sky-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
            <Search className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-sky-900">Equipment Registry</h1>
          <p className="mt-2 text-sky-600">
            Look up any paraglider, reserve, or harness by serial number.
            <br />
            View full service history and airworthiness status.
          </p>
        </div>

        {/* Search form */}
        <div className="mt-8">
          <EquipmentSearchForm />
        </div>

        {/* Info section */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <InfoCard
            title="Public Record"
            description="Service history is public — like checking a car's MOT history. Anyone can verify equipment condition."
          />
          <InfoCard
            title="APPI Certified"
            description="All inspections follow APPI standards. Airworthiness determinations are made by certified technicians."
          />
          <InfoCard
            title="Privacy First"
            description="Equipment data is public. Owner data is private. We never expose personal information."
          />
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-sky-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-sky-900">{title}</h3>
      <p className="mt-1 text-xs text-sky-500">{description}</p>
    </div>
  );
}
