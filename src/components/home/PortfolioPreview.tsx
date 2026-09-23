import { ArrowRight, ExternalLink } from "lucide-react";
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
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Portafolio"
            title="Trabajos reales"
            highlight="que hemos entregado"
            description="Una muestra de nuestro trabajo en branding, UI/UX y contenido para redes sociales."
          />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/portafolio" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
              Ver portafolio completo
            </Button>
            <Button
              href={siteConfig.social.behance}
              variant="secondary"
              icon={<ExternalLink className="h-4 w-4" />}
              iconPosition="right"
            >
              Behance
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {preview.map((item, index) => (
            <FadeIn
              key={item.behanceUrl}
              delay={index * 0.05}
              className={index === 0 ? "col-span-2 sm:row-span-2" : ""}
            >
              <PortfolioCard item={item} className={index === 0 ? "h-full sm:aspect-auto" : ""} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
