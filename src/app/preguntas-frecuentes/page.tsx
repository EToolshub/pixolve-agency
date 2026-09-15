import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import { generalFaqs, paymentFaqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Diseño Gráfico, Pagos y Servicios",
  description:
    "Resolvemos las dudas más comunes sobre nuestros servicios de diseño y desarrollo, formas de pago con PayPal y USDT, tiempos de entrega y políticas de Pixolve Agency.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema([...generalFaqs, ...paymentFaqs])} />
      <section className="border-b border-default bg-alt py-20">
        <Container>
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Resolvemos tus dudas antes de comprar"
            description="Si no encuentras la respuesta que buscas, escríbenos por WhatsApp y te respondemos directamente."
          />
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-3xl">
          <h2 className="text-xl font-bold text-heading">General</h2>
          <div className="mt-6">
            <FaqAccordion items={generalFaqs} />
          </div>

          <h2 className="mt-14 text-xl font-bold text-heading">
            Pagos y checkout
          </h2>
          <div className="mt-6">
            <FaqAccordion items={paymentFaqs} />
          </div>

          <div className="mt-14 rounded-2xl bg-alt p-8 text-center">
            <h3 className="text-lg font-bold text-heading">
              ¿Tienes otra pregunta?
            </h3>
            <p className="mt-2 text-sm text-body">
              Nuestro equipo está disponible para ayudarte antes de que
              tomes una decisión.
            </p>
            <div className="mt-5">
              <Button href="/contacto">Contáctanos</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
