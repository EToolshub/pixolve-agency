import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { BehanceLink, CaseStudyList } from "@/components/cases/CaseStudies";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { caseStudies } from "@/data/cases";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Portafolio | Casos reales de páginas web y redes sociales",
  description:
    "Casos reales de Pixolve Agency: la web de Signum Media, la tienda de pedidos de Una Vainita y los Shorts diarios de Monitor BTC. Proyectos en vivo que puedes visitar.",
  alternates: { canonical: "/portafolio" },
};

export default function PortafolioPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Inicio", url: siteConfig.url },
    { name: "Portafolio", url: `${siteConfig.url}/portafolio` },
  ]);

  const works = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Casos reales de Pixolve Agency",
    itemListElement: caseStudies.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: `${c.client}: ${c.title}`,
        description: c.challenge,
        url: c.link.href,
        creator: { "@id": `${siteConfig.url}/#organization` },
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={works} />
      <PageHero
        eyebrow="Portafolio"
        title="Casos reales"
        highlight="que ya están funcionando"
        description="Webs publicadas y contenido que sale cada día. Cada caso tiene su enlace para que lo veas tú mismo."
      >
        <Button href="#casos" icon={<ArrowDown className="h-4 w-4" />} iconPosition="right">
          Ver los casos
        </Button>
      </PageHero>

      <section id="casos" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <CaseStudyList items={caseStudies} />
          <BehanceLink className="mt-20" />
        </Container>
      </section>

      <CTASection title="¿Te gustó lo que viste? Tu marca puede ser la siguiente" />
    </>
  );
}
