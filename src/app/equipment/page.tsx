import type { Metadata } from 'next';
import { Search } from 'lucide-react';

import EquipmentSearchForm from '@/components/equipment/EquipmentSearchForm';
import JsonLd from '@/components/seo/JsonLd';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';

export const metadata: Metadata = {
  title: `Equipment Registry — Service History Lookup | ${BUSINESS.name}`,
  description:
    'Look up any paraglider, reserve, or harness by serial number. View full service history and airworthiness status. Like an MOT check for paragliders.',
  keywords: [
    'paraglider service history',
    'used paraglider check',
    'wing serial number lookup',
    'paraglider airworthiness',
    'equipment registry',
  ],
  alternates: {
    canonical: `${SITE_URL}/equipment`,
  },
  openGraph: {
    title: `Equipment Registry | ${BUSINESS.name}`,
    description:
      'Look up any paraglider by serial number. View service history and airworthiness status — like checking a car MOT.',
    url: `${SITE_URL}/equipment`,
  },
};

export default function EquipmentRegistryPage() {
  const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${BUSINESS.name} Equipment Registry`,
    description:
      'Look up paraglider service history by serial number. Public service records for transparency in the used equipment market.',
    url: `${SITE_URL}/equipment`,
    applicationCategory: 'UtilityApplication',
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS.name,
    },
  };

  return (
    <>
      <JsonLd data={searchSchema} />
      <main className="pm-page">
        <div className="pm-container-sm">
          {/* Header */}
          <div className="text-center">
            <div className="hero-reveal mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
              <Search className="h-8 w-8 text-sky-600" />
            </div>
            <h1 className="hero-reveal mt-4 text-3xl font-bold text-sky-900">
              Equipment Registry
            </h1>
            <p className="hero-reveal-1 mt-2 text-sky-600">
              Look up any paraglider, reserve, or harness by serial number.
              <br />
              View full service history and airworthiness status.
            </p>
          </div>

          {/* Search form */}
          <div className="mt-8 hero-reveal-2">
            <EquipmentSearchForm />
          </div>

          {/* Info section */}
          <ScrollReveal delay={0.5} className="mt-12 grid gap-6 sm:grid-cols-3">
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
          </ScrollReveal>
        </div>
      </main>
    </>
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
