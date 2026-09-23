import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]" />
      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center gap-4 font-display text-8xl font-extrabold text-heading sm:text-9xl">
          4
          <LogoMark decorative className="h-24 animate-float sm:h-32" />
          4
        </div>
        <h1 className="mt-8 text-3xl font-bold text-heading">No encontramos esta página</h1>
        <p className="mt-3 max-w-md text-body">
          Puede que el enlace esté roto o la página se haya movido. Vuelve al
          inicio o explora nuestros servicios.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/">Ir al inicio</Button>
          <Button href="/servicios" variant="secondary">
            Ver servicios
          </Button>
        </div>
      </Container>
    </section>
  );
}
