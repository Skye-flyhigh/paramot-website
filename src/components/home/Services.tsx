import { getServicesList } from '@/lib/schema';

import ScrollReveal from '../ui/ScrollReveal';
import { ServiceCard } from './ServiceCard';
import ServiceComparisonGrid from './ServiceComparisonGrid';

const otherServiceCodes = ['PACK-001', 'PACK-002', 'SVC-031', 'REP-001'];

export default function Services() {
  const services = getServicesList();
  const otherServices = otherServiceCodes
    .map((code) => services.find((s) => s.code === code))
    .filter(Boolean);

  return (
    <section
      id="services"
      aria-label="Services and pricing"
      className="bg-linear-to-b from-white to-sky-50 px-4 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-sky-900">Services & Pricing</h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-sky-700">
            Transparent pricing, no hidden fees. Every service includes a detailed digital
            report.
          </p>
        </ScrollReveal>

        {/* Glider service comparison grid */}
        <div className="mb-16">
          <h3 className="mb-6 text-sm font-medium uppercase tracking-wide text-sky-500">
            Paraglider Services
          </h3>
          <ServiceComparisonGrid />
        </div>

        {/* Other services — compact cards */}
        <div>
          <h3 className="mb-6 text-sm font-medium uppercase tracking-wide text-sky-500">
            Reserve, Harness & Repairs
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map(
              (service) =>
                service && <ServiceCard key={service.code} service={service} />,
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
