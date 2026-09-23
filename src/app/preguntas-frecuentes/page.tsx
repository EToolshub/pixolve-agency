import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import { buildWhatsAppLink } from "@/lib/utils";
import { generalFaqs, paymentFaqs } from "@/data/faq";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Diseño Gráfico, Pagos y Servicios",
  description:
    "Resolvemos las dudas más comunes sobre nuestros servicios de diseño y desarrollo, formas de pago con PayPal y USDT, tiempos de entrega y políticas de Pixolve Agency.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default function FaqPage() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    "Hola Pixolve Agency 👋, tengo una pregunta."
  );

  return (
    <>
      <JsonLd data={faqSchema([...generalFaqs, ...paymentFaqs])} />
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Resolvemos tus dudas"
        highlight="antes de comprar"
        description="Si no encuentras la respuesta que buscas, escríbenos por WhatsApp y te respondemos directamente."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid max-w-6xl gap-12 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Categorías de preguntas" className="hidden lg:block">
            <div className="sticky top-28 space-y-1">
              <a href="#general" className="block rounded-xl px-4 py-2.5 text-sm font-medium text-body transition-colors hover:bg-white/5 hover:text-white">
                General
              </a>
              <a href="#pagos" className="block rounded-xl px-4 py-2.5 text-sm font-medium text-body transition-colors hover:bg-white/5 hover:text-white">
                Pagos y checkout
              </a>
            </div>
          </nav>

          <div>
            <h2 id="general" className="scroll-mt-28 text-2xl font-bold text-heading">General</h2>
            <div className="mt-6">
              <FaqAccordion items={generalFaqs} />
            </div>

            <h2 id="pagos" className="mt-16 scroll-mt-28 text-2xl font-bold text-heading">Pagos y checkout</h2>
            <div className="mt-6">
              <FaqAccordion items={paymentFaqs} defaultOpen={null} />
            </div>

            <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-3xl border border-default bg-card p-8 text-center sm:flex-row sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-heading">¿Tienes otra pregunta?</h3>
                <p className="mt-1.5 text-sm text-body">
                  Nuestro equipo está disponible para ayudarte antes de que tomes una decisión.
                </p>
              </div>
              <Button href={whatsappHref} variant="whatsapp" icon={<MessageCircle className="h-4 w-4" />}>
                Preguntar por WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
