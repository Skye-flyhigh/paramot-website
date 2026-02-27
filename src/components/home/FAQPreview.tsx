'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getHomepageFAQs } from '@/data/faqs';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function FAQPreview() {
  const faqs = getHomepageFAQs();

  if (faqs.length === 0) return null;

  return (
    <section aria-label="Frequently asked questions" className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
            <HelpCircle className="h-6 w-6 text-sky-600" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-sky-900">Common Questions</h2>
          <p className="text-sky-700">Quick answers about our services and process.</p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-xl border border-sky-100 bg-white px-6"
        >
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-sky-900 hover:no-underline hover:text-sky-700">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 text-center">
          <Link href="/faq" className="font-medium text-sky-600 hover:text-sky-800">
            See all FAQs &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
