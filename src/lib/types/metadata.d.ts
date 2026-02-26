export interface FAQ {
  question: string;
  answer: string;
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
