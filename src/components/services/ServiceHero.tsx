import { Eye, PackageCheck, Shield, Wrench, Zap, type LucideIcon } from 'lucide-react';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ServicePageConfig } from '@/data/service-pages';

import ContactModal from '@/components/ui/contact-modal';
import ServicePricing from './ServicePricing';

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Zap,
  Eye,
  PackageCheck,
  Wrench,
};

interface ServiceHeroProps {
  page: ServicePageConfig;
  pricing: {
    solo?: number;
    tandem?: number;
    regular?: number;
    steerable?: number;
    available: boolean;
  };
}

export default function ServiceHero({ page, pricing }: ServiceHeroProps) {
  const Icon = iconMap[page.icon] || Shield;

  return (
    <ScrollReveal>
      <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-sky-200 shadow-inner">
          <Icon className="h-10 w-10 text-sky-600" />
        </div>

        <div className="flex-1">
          <h1 className="mb-3 text-4xl font-bold text-sky-900">{page.pageTitle}</h1>

          {!pricing.available && (
            <span className="mb-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
              Currently unavailable
            </span>
          )}

          <p className="max-w-2xl text-lg leading-relaxed text-sky-700">
            {page.heroDescription}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-sky-200 bg-white p-6 shadow-sm">
          <ServicePricing pricing={pricing} />

          <div className="mt-4">
            {pricing.available ? (
              <ContactModal className="inline-block rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700">
                Get in touch
              </ContactModal>
            ) : (
              <ContactModal className="inline-block rounded-lg border border-sky-300 px-6 py-2.5 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50">
                Register interest
              </ContactModal>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
