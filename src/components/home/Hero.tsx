import { MessageCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

export function Hero() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    "Hola Pixolve Agency 👋, quiero cotizar un proyecto."
  );

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/60 to-sky-100/40 blur-3xl animate-blob dark:opacity-30" />

      <Container className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-badge-blue px-4 py-1.5 text-sm font-semibold text-badge-blue ring-1 ring-inset ring-blue-600/20">
            <Sparkles className="h-3.5 w-3.5" />
            Diseño, tecnología y estrategia en un solo lugar
          </span>

          <h1 className="text-balance mt-6 text-4xl font-extrabold tracking-tight text-heading sm:text-6xl">
            Impulsa tu marca con{" "}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              diseño y tecnología
            </span>{" "}
            que sí convierten
          </h1>

          <p className="text-balance mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-body">
            Diseño gráfico, manejo de redes sociales, UI/UX, páginas web y
            hosting para negocios de cualquier tamaño. Compra tu servicio en
            minutos, con procesos 100% transparentes de principio a fin.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/servicios" size="lg">
              Ver servicios y precios
            </Button>
            <Button
              href={whatsappHref}
              variant="whatsapp"
              size="lg"
              icon={<MessageCircle className="h-5 w-5" />}
            >
              Hablar por WhatsApp
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Pagos seguros con PayPal y USDT
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              Procesos 100% transparentes
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              Soporte directo por WhatsApp
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
