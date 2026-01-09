import Hero from '@/components/Hero';
import Motto from '@/components/home/Motto';
import Services from '@/components/home/Services';
import Contact from '@/components/home/Contact';
import Location from '@/components/home/Location';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Motto />
      <Services />
      <Contact />
      <Location />
    </main>
  );
}
