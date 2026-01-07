import prices from '@/data/prices.json';
import { auth } from '@/auth';
import { ServiceCard } from './ServiceCard';
import { getServicesList, Prices } from '@/lib/schema';

export default async function Services() {
  const session = await auth();
  const pricing = prices as Prices;

  const services = getServicesList();

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-sky-900">Our Services</h2>
          <p className="text-sky-700 max-w-3xl mx-auto text-lg leading-relaxed">
            Professional paragliding equipment services with meticulous attention to
            safety and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.code}
              service={service}
              pricing={pricing[service.code]}
              session={session}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
