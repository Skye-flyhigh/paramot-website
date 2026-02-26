import { Metadata } from "next";
import { BUSINESS, SITE_URL } from "../metadata.const";

export const siteMetadata: Metadata = {
  title: {
    default: `${BUSINESS.name} — Paragliding Servicing & Repairs in South Wales`,
    template: `%s | ${BUSINESS.name}`,
  },
    description: BUSINESS.description,
  keywords: [
    'paragliding servicing',
    'paraglider trim',
    'reserve repack',
    'parachute repack',
    'harness inspection',
    'APPI certified',
    'cloth porosity testing',
    'paraglider repair UK',
    'wing service',
    'line strength testing',
  ],
  authors: [{ name: BUSINESS.legalName }],
  creator: BUSINESS.legalName,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${BUSINESS.name} — Paragliding Servicing & Repairs in South Wales`,
    description: BUSINESS.description,
    url: SITE_URL,
    siteName: BUSINESS.name,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS.name} — Paragliding Servicing & Repairs in South Wales`,
    description: BUSINESS.description,
  },
  robots: { index: true, follow: true },
};
