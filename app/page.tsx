import Header from "./components/Header";
import Hero from "./components/Hero";
import Pillars from "./components/Pillars";
import HowItWorks from "./components/HowItWorks";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Pillars />
        <HowItWorks />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
