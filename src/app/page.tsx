import StructuredData from "@/components/StructuredData";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StepsSection from "@/components/home/StepsSection";
import StatsSection from "@/components/home/StatsSection";
import MissionSection from "@/components/home/MissionSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingTeaserSection from "@/components/home/PricingTeaserSection";
import FaqSection from "@/components/home/FaqSection";
import SupportSection from "@/components/home/SupportSection";
import VinGuideSection from "@/components/home/VinGuideSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData />
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StepsSection />
        <StatsSection />
        <MissionSection />
        <TestimonialsSection />
        <PricingTeaserSection />
        <FaqSection />
        <SupportSection />
        <VinGuideSection />
      </main>
      <SiteFooter />
    </div>
  );
}
