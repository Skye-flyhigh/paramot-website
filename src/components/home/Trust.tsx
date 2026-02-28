import { Award, Eye, Search, Truck } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

const signals = [
  {
    icon: Award,
    title: 'APPI Certified',
    description:
      'Trained and certified by the Association of Paragliding Pilots and Instructors.',
  },
  {
    icon: Eye,
    title: 'Transparent Reports',
    description:
      'Every measurement, every test result, every correction — documented and accessible online.',
  },
  {
    icon: Search,
    title: 'Equipment Registry',
    description:
      "Look up any glider's service history by serial number. Like an MOT check for paragliders.",
  },
  {
    icon: Truck,
    title: 'Postal Service',
    description:
      "Can't visit the workshop? Post your gear to us and we'll return it fully serviced.",
  },
];

export default function Trust() {
  return (
    <section
      aria-label="Why choose paraMOT"
      className="bg-gradient-to-b from-sky-50 to-white px-4 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-sky-900">Why paraMOT</h2>
          <p className="mx-auto max-w-2xl text-lg text-sky-700">
            Built by a pilot, for pilots. We set a new standard for workshop transparency.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {signals.map((signal, i) => (
            <ScrollReveal
              key={signal.title}
              delay={0.2 + 0.1 * i}
              className="flex gap-4 rounded-xl border border-sky-100 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 shadow-inner">
                <signal.icon className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-sky-900">{signal.title}</h3>
                <p className="text-sm leading-relaxed text-sky-700">
                  {signal.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
