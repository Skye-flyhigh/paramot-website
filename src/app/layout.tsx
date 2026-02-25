import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { BUSINESS, SITE_URL } from '@/lib/metadata.constant';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
