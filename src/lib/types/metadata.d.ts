export interface FAQ {
  question: string;
  answer: string;
}

export interface CategorisedFAQ extends FAQ {
  id: string;
  /** Service codes that must be available for this FAQ to show. Omit for always-visible. */
  serviceCodes?: string[];
}

export interface FAQCategory {
  name: string;
  slug: string;
  icon: string;
  description: string;
  faqs: CategorisedFAQ[];
}

export interface BusinessInfo {
  name: string;
  legalName: string;
  tagline: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  foundingYear: number;
  description: string;
  email: string;
  priceRange: string;
  latitude: number;
  longitude: number;
}
