import ScrollReveal from '../ui/ScrollReveal';

export default function Motto() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-sky-50 to-white">
      <ScrollReveal className="max-w-4xl mx-auto text-center" delay={0.5}>
        <h2 className="text-4xl font-bold mb-6 text-sky-900">
          Precision servicing for the equipment you trust
        </h2>
        <p className="text-sky-700 text-lg leading-relaxed max-w-2xl mx-auto">
          Every measurement documented. Every correction traceable. Your paraglider&apos;s
          airworthiness, verified to the millimetre.
        </p>
      </ScrollReveal>
    </section>
  );
}
