import Hero from '@/components/Hero';
import ComingSoon from '@/components/home/ComingSoon';
import Contact from '@/components/home/Contact';
import EquipmentCTA from '@/components/home/EquipmentCTA';
import FAQPreview from '@/components/home/FAQPreview';
import HowItWorks from '@/components/home/HowItWorks';
import Location from '@/components/home/Location';
import Motto from '@/components/home/Motto';
import Services from '@/components/home/Services';
import Trust from '@/components/home/Trust';
import JsonLd from '@/components/seo/JsonLd';
import StickyPicture from '@/components/ui/sticky-pic';
import { getAllFAQs } from '@/data/faqs';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';
import { getServicesList } from '@/lib/schema';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS.name,
  description: BUSINESS.description,
  url: SITE_URL,
  email: BUSINESS.email,
  priceRange: BUSINESS.priceRange,
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  knowsAbout: [
    'Paraglider servicing',
    'Wing trim measurement',
    'Paraglider trimming',
    'Cloth porosity testing',
    'Ripstop strength testing',
    'Reserve repacking',
    'Harness inspection',
    'Line strength testing',
    'Annual Check',
    'Laser Line Measurmment',
    'Fabric Inspection',
    'Tear Stregth (Bettsometre)',
    'Riser Inspection',
    'Carabiner Inspection',
    'Service report',
    'Wing',
    'Harness',
    'Risers',
    'Porosity test',
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
};

const services = getServicesList();

const servicesSchemas = services.map((service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  description: service.description,
  price: service.cost,
  priceCurrency: 'GBP',
  provider: {
    '@type': 'Organization',
    name: BUSINESS.name,
    url: SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    description: service.description,
    price: service.cost,
    availability: service.available
      ? 'https://schema.org/InStock'
      : 'https://schema.org/Discontinued',
  },
}));

const allFAQs = getAllFAQs();

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFAQs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const pictures = [
  { url: '/images/sewing.jpeg', alt: 'Sewing up a panel on a paraglider' },
  { url: '/images/inspection.jpeg', alt: 'Inspecting glider cloth' },
];

export default function Home() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      {servicesSchemas.map((schema) => (
        <JsonLd key={schema.name} data={schema} />
      ))}
      <JsonLd data={faqSchema} />
      <main className="min-h-screen">
        <Hero />
        <Motto />
        <StickyPicture picture={pictures[1]} />
        <Services />
        <StickyPicture picture={pictures[0]} />
        <HowItWorks />
        <Trust />
        <FAQPreview />
        <ComingSoon />
        <EquipmentCTA />
        <Contact />
        <Location />
      </main>
    </>
  );
}
