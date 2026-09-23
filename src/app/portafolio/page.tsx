import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Portafolio | Branding, UI/UX y Redes Sociales",
  description:
    "Explora nuestro portafolio de proyectos reales de diseño gráfico, branding, UI/UX y contenido para redes sociales, con enlace directo a cada estudio de caso en Behance.",
  alternates: { canonical: "/portafolio" },
};

export default function PortafolioPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Inicio", url: siteConfig.url },
    { name: "Portafolio", url: `${siteConfig.url}/portafolio` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <PageHero
        eyebrow="Portafolio"
        title="Proyectos que hemos"
        highlight="diseñado y desarrollado"
        description="Cada proyecto está publicado en nuestro perfil de Behance con el estudio de caso completo. Haz clic en cualquier pieza para verlo a detalle."
      >
        <Button
          href={siteConfig.social.behance}
          variant="secondary"
          icon={<ExternalLink className="h-4 w-4" />}
          iconPosition="right"
        >
          Ver perfil completo en Behance
        </Button>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <PortfolioGrid />
        </Container>
      </section>

      <CTASection title="¿Te gustó lo que viste? Tu marca puede ser la siguiente" />
    </>
  );
}
