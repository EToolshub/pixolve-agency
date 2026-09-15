import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyUs } from "@/components/home/WhyUs";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { GoogleReviewsBanner } from "@/components/home/GoogleReviewsBanner";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyUs />
      <PortfolioPreview />
      <GoogleReviewsBanner />
      <ProcessPreview />
      <CTASection />
    </>
  );
}
