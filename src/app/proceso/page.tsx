import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
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
      <section className="border-b border-default bg-alt py-20">
        <Container>
          <SectionHeading
            eyebrow="Cómo trabajamos"
            title="Un proceso 100% transparente, de principio a fin"
            description="Queremos que sepas exactamente qué esperar en cada etapa de tu proyecto, desde el primer mensaje hasta la entrega final."
          />
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-3xl">
          <ol className="relative space-y-10 border-l-2 border-blue-100 pl-8 dark:border-blue-500/20">
            {processSteps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.06}>
                <li className="relative">
                  <span className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-4 ring-page">
                    {index + 1}
                  </span>
                  <h2 className="text-lg font-bold text-heading">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 leading-relaxed text-body">
                    {step.description}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-alt py-20">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">
            ¿Alguna duda sobre el proceso?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-body">
            Revisa nuestras preguntas frecuentes o escríbenos directamente por
            WhatsApp.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/preguntas-frecuentes" variant="secondary">
              Ver preguntas frecuentes
            </Button>
            <Button href="/servicios">Ver servicios</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
