import { Container } from "@/components/ui/Container";

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
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-heading">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Última actualización: {updatedAt}
        </p>
        <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-body [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-heading [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </section>
  );
}
