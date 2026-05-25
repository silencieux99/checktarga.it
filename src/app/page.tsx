import NewsTicker from "@/components/home/NewsTicker";
import HomeHeader from "@/components/home/HomeHeader";
import HomeHero from "@/components/home/HomeHero";
import ItalyCoverageBanner from "@/components/home/ItalyCoverageBanner";
import WhatsNew from "@/components/home/WhatsNew";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PressTeaser from "@/components/home/PressTeaser";
import SpecialDetectionSection from "@/components/home/SpecialDetectionSection";
import AccidentReveal from "@/components/home/AccidentReveal";
import ExampleReportSection from "@/components/home/ExampleReportSection";
import HowItWorks from "@/components/home/HowItWorks";
import Faq from "@/components/home/Faq";
import BlogPreview from "@/components/home/BlogPreview";
import HomeFooter from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <div className="mobile-compact min-h-screen bg-white">
      <NewsTicker />
      <HomeHeader />
      <main>
        <HomeHero />
        <ItalyCoverageBanner />
        <WhatsNew />
        <WhyChooseUs />
        <PressTeaser />
        <SpecialDetectionSection />
        <AccidentReveal />
        <ExampleReportSection />
        <HowItWorks />
        <Faq />
        <BlogPreview />
      </main>
      <HomeFooter />
    </div>
  );
}
