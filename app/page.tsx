import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { Hero } from "@/components/hero";
import { CategoryGrid } from "@/components/category-grid";
import { BeautyRituals } from "@/components/beauty-rituals";
import { PopularSalons } from "@/components/popular-salons";
import { StyleQuiz } from "@/components/style-quiz";
import { AIFeatures } from "@/components/ai-features";
import { SalonOwnerFeatures } from "@/components/salon-owner-features";
import { ProductShowcase } from "@/components/product-showcase";
import { Testimonials } from "@/components/testimonials";
import { SmartWaitlist } from "@/components/smart-waitlist";
import { FoundingProgram } from "@/components/founding-program";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <CategoryGrid />
        <BeautyRituals />
        <PopularSalons />
        <StyleQuiz />
        <AIFeatures />
        <SalonOwnerFeatures />
        <ProductShowcase />
        <Testimonials />
        <SmartWaitlist />
        <FoundingProgram />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
