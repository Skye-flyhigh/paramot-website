import Hero from "@/components/Hero";
import Motto from "@/components/home/Motto";
import Services from "@/components/home/Services";
import ContactForm from "@/components/home/ContactForm";
import Location from "@/components/home/Location";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Motto />
      <Services />
      <ContactForm />
      <Location />
    </main>
  );
}
