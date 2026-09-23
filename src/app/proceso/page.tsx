import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/home/CTASection";
import { processSteps } from "@/data/process";

export const metadata: Metadata = {
  title: "Cómo Trabajamos | Proceso de Diseño y Desarrollo",
  description:
    "Conoce paso a paso nuestro proceso de diseño gráfico y desarrollo web, desde la consulta gratuita hasta el soporte post-entrega, con total transparencia en cada etapa.",
  alternates: { canonical: "/proceso" },
};

export default function ProcesoPage() {
  return (
    <>
      <PageHero
        eyebrow="Cómo trabajamos"
        title="Un proceso 100% transparente,"
        highlight="de principio a fin"
        description="Queremos que sepas exactamente qué esperar en cada etapa de tu proyecto, desde el primer mensaje hasta la entrega final."
      />

      <section className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          <ol className="relative">
            <span
              aria-hidden
              className="absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-brand-500 via-brand-500/30 to-transparent sm:left-1/2"
            />
            {processSteps.map((step, index) => {
              const right = index % 2 === 1;
              return (
                <li key={step.number} className="relative pb-10 last:pb-0">
                  <FadeIn delay={0.05}>
                    <div className={`flex gap-6 sm:w-1/2 ${right ? "sm:ml-auto sm:pl-12" : "sm:flex-row-reverse sm:pr-12 sm:text-right"}`}>
                      <span
                        className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-500/40 bg-ink-950 font-display text-lg font-bold text-brand-400 sm:absolute sm:top-0 ${right ? "sm:-left-7" : "sm:-right-7"}`}
                      >
                        {step.number}
                      </span>
                      <div className="flex-1 rounded-3xl border border-default bg-card p-6 transition-colors hover:border-brand-500/40">
                        <h2 className="text-lg font-bold text-heading">{step.title}</h2>
                        <p className="mt-2 text-[15px] leading-relaxed text-body">{step.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              );
            })}
          </ol>

          <div className="mt-20 flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-white/15 p-8 text-center">
            <h2 className="text-2xl font-bold text-heading">¿Alguna duda sobre el proceso?</h2>
            <p className="max-w-xl text-body">
              Revisa nuestras preguntas frecuentes o escríbenos directamente por WhatsApp.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/preguntas-frecuentes" variant="secondary">
                Ver preguntas frecuentes
              </Button>
              <Button href="/servicios">Ver servicios</Button>
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
