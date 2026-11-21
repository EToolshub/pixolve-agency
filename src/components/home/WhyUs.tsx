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
    <section className="cv-auto relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute right-0 top-1/3 hidden h-96 w-96 rounded-full bg-brand-500/10 blur-[140px] sm:block" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Por qué elegirnos"
          title="Una agencia diseñada para"
          highlight="generarte confianza"
          description="Sabemos que contratar servicios en línea puede generar dudas. Por eso construimos cada proceso para que sepas siempre en qué punto estás."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <FadeIn key={reason.title} delay={index * 0.08} className="h-full">
              <SpotlightCard className="h-full p-6 sm:p-7">
                <div className="flex items-center justify-between sm:block">
                  <span className="font-display text-sm font-semibold text-subtle">0{index + 1}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 shadow-[0_10px_30px_-10px_rgb(241_90_35/0.7)] sm:mt-6 sm:h-12 sm:w-12">
                    <reason.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-bold text-heading sm:mt-6">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body sm:mt-2.5">{reason.description}</p>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
