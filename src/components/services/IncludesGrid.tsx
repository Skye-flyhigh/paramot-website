import { Check, X } from 'lucide-react';
import Link from 'next/link';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { IncludeItem } from '@/data/service-pages';

interface IncludesGridProps {
  items: IncludeItem[];
  upgradeNote?: string;
  upgradeSlug?: string;
}

export default function IncludesGrid({
  items,
  upgradeNote,
  upgradeSlug,
}: IncludesGridProps) {
  return (
    <section>
      <ScrollReveal>
        <h2 className="mb-6 text-2xl font-bold text-sky-900">What&apos;s included</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="rounded-xl border border-sky-100 bg-white p-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                {item.included ? (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100">
                    <Check className="h-4 w-4 text-sky-600" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <X className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <span className={item.included ? 'text-sky-900' : 'text-gray-400'}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {upgradeNote && upgradeSlug && (
            <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4">
              <p className="text-sm text-sky-700">
                {upgradeNote}{' '}
                <Link
                  href={`/services/${upgradeSlug}`}
                  className="font-medium text-sky-600 underline hover:text-sky-800"
                >
                  Learn more &rarr;
                </Link>
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
