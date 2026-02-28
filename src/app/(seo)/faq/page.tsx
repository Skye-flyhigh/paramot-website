import FAQSection from '@/components/faq/FAQSection';
import FAQTableOfContents from '@/components/faq/FAQTableOfContents';
import JsonLd from '@/components/seo/JsonLd';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getAllFAQs, getVisibleCategories } from '@/data/faqs';
import { BUSINESS, SITE_URL } from '@/lib/metadata.const';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Everything you need to know about paraglider servicing, trim measurement, porosity testing, reserve repacking, and the Equipment Registry. Answers from an APPI-certified workshop.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: `FAQ | ${BUSINESS.name}`,
    description:
      'Answers to common questions about paraglider servicing, equipment care, and the paraMOT Equipment Registry.',
    url: `${SITE_URL}/faq`,
  },
};

export default function FAQPage() {
  const categories = getVisibleCategories();
  const allFAQs = getAllFAQs();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFAQs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <ScrollReveal className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold text-sky-900">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-sky-700">
              Everything you need to know about paraglider servicing, equipment care, and
              how we work. Can&apos;t find your answer?{' '}
              <Link
                href="/#contact"
                className="font-medium text-sky-600 underline hover:text-sky-800"
              >
                Get in touch
              </Link>
              .
            </p>
          </ScrollReveal>

          <div className="mb-12">
            <FAQTableOfContents categories={categories} />
          </div>

          <div className="space-y-12">
            {categories.map((category) => (
              <ScrollReveal key={category.slug}>
                <FAQSection category={category} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-sky-200 bg-white p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-sky-900">Still have questions?</h2>
            <p className="mb-4 text-sky-700">
              We&apos;re happy to help. Drop us a message and we&apos;ll get back to you.
            </p>
            <Link
              href="/#contact"
              className="inline-block rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700"
            >
              Contact us
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="font-medium text-sky-600 hover:text-sky-800">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
