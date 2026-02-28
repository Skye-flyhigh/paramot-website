import {
  AlertCircle,
  Eye,
  PackageCheck,
  Shield,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import ContactModal from '@/components/ui/contact-modal';
import ServicePricing from '@/components/services/ServicePricing';
import JsonLd from '@/components/seo/JsonLd';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getAllServicePages, getServicePricing } from '@/data/service-pages';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Zap,
  Eye,
  PackageCheck,
  Wrench,
};

export const metadata: Metadata = {
  title: `Services — Paraglider Servicing & Inspection | ${BUSINESS.name}`,
  description:
    'Professional paraglider servicing: full APPI inspections, trim measurement, visual checks, harness inspections, reserve repacking, and repairs. Transparent pricing, digital reports.',
  keywords: [
    'paraglider servicing UK',
    'paraglider inspection',
    'wing service',
    'APPI certified workshop',
    'paraglider trim service',
    'reserve repack',
  ],
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: `Services | ${BUSINESS.name}`,
    description:
      'Professional paraglider servicing with transparent pricing and digital reports. APPI certified.',
    url: `${SITE_URL}/services`,
  },
};

export default function ServicesPage() {
  const pages = getAllServicePages();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: pages.map((page, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: page.pageTitle,
      url: `${SITE_URL}/services/${page.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <main className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold text-sky-900">Our Services</h1>
            <p className="mx-auto max-w-2xl text-lg text-sky-700">
              APPI-certified paraglider servicing with transparent pricing. Every service
              includes a detailed digital report accessible through our Equipment
              Registry.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, i) => {
              const pricing = getServicePricing(page.serviceCodes);
              const Icon = iconMap[page.icon] || Shield;

              return (
                <ScrollReveal key={page.slug} delay={i * 0.1}>
                  <Link
                    href={`/services/${page.slug}`}
                    className={`group block rounded-xl border bg-white p-6 transition-all hover:shadow-md ${
                      pricing.available
                        ? 'border-sky-100 hover:border-sky-300'
                        : 'border-sky-100 opacity-60'
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-sky-200 shadow-inner">
                        <Icon className="h-7 w-7 text-sky-600" />
                        {!pricing.available && (
                          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <ServicePricing pricing={pricing} />
                      </div>
                    </div>

                    <h2 className="mb-2 text-lg font-bold text-sky-900 group-hover:text-sky-700">
                      {page.pageTitle}
                    </h2>

                    {!pricing.available && (
                      <span className="mb-2 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                        Coming Soon
                      </span>
                    )}

                    <p className="text-sm leading-relaxed text-sky-700">
                      {page.heroDescription.slice(0, 120)}
                      {page.heroDescription.length > 120 ? '...' : ''}
                    </p>

                    <span className="mt-4 inline-block text-sm font-medium text-sky-600 group-hover:text-sky-800">
                      Learn more &rarr;
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 rounded-xl border border-sky-200 bg-white p-8 text-center">
              <h2 className="mb-2 text-xl font-bold text-sky-900">
                Not sure which service you need?
              </h2>
              <p className="mb-4 text-sky-700">
                Tell us about your equipment and we&apos;ll recommend the right service
                for your situation.
              </p>
              <ContactModal className="inline-block rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700">
                Get in touch
              </ContactModal>
            </div>
          </ScrollReveal>

          <div className="mt-8 text-center">
            <Link href="/" className="font-medium text-sky-600 hover:text-sky-800">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
