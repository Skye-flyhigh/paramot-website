'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { CategorisedFAQ } from '@/lib/types/metadata';

interface ServiceFAQsProps {
  faqs: CategorisedFAQ[];
}

export default function ServiceFAQs({ faqs }: ServiceFAQsProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section>
      <ScrollReveal>
        <h2 className="mb-6 text-2xl font-bold text-sky-900">Common questions</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="divide-y divide-sky-100 rounded-xl border border-sky-100 bg-white">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id}>
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-sky-50"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-sky-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-sky-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed text-sky-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
