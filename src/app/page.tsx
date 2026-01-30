import { HeroSection } from "@/components/hero-section";
import { CardsSection } from "@/components/cards-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <CardsSection />
      <Footer />
    </main>
  );
}
