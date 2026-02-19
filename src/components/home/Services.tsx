import { getServicesList } from '@/lib/schema';
import { auth } from '@/auth';
import { ServiceCard } from './ServiceCard';

const categories = [
  {
    label: 'Paragliders',
    codes: ['SVC-001', 'SVC-011'],
  },
  {
    label: 'Tandems',
    codes: ['SVC-002', 'SVC-012'],
  },
  {
    label: 'Reserve & Harness',
    codes: ['PACK-001', 'PACK-002', 'SVC-031'],
  },
  {
    label: 'Repairs',
    codes: ['REP-001'],
  },
];

export default async function Services() {
  const session = await auth();
  const services = getServicesList();

  return (
    <section id="services" className="bg-gradient-to-b from-white to-sky-50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-sky-900">Services & Pricing</h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-sky-700">
            Transparent pricing, no hidden fees. Every service includes a detailed digital
            report.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((cat) => {
            const catServices = cat.codes
              .map((code) => services.find((s) => s.code === code))
              .filter(Boolean);

            if (catServices.length === 0) return null;

            return (
              <div key={cat.label}>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-sky-500">
                  {cat.label}
                </h3>
                <div
                  className={`grid grid-cols-1 gap-6 ${
                    catServices.length >= 3
                      ? 'sm:grid-cols-2 lg:grid-cols-3'
                      : catServices.length === 2
                        ? 'sm:grid-cols-2'
                        : ''
                  }`}
                >
                  {catServices.map(
                    (service) =>
                      service && (
                        <ServiceCard
                          key={service.code}
                          service={service}
                          pricing={service.cost}
                          session={session}
                        />
                      ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
