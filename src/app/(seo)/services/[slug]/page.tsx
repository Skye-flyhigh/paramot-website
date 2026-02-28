import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import IncludesGrid from '@/components/services/IncludesGrid';
import ProcessTimeline from '@/components/services/ProcessTimeline';
import ServiceCTA from '@/components/services/ServiceCTA';
import ServiceFAQs from '@/components/services/ServiceFAQs';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceImage from '@/components/services/ServiceImage';
import JsonLd from '@/components/seo/JsonLd';
import { getFAQsByIds } from '@/data/faqs';
import {
  getAllServicePageSlugs,
  getServicePageBySlug,
  getServicePricing,
} from '@/data/service-pages';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllServicePageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/services/${slug}`,
    },
    other: {
      'geo.region': 'GB-WLS',
      'geo.placename': BUSINESS.address.city,
      'geo.position': `${BUSINESS.latitude};${BUSINESS.longitude}`,
      ICBM: `${BUSINESS.latitude}, ${BUSINESS.longitude}`,
    },
  };
}

/** Build schema.org Offer objects from pricing result */
function buildOffers(pricing: ReturnType<typeof getServicePricing>) {
  const availability = pricing.available
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  const offers: Record<string, unknown>[] = [];

  if (pricing.solo !== undefined) {
    offers.push({
      '@type': 'Offer',
      name: pricing.tandem !== undefined ? 'Solo wing' : undefined,
      price: pricing.solo,
      priceCurrency: 'GBP',
      availability,
    });
  }

  if (pricing.tandem !== undefined) {
    offers.push({
      '@type': 'Offer',
      name: 'Tandem wing',
      price: pricing.tandem,
      priceCurrency: 'GBP',
      availability,
    });
  }

  if (pricing.regular !== undefined) {
    offers.push({
      '@type': 'Offer',
      name: pricing.steerable !== undefined ? 'Standard reserve' : undefined,
      price: pricing.regular,
      priceCurrency: 'GBP',
      availability,
    });
  }

  if (pricing.steerable !== undefined) {
    offers.push({
      '@type': 'Offer',
      name: 'Steerable reserve',
      price: pricing.steerable,
      priceCurrency: 'GBP',
      availability,
    });
  }

  return offers;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) notFound();

  const pricing = getServicePricing(page.serviceCodes);
  const faqs = getFAQsByIds(page.relatedFAQIds);
  const offers = buildOffers(pricing);

  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.pageTitle,
    description: page.heroDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.city,
        postalCode: BUSINESS.address.postcode,
        addressCountry: BUSINESS.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS.latitude,
        longitude: BUSINESS.longitude,
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    ...(offers.length > 0 ? { offers } : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${SITE_URL}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.pageTitle,
        item: `${SITE_URL}/services/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <main className="min-h-screen bg-linear-to-br from-sky-50 to-blue-100 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <ServiceHero page={page} pricing={pricing} />

          <div className="mt-12 space-y-12">
            {page.images.length > 0 && (
              <section>
                <div className="grid gap-4 sm:grid-cols-2">
                  {page.images.map((image) => (
                    <ServiceImage key={image.alt} image={image} />
                  ))}
                </div>
              </section>
            )}

            <ProcessTimeline steps={page.processSteps} />
            <IncludesGrid
              items={page.includes}
              upgradeNote={page.upgradeNote}
              upgradeSlug={page.upgradeSlug}
            />
            <ServiceFAQs faqs={faqs} />
            <ServiceCTA available={pricing.available} />
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="font-medium text-sky-600 hover:text-sky-800"
            >
              &larr; Back to Services
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
