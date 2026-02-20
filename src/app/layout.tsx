import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'paraMOT — Paragliding Servicing & Repairs',
  description:
    'Professional paragliding wing servicing, trim measurement, cloth testing, reserve repacking, and harness inspections. APPI certified. Transparent digital reports. UK-based postal service available.',
  keywords: [
    'paragliding servicing',
    'paraglider trim',
    'reserve repack',
    'harness inspection',
    'APPI certified',
    'cloth porosity testing',
    'paraglider repair UK',
    'wing service',
    'line strength testing',
  ],
  authors: [{ name: 'paraMOT' }],
  openGraph: {
    title: 'paraMOT — Paragliding Servicing & Repairs',
    description:
      'Professional paragliding equipment servicing with transparent digital reports.',
    url: 'https://paramot.co.uk',
    siteName: 'paraMOT',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'paraMOT — Paragliding Servicing & Repairs',
    description:
      'Professional paragliding equipment servicing with transparent digital reports.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://paramot.co.uk'),
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
