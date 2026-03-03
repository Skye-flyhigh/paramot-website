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

import JsonLd from '@/components/seo/JsonLd';
import ServicePricing from '@/components/services/ServicePricing';
import ContactModal from '@/components/ui/contact-modal';
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
      <main className="pm-page">
        <div className="pm-container-lg">
          <div className="mb-12 text-center">
            <h1 className="hero-reveal mb-3 pm-page-title">Our Services</h1>
            <p className="hero-reveal-1 mx-auto max-w-2xl text-lg text-sky-700">
              APPI-certified paraglider servicing with transparent pricing. Every service
              includes a detailed digital report accessible through our Equipment
              Registry.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, i) => {
              const pricing = getServicePricing(page.serviceCodes);
              const Icon = iconMap[page.icon] || Shield;

              return (
                <ScrollReveal key={page.slug} delay={i * 0.1}>
                  <Link
                    href={`/services/${page.slug}`}
                    className={`group block p-6 pm-card-interactive ${
                      !pricing.available ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="relative h-14 w-14 pm-icon-box">
                        <Icon className="h-7 w-7 text-sky-600" />
                        {!pricing.available && (
                          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100/80">
                            <AlertCircle className="h-4 w-4 text-amber-700" />
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
                      <span className="mb-2 pm-badge-warn">Coming Soon</span>
                    )}

                    <p className="text-sm leading-relaxed text-sky-700">
                      {page.heroDescription.slice(0, 120)}
                      {page.heroDescription.length > 120 ? '...' : ''}
                    </p>

                    <span className="mt-4 inline-block text-sm pm-link">
                      Learn more &rarr;
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 pm-card-cta">
              <h2 className="mb-2 text-xl font-bold text-sky-900">
                Not sure which service you need?
              </h2>
              <p className="mb-4 text-sky-700">
                Tell us about your equipment and we&apos;ll recommend the right service
                for your situation.
              </p>
              <ContactModal className="pm-btn">Get in touch</ContactModal>
            </div>
          </ScrollReveal>

          <div className="mt-8 text-center">
            <Link href="/" className="pm-link">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
