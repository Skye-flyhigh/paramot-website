import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-sky-800 via-sky-700 to-slate-800 text-white py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-sky-500/5 to-transparent"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          para<span className="text-sky-300">MOT</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-sky-100 font-medium">
          Paragliding servicing and repairs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#services">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-sky-800 border-white hover:bg-sky-50 w-full sm:w-auto"
            >
              Our Services
            </Button>
          </a>
          <a href="#contact">
            <Button
              variant="outline"
              size="lg"
              className="border-sky-200 text-sky-100 hover:bg-sky-200 hover:text-sky-800 backdrop-blur-sm w-full sm:w-auto"
            >
              Get Quote
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
