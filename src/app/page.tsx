import Hero from "./components/Hero";
import Motto from "./components/Motto";
import Services from "./components/Services";
import ContactForm from "./components/ContactForm";
import Location from "./components/Location";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Motto />
      <Services />
      <ContactForm />
      <Location />
      <Footer />
    </main>
  );
}
