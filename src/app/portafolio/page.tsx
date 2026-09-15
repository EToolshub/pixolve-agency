import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { portfolioItems } from "@/data/portfolio";
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
      <section className="border-b border-default bg-alt py-20">
        <Container>
          <SectionHeading
            eyebrow="Portafolio"
            title="Proyectos que hemos diseñado y desarrollado"
            description="Cada proyecto está publicado en nuestro perfil de Behance con el estudio de caso completo. Haz clic en cualquier pieza para verlo a detalle."
          />
          <div className="mt-8 flex justify-center">
            <Button
              href={siteConfig.social.behance}
              variant="secondary"
              icon={<ExternalLink className="h-4 w-4" />}
              iconPosition="right"
            >
              Ver perfil completo en Behance
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {portfolioItems.map((item, index) => (
              <FadeIn key={item.behanceUrl} delay={(index % 8) * 0.05}>
                <PortfolioCard item={item} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
