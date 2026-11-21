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
    <section className="cv-auto py-16 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
          <SectionHeading
            align="left"
            eyebrow="Portafolio"
            title="Trabajos reales"
            highlight="que hemos entregado"
            description="Una muestra de nuestro trabajo en branding, UI/UX y contenido para redes sociales."
          />
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/portafolio" fullWidth className="sm:w-auto" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
              Ver portafolio completo
            </Button>
            <Button
              href={siteConfig.social.behance}
              variant="secondary"
              fullWidth
              className="sm:w-auto"
              icon={<ExternalLink className="h-4 w-4" />}
              iconPosition="right"
            >
              Behance
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {preview.map((item, index) => (
            <FadeIn
              key={item.behanceUrl}
              delay={index * 0.05}
              className={index === 0 ? "sm:col-span-2 lg:row-span-2" : ""}
            >
              <PortfolioCard
                item={item}
                className={index === 0 ? "h-full sm:aspect-[16/9] lg:aspect-auto" : ""}
                sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
