'use client'

import useWindowSize from '@/lib/helper/useWindowSize';
import { CalendarCheck, FileCheck, PackageOpen, Wrench } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const steps = [
  {
    icon: CalendarCheck,
    title: 'Get in Touch',
    description:
      'Drop us a message with your equipment details. We\u2019ll confirm availability and arrange logistics.',
  },
  {
    icon: PackageOpen,
    title: 'Send or Bring',
    description:
      'Post your gear to us or drop it off at the workshop. We handle it from there.',
  },
  {
    icon: Wrench,
    title: 'Service',
    description:
      'We inspect, measure, and fix. Every step documented, nothing left to guesswork.',
  },
  {
    icon: FileCheck,
    title: 'Report',
    description:
      'You get a detailed report with measurements, photos, and airworthiness status — accessible anytime online.',
  },
];

export default function HowItWorks() {
const windowSize = useWindowSize()

  return (
    <section aria-label="How the service process works" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-16 text-center">
            
          <h2 className="mb-4 text-4xl font-bold text-sky-900">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-sky-700">
            From first contact to flying again — four simple steps.
          </p>
</ScrollReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const side = i % 2 === 0 && windowSize.width && windowSize.width < 1000
    ? 'left'
    : 'right';

            return (
                <ScrollReveal key={step.title} direction={side} delay={0.2 +0.2 * i} className="relative text-center">
              {/* Step number */}
              <div className="mb-4 flex justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-sky-200 shadow-inner">
                  <step.icon className="h-8 w-8 text-sky-600" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-sky-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-sky-700">{step.description}</p>
                </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  );
}
