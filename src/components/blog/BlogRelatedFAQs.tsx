import FAQAccordion from '@/components/ui/FAQAccordion';
import type { CategorisedFAQ } from '@/lib/types/metadata';

interface BlogRelatedFAQsProps {
  faqs: CategorisedFAQ[];
}

export default function BlogRelatedFAQs({ faqs }: BlogRelatedFAQsProps) {
  return <FAQAccordion faqs={faqs} heading="Related questions" className="mt-12" />;
}
