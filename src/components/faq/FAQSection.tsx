'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FAQCategory } from '@/lib/types/metadata';
import {
  ClipboardList,
  LifeBuoy,
  Microscope,
  Mountain,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Microscope,
  ShieldCheck,
  Truck,
  ClipboardList,
  LifeBuoy,
  Mountain,
};

export default function FAQSection({ category }: { category: FAQCategory }) {
  const Icon = iconMap[category.icon];

  return (
    <section id={category.slug} className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-sky-200 shadow-inner">
            <Icon className="h-5 w-5 text-sky-600" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-sky-900">{category.name}</h2>
          <p className="text-sm text-sky-600">{category.description}</p>
        </div>
      </div>

      <Accordion
        type="multiple"
        className="rounded-xl border border-sky-100 bg-white px-6"
      >
        {category.faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} id={faq.id} className="scroll-mt-24">
            <AccordionTrigger className="text-left text-sky-900 hover:no-underline hover:text-sky-700">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-gray-700">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
