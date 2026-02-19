import Hero from '@/components/Hero';
import Contact from '@/components/home/Contact';
import EquipmentCTA from '@/components/home/EquipmentCTA';
import HowItWorks from '@/components/home/HowItWorks';
import Location from '@/components/home/Location';
import Motto from '@/components/home/Motto';
import Services from '@/components/home/Services';
import Trust from '@/components/home/Trust';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Motto />
      <Services />
      <HowItWorks />
      <Trust />
      <EquipmentCTA />
      <Contact />
      <Location />
    </main>
  );
}
