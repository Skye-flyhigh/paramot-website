import { BusinessInfo, FAQ } from './types/metadata';

export const SITE_URL = 'https://paramot.co.uk';

export const BUSINESS: BusinessInfo = {
  name: 'paraMOT',
  legalName: 'Skye Graille',
  tagline: '',
  address: {
    street: '56 Broad street',
    city: 'Blaenavon',
    postcode: 'NP4 9NH',
    country: 'UK',
  },
  email: 'hello@paramot.co.uk',
  foundingYear: 2026,
  description:
    'Professional paragliding wing servicing, trim measurement, cloth testing, reserve repacking, and harness inspections. APPI certified. Transparent digital reports. UK-based postal service available.',
  priceRange: '£50–£210',
  latitude: 51.77497,
  longitude: -3.08339,
};

export const FAQS: FAQ[] = [
  {
    question: 'What does a full paraglider service include?',
    answer:
      'A full service includes trim measurement and correction, cloth porosity testing, tear resistance testing (Bettsometer), line strength assessment, riser inspection, and a detailed digital report.',
  },
  {
    question: 'How often should I service my paraglider?',
    answer:
      'We recommend servicing annually or every 100 flying hours, per manufacturer recommendations. Wings flown in coastal or sandy conditions may need more frequent checks.',
  },
  {
    question: 'Can I post my paraglider for servicing?',
    answer:
      'Yes — we offer a postal service available UK-wide. Send us your equipment and we\u2019ll return it fully serviced with a detailed report.',
  },
  {
    question: 'What is the Equipment Registry?',
    answer:
      'The Equipment Registry is a public service history lookup by serial number, similar to an MOT check. Anyone can verify a wing\u2019s service history before purchasing.',
  },
  {
    question: 'How long does a paraglider service take?',
    answer:
      'Typically 3\u20135 working days depending on the service type and current workload. We\u2019ll confirm timescales when you get in touch.',
  },
  {
    question: 'Are you APPI certified?',
    answer:
      'Yes — trained and certified by the Association of Paragliding Pilots and Instructors (APPI).',
  },
  {
    question: 'How can I make my paraglider last longer?',
    answer:
      'Several actions to protect your paraglider: protect from UV, dry completely, avoid sand/dirt, use a concertina bag, no sharp bends.',
  },
  {
    question: 'Why is a "Trim Check" or "Line Trim" necessary?',
    answer:
      'Paraglider lines (especially Aramid or Dyneema) shrink or stretch over time due to humidity, temperature, and UV exposure. This causes the wing to lose its original flight characteristics, making it less safe and harder to launch. A trim check restores the wing to its optimal performance.',
  },
  {
    question: 'How long does a service usually take?',
    answer: 'Expect 1 to 2 weeks depending on the work necessary.',
  },
];
