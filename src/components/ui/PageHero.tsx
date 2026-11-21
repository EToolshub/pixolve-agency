import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Encabezado de página interna con el halo naranja de marca. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-default">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[90px] sm:-top-40 sm:h-[420px] sm:w-[720px] sm:blur-[120px]" />
      <Container className="relative py-14 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
        />
        {children && <div className="mt-9 flex justify-center">{children}</div>}
      </Container>
    </section>
  );
}
