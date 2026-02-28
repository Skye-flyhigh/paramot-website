import { Geist, Geist_Mono } from 'next/font/google';

import Footer from '@/components/Footer';
import MobileTabBar from '@/components/MobileTabBar';
import Nav from '@/components/Nav';
import { siteMetadata } from '@/lib/helper/metadata';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        <div className="pb-16 sm:pb-0">{children}</div>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}
