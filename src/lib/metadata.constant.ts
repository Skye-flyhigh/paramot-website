import { BusinessInfo, FAQ } from "./types/metadata"

export const SITE_URL = "https://paramot.co.uk"

export const BUSINESS: BusinessInfo = {
    name: "paraMOT",
    legalName: "Skye Graille",
    tagline: "",
    address: {
        street: "56a Broad street",
        city: "Blaenavon",
        postcode: "XXX XXX",
        country: "UK"
  },
  email: 'hello@paramot.co.uk',
  foundingYear: 2026,
  description: 
    'Professional paragliding wing servicing, trim measurement, cloth testing, reserve repacking, and harness inspections. APPI certified. Transparent digital reports. UK-based postal service available.',
  priceRange: '£50–£210',
  latitude: 1245, //FIXME: put proper lat and long info for the business
  longitude: 1234
}

export const FAQS: FAQ[] = [
            {
          question: 'What does a full paraglider service include?',
            answer: 'A full service includes trim measurement and correction, cloth porosity testing, tear resistance testing (Bettsometer), line strength assessment, riser inspection, and a detailed digital report.',
        },
        {
          question: 'How often should I service my paraglider?',
            answer: 'We recommend servicing annually or every 100 flying hours, per manufacturer recommendations. Wings flown in coastal or sandy conditions may need more frequent checks.',
        },
        {
          question: 'Can I post my paraglider for servicing?',
            answer: 'Yes — we offer a postal service available UK-wide. Send us your equipment and we\u2019ll return it fully serviced with a detailed report.',
        },
        {
          question: 'What is the Equipment Registry?',
            answer: 'The Equipment Registry is a public service history lookup by serial number, similar to an MOT check. Anyone can verify a wing\u2019s service history before purchasing.',
        },
        {
          question: 'How long does a paraglider service take?',
            answer: 'Typically 3\u20135 working days depending on the service type and current workload. We\u2019ll confirm timescales when you get in touch.',
        },
        {
          question: 'Are you APPI certified?',
            answer: 'Yes — trained and certified by the Association of Paragliding Pilots and Instructors (APPI).',
        },
]