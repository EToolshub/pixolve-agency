import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { StatsBand } from "@/components/home/StatsBand";
import { WhyUs } from "@/components/home/WhyUs";
import { CaseStudies } from "@/components/cases/CaseStudies";
import { GoogleReviewsBanner } from "@/components/home/GoogleReviewsBanner";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <StatsBand />
      <WhyUs />
      <ProcessPreview />
      <CaseStudies />
      <GoogleReviewsBanner />
      <CTASection />
    </>
  );
}
