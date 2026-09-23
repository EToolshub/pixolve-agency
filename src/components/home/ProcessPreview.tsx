import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { processSteps } from "@/data/process";

export function ProcessPreview() {
  const preview = processSteps.slice(0, 4);

  return (
    <section className="border-y border-default bg-alt py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Un proceso claro,"
          highlight="de principio a fin"
          description="Así de simple es comprar e iniciar un proyecto con nosotros."
        />

        <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent lg:block" />
          {preview.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.1}>
              <div className="relative">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/30 bg-ink-950 font-display text-lg font-bold text-brand-400 shadow-[0_0_0_6px_var(--surface-alt)]">
                  {step.number}
                </span>
                <h3 className="mt-6 text-lg font-bold text-heading">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/proceso"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-heading transition-colors hover:border-brand-500/60 hover:bg-brand-500/10"
          >
            Ver el proceso completo
            <ArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
