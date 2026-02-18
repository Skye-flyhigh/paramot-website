import Hero from '@/components/Hero';
import Contact from '@/components/home/Contact';
import Location from '@/components/home/Location';
import Motto from '@/components/home/Motto';
import Services from '@/components/home/Services';

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
