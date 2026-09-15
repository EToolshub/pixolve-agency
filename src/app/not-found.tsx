import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="text-7xl font-extrabold text-blue-100 dark:text-blue-500/20">404</span>
      <h1 className="mt-4 text-2xl font-bold text-heading">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-md text-body">
        Puede que el enlace esté roto o la página se haya movido. Vuelve al
        inicio o explora nuestros servicios.
      </p>
      <div className="mt-8 flex gap-4">
        <Button href="/">Ir al inicio</Button>
        <Button href="/servicios" variant="secondary">
          Ver servicios
        </Button>
      </div>
    </Container>
  );
}
