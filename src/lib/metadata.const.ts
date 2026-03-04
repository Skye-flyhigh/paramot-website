import { getPriceRange } from './schema';
import { BusinessInfo } from './types/metadata';

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
  priceRange: getPriceRange(),
  latitude: 51.77497,
  longitude: -3.08339,
};
