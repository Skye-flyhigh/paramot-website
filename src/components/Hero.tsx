import { Button } from '@/components/ui/button';
import ScrollReveal from './ui/ScrollReveal';

export default function Hero() {
  return (
    <section className="relative bg-linear-to-br from-sky-800 via-sky-700 to-slate-800 text-white h-[60vh] px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-linear-to-br from-transparent via-sky-500/5 to-transparent" />
      </div>
      <div className="max-w-4xl flex flex-col items-center justify-center w-full h-full m-auto text-center relative z-10">
        <ScrollReveal>
        <h1 className="text-7xl font-bold mb-6 tracking-tight">
          para<span className="text-sky-300">MOT</span>
        </h1>

        </ScrollReveal>
        <ScrollReveal delay={0.2}>
        <p className="text-xl md:text-2xl mb-12 text-sky-100 font-medium">
          Paragliding servicing and repairs
        </p>
        </ScrollReveal>
            <ScrollReveal className="flex flex-col sm:flex-row gap-4 justify-center" delay={0.4}>
          <a href="#services" aria-label="View our services and pricing">
            <Button
              size="lg"
              className="bg-white text-sky-800 border-white hover:bg-sky-50"
            >
              Our Services
            </Button>
          </a>
          <a href="#contact" aria-label="Get a quote via our contact form">
            <Button
              variant="outline"
              size="lg"
              className="border-sky-200 text-sky-100 hover:bg-sky-200 hover:text-sky-800 backdrop-blur-sm"
            >
              Get Quote
            </Button>

          </a>
            </ScrollReveal>
      </div>
    </section>
  );
}
