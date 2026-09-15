import { CreditCard, Eye, MessageCircle, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

const reasons = [
  {
    icon: Eye,
    title: "Transparencia total",
    description:
      "Precios claros desde el primer momento, sin letras pequeñas ni cobros sorpresa. Sabes exactamente qué incluye cada paquete antes de comprar.",
  },
  {
    icon: TrendingUp,
    title: "Escalamos contigo",
    description:
      "Desde una pyme que apenas empieza hasta una empresa con operación multicanal: tenemos un plan diseñado para tu etapa actual.",
  },
  {
    icon: CreditCard,
    title: "Pagos flexibles",
    description:
      "Paga con PayPal o USDT a través de Binance Pay, de forma segura y sin necesidad de tarjetas internacionales.",
  },
  {
    icon: MessageCircle,
    title: "Soporte directo",
    description:
      "Habla con nosotros por WhatsApp en cualquier etapa de tu proyecto: antes, durante y después de la compra.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-alt py-24">
      <Container>
        <SectionHeading
          eyebrow="Por qué elegirnos"
          title="Una agencia diseñada para generarte confianza"
          description="Sabemos que contratar servicios en línea puede generar dudas. Por eso construimos cada proceso para que sepas siempre en qué punto estás."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <FadeIn key={reason.title} delay={index * 0.08}>
              <div className="h-full rounded-2xl bg-card p-7 shadow-sm ring-1 ring-default">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                  <reason.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-bold text-heading">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  {reason.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
