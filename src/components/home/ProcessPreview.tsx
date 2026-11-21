import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { processSteps } from "@/data/process";

export function ProcessPreview() {
  const preview = processSteps.slice(0, 4);

  return (
    <section className="cv-auto border-y border-default bg-alt py-16 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Un proceso claro,"
          highlight="de principio a fin"
          description="Así de simple es comprar e iniciar un proyecto con nosotros."
        />

        <div className="relative mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          <div aria-hidden className="absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-brand-500/60 via-brand-500/25 to-transparent sm:hidden" />
          <div aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent lg:block" />
          {preview.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.08}>
              <div className="relative flex gap-4 sm:block">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-500/35 bg-ink-950 font-display text-base font-bold text-brand-400 shadow-[0_0_0_5px_var(--surface-alt)] sm:text-lg sm:shadow-[0_0_0_6px_var(--surface-alt)]">
                  {step.number}
                </span>
                <div className="flex-1 rounded-2xl border border-default bg-card/70 p-4 sm:mt-6 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                  <h3 className="text-base font-bold text-heading sm:text-lg">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body sm:mt-2">{step.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 text-center sm:mt-14">
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
