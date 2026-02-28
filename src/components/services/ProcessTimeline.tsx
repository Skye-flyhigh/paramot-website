import {
  AlertTriangle,
  Anchor,
  Cable,
  ClipboardList,
  Clock,
  CloudSun,
  Cog,
  Eye,
  FileCheck,
  FileText,
  Gauge,
  Hand,
  Layers,
  LifeBuoy,
  Link,
  Lock,
  Move,
  Package,
  Plane,
  Rocket,
  Ruler,
  ScanSearch,
  Search,
  ShieldCheck,
  User,
  Wind,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import ScrollReveal from '@/components/ui/ScrollReveal';
import type { ProcessStep } from '@/data/service-pages';

const iconMap: Record<string, LucideIcon> = {
  AlertTriangle,
  Anchor,
  Cable,
  ClipboardList,
  Clock,
  CloudSun,
  Cog,
  Eye,
  FileCheck,
  FileText,
  Gauge,
  Hand,
  Layers,
  LifeBuoy,
  Link,
  Lock,
  Move,
  Package,
  Plane,
  Rocket,
  Ruler,
  ScanSearch,
  Search,
  ShieldCheck,
  User,
  Wind,
  Wrench,
};

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <section>
      <ScrollReveal>
        <h2 className="mb-8 text-2xl font-bold text-sky-900">How it works</h2>
      </ScrollReveal>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-sky-200 md:left-8" />

        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon ? iconMap[step.icon] : null;

            return (
              <ScrollReveal key={step.step} delay={i * 0.1}>
                <div className="relative flex gap-4 md:gap-6">
                  {/* Step marker */}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 md:h-16 md:w-16 ${
                      step.critical
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-sky-200 bg-white'
                    }`}
                  >
                    {Icon ? (
                      <Icon
                        className={`h-5 w-5 md:h-6 md:w-6 ${step.critical ? 'text-amber-600' : 'text-sky-600'}`}
                      />
                    ) : (
                      <span
                        className={`text-sm font-bold ${step.critical ? 'text-amber-600' : 'text-sky-600'}`}
                      >
                        {step.step}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 rounded-xl border p-4 md:p-5 ${
                      step.critical
                        ? 'border-amber-200 bg-amber-50/50'
                        : 'border-sky-100 bg-white'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-sky-900">{step.title}</h3>
                      {step.critical && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-sky-700">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
