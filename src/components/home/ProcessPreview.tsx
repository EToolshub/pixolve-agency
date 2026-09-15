import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { processSteps } from "@/data/process";

export function ProcessPreview() {
  const preview = processSteps.slice(0, 4);

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Un proceso claro, de principio a fin"
          description="Así de simple es comprar e iniciar un proyecto con nosotros."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.08}>
              <div className="relative rounded-2xl border border-default p-6">
                <span className="text-4xl font-extrabold text-blue-100">
                  {step.number}
                </span>
                <h3 className="mt-3 font-bold text-heading">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/proceso"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver el proceso completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
