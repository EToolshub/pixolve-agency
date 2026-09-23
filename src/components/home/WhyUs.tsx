import { CreditCard, Eye, MessageCircle, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

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
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-brand-500/10 blur-[140px]" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Por qué elegirnos"
          title="Una agencia diseñada para"
          highlight="generarte confianza"
          description="Sabemos que contratar servicios en línea puede generar dudas. Por eso construimos cada proceso para que sepas siempre en qué punto estás."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <FadeIn key={reason.title} delay={index * 0.08} className="h-full">
              <SpotlightCard className="h-full p-7">
                <span className="font-display text-sm font-semibold text-subtle">0{index + 1}</span>
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 shadow-[0_10px_30px_-10px_rgb(241_90_35/0.7)]">
                  <reason.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-heading">{reason.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-body">{reason.description}</p>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
