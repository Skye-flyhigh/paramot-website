import Hero from '@/components/Hero';
import Contact from '@/components/home/Contact';
import ComingSoon from '@/components/home/ComingSoon';
import EquipmentCTA from '@/components/home/EquipmentCTA';
import HowItWorks from '@/components/home/HowItWorks';
import Location from '@/components/home/Location';
import Motto from '@/components/home/Motto';
import Services from '@/components/home/Services';
import Trust from '@/components/home/Trust';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      name: 'paraMOT',
      description:
        'Professional paragliding wing servicing, trim measurement, cloth testing, reserve repacking, and harness inspections.',
      url: 'https://paramot.co.uk',
      email: 'hello@paramot.co.uk',
      priceRange: '£50–£210',
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      knowsAbout: [
        'Paraglider servicing',
        'Wing trim measurement',
        'Cloth porosity testing',
        'Reserve repacking',
        'Harness inspection',
        'Line strength testing',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does a full paraglider service include?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A full service includes trim measurement and correction, cloth porosity testing, tear resistance testing (Bettsometer), line strength assessment, riser inspection, and a detailed digital report.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I service my paraglider?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We recommend servicing annually or every 100 flying hours, per manufacturer recommendations. Wings flown in coastal or sandy conditions may need more frequent checks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I post my paraglider for servicing?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — we offer a postal service available UK-wide. Send us your equipment and we\u2019ll return it fully serviced with a detailed report.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Equipment Registry?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Equipment Registry is a public service history lookup by serial number, similar to an MOT check. Anyone can verify a wing\u2019s service history before purchasing.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a paraglider service take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Typically 3\u20135 working days depending on the service type and current workload. We\u2019ll confirm timescales when you get in touch.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are you APPI certified?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — trained and certified by the Association of Paragliding Pilots and Instructors (APPI).',
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
  );
}
