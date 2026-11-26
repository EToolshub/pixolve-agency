import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { CaseStudyCard } from "@/components/cases/CaseStudyCard";
import { caseStudies, type CaseStudy } from "@/data/cases";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/** Enlace discreto al portafolio de Behance, debajo de los casos reales. */
export function BehanceLink({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-3 rounded-2xl border border-default bg-alt px-5 py-4 sm:flex-row sm:items-center sm:px-6",
        className
      )}
    >
      <p className="text-sm text-body">
        ¿Quieres ver más? Branding, UI/UX y piezas para redes en nuestro portafolio de Behance.
      </p>
      <a
        href={siteConfig.social.behance}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-300 underline-offset-4 transition-colors hover:text-brand-200 hover:underline"
      >
        Ver portafolio en Behance
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

export function CaseStudyList({ items }: { items: CaseStudy[] }) {
  return (
    <div className="space-y-20 lg:space-y-28">
      {items.map((caseStudy, index) => (
        <FadeIn key={caseStudy.slug}>
          <CaseStudyCard caseStudy={caseStudy} reverse={index % 2 === 1} />
        </FadeIn>
      ))}
    </div>
  );
}

/** Sección de la página de inicio con los casos reales. */
export function CaseStudies() {
  return (
    <section id="casos" className="cv-auto scroll-mt-24 py-16 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Casos reales"
          title="Proyectos en vivo"
          highlight="que puedes visitar hoy"
          description="Webs publicadas y contenido que sale cada día. Entra, pruébalos y juzga tú mismo."
        />
        <div className="mt-12 sm:mt-16">
          <CaseStudyList items={caseStudies} />
        </div>
        <BehanceLink className="mt-16 sm:mt-20" />
      </Container>
    </section>
  );
}
