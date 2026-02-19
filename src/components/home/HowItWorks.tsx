import { CalendarCheck, PackageOpen, Wrench, FileCheck } from 'lucide-react';

const steps = [
  {
    icon: CalendarCheck,
    title: 'Book',
    description: 'Choose your service and pick a date. We confirm within 24 hours.',
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
  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-sky-900">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-sky-700">
            From booking to flying again — four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              {/* Step number */}
              <div className="mb-4 flex justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 shadow-inner">
                  <step.icon className="h-8 w-8 text-sky-600" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-sky-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-sky-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
