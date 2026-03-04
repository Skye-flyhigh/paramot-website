import FAQAccordion from '@/components/ui/FAQAccordion';
import type { CategorisedFAQ } from '@/lib/types/metadata';

interface ServiceFAQsProps {
  faqs: CategorisedFAQ[];
}

export default function ServiceFAQs({ faqs }: ServiceFAQsProps) {
  return <FAQAccordion faqs={faqs} heading="Common questions" />;
}
