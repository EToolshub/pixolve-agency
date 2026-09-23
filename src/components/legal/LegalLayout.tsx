import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-default">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[120px]" />
        <Container className="relative max-w-3xl py-16 sm:py-20">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-heading sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted">Última actualización: {updatedAt}</p>
        </Container>
      </section>
      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <div className="space-y-5 text-[15px] leading-relaxed text-body [&_a]:text-brand-400 [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:!mt-12 [&_h2]:border-t [&_h2]:border-default [&_h2]:pt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-heading [&_strong]:text-heading [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:marker:text-brand-500">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
