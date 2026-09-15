import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { portfolioItems } from "@/data/portfolio";
import { siteConfig } from "@/data/site";

export function PortfolioPreview() {
  const preview = portfolioItems.slice(0, 6);

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Portafolio"
          title="Trabajos reales que hemos entregado"
          description="Una muestra de nuestro trabajo en branding, UI/UX y contenido para redes sociales."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {preview.map((item, index) => (
            <FadeIn key={item.behanceUrl} delay={index * 0.05}>
              <PortfolioCard item={item} />
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/portafolio">Ver portafolio completo</Button>
          <Button
            href={siteConfig.social.behance}
            variant="secondary"
            icon={<ExternalLink className="h-4 w-4" />}
            iconPosition="right"
          >
            Síguenos en Behance
          </Button>
        </div>
      </Container>
    </section>
  );
}
