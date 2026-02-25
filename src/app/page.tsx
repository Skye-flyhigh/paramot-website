import Hero from '@/components/Hero';
import ComingSoon from '@/components/home/ComingSoon';
import Contact from '@/components/home/Contact';
import EquipmentCTA from '@/components/home/EquipmentCTA';
import HowItWorks from '@/components/home/HowItWorks';
import Location from '@/components/home/Location';
import Motto from '@/components/home/Motto';
import Services from '@/components/home/Services';
import Trust from '@/components/home/Trust';
import JsonLd from '@/components/seo/JsonLd';
import { BUSINESS, FAQS, SITE_URL } from '@/lib/metadata.constant';
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
    'Cloth porosity testing',
    'Reserve repacking',
    'Harness inspection',
    'Line strength testing',
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
}

const services = getServicesList()

const servicesSchemas = services.map((service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  description: service.description,
  price: service.cost,
  priceCurrency: "GBP",
  provider: {
    "@type": "Organization",
    name: BUSINESS.name,
    url: SITE_URL,
  },
  offers: {
      "@type": "Offer",
      description: service.description,
      price: service.cost,
      availability: "https://schema.org/InStock",
    }
}))

const faqSchema = {
    "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

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
      <Services />
      <HowItWorks />
      <Trust />
      <ComingSoon />
      <EquipmentCTA />
      <Contact />
      <Location />
      </main>
      </>
  );
}
