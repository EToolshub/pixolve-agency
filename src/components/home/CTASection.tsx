import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

export function CTASection() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    "Hola Pixolve Agency 👋, quiero cotizar un proyecto."
  );

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      <Container className="relative text-center">
        <h2 className="text-balance mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
          ¿Listo para impulsar tu marca al siguiente nivel?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Elige tu servicio y compra en minutos, o escríbenos si prefieres una
          propuesta a medida. Estamos para ayudarte a crecer.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/servicios" size="lg">
            Ver servicios y precios
          </Button>
          <Button
            href={whatsappHref}
            variant="outlineLight"
            size="lg"
            icon={<MessageCircle className="h-5 w-5" />}
          >
            Hablar por WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
