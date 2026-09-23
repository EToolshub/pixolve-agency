import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/brand/Logo";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

export function CTASection({
  title = "¿Listo para impulsar tu marca al siguiente nivel?",
  description = "Elige tu servicio y compra en minutos, o escríbenos si prefieres una propuesta a medida. Estamos para ayudarte a crecer.",
}: {
  title?: string;
  description?: string;
}) {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    "Hola Pixolve Agency 👋, quiero cotizar un proyecto."
  );

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 px-6 py-16 sm:px-14 sm:py-20">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-300/40 blur-3xl" />
          <LogoMark
            decorative
            className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-auto rotate-12 opacity-20 mix-blend-luminosity sm:h-96"
          />

          <div className="relative max-w-2xl">
            <h2 className="text-balance text-3xl font-extrabold text-ink-950 sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-xl text-lg text-ink-950/75">{description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href="/servicios"
                variant="light"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                Ver servicios y precios
              </Button>
              <Button
                href={whatsappHref}
                variant="dark"
                size="lg"
                icon={<MessageCircle className="h-5 w-5 text-whatsapp" />}
              >
                Hablar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
