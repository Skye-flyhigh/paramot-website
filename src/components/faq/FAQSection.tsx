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
          <div className="h-10 w-10 shrink-0 pm-icon-box">
            <Icon className="h-5 w-5 text-sky-600" />
          </div>
        )}
        <div>
          <h2 className="pm-section-title">{category.name}</h2>
          <p className="text-sm text-sky-600">{category.description}</p>
        </div>
      </div>

      <Accordion type="multiple" className="pm-card px-6">
        {category.faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} id={faq.id} className="scroll-mt-24">
            <AccordionTrigger className="text-left text-sky-900 hover:no-underline hover:text-sky-700">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed pm-text-body">
              <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
