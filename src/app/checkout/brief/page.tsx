import type { Metadata } from "next";
import { BriefView } from "@/components/checkout/BriefView";

export const metadata: Metadata = {
  title: "Briefing de tu proyecto",
  robots: { index: false },
};

export default function BriefPage() {
  return <BriefView />;
}
