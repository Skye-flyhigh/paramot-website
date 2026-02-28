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
import ScrollReveal from '../ui/ScrollReveal';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Microscope,
  ShieldCheck,
  Truck,
  ClipboardList,
  LifeBuoy,
  Mountain,
};

export default function FAQTableOfContents({
  categories,
}: {
  categories: FAQCategory[];
}) {
  return (
    <nav
      aria-label="FAQ categories"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.icon];

        return (
          <ScrollReveal key={cat.slug} delay={i * 0.2}>
            <a
              href={`#${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-sky-100 bg-white p-4 text-center transition-all hover:border-sky-300 hover:shadow-md"
            >
              {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 transition-colors group-hover:from-sky-100 group-hover:to-sky-200">
                  <Icon className="h-5 w-5 text-sky-500 transition-colors group-hover:text-sky-600" />
                </div>
              )}
              <span className="text-sm font-semibold text-sky-900">{cat.name}</span>
              <span className="text-xs text-sky-500">
                {cat.faqs.length} question{cat.faqs.length !== 1 ? 's' : ''}
              </span>
            </a>
          </ScrollReveal>
        );
      })}
    </nav>
  );
}
