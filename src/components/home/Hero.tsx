import { ArrowRight, CheckCircle2, MessageCircle, Palette, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";
import { WordRotator } from "@/components/ui/WordRotator";
import { Marquee } from "@/components/ui/Marquee";
import { LogoMark } from "@/components/brand/Logo";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

const marqueeItems = [
  "Branding",
  "Diseño gráfico",
  "UI/UX",
  "Redes sociales",
  "Páginas web",
  "E-commerce",
  "Hosting",
  "Estrategia digital",
];

export function Hero() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    "Hola Pixolve Agency 👋, quiero cotizar un proyecto."
  );

  return (
    <section className="relative -mt-[4.75rem] overflow-hidden pt-[4.75rem]">
      {/* Fondo: retícula, halo naranja y ruido */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_20%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-36 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[95px] sm:-top-48 sm:h-[640px] sm:w-[640px] sm:blur-[140px] lg:left-[72%]" />
      <div className="pointer-events-none absolute -left-40 top-1/2 hidden h-80 w-80 rounded-full bg-brand-700/15 blur-[120px] sm:block" />
      <div className="bg-noise pointer-events-none absolute inset-0 hidden sm:block" />

      <Container className="relative grid items-center gap-12 pb-14 pt-10 sm:gap-14 sm:pb-16 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-24">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 text-xs font-medium text-body-strong backdrop-blur animate-fade-up sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Agencia creativa · Atención 100% remota
          </span>

          <h1 className="text-balance mt-6 text-[2.2rem] font-extrabold leading-[1.06] tracking-tight text-heading sm:mt-7 sm:text-6xl sm:leading-[1.02] lg:text-7xl">
            Impulsamos marcas que{" "}
            <WordRotator
              words={["venden más", "se recuerdan", "enamoran", "escalan"]}
              className="text-gradient-brand pb-1"
            />
          </h1>

          <p className="text-balance mx-auto mt-5 max-w-xl text-base leading-relaxed text-body sm:mt-7 sm:text-lg lg:mx-0">
            Diseño gráfico, redes sociales, UI/UX, páginas web y hosting para
            negocios de cualquier tamaño. Compra tu servicio en minutos, con
            precios claros y un proceso transparente de principio a fin.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
              <Button href="/servicios" size="lg" fullWidth className="sm:w-auto" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                Ver servicios y precios
              </Button>
            </Magnetic>
            <Button href={whatsappHref} variant="secondary" size="lg" fullWidth className="sm:w-auto" icon={<MessageCircle className="h-5 w-5 text-whatsapp" />}>
              Hablar por WhatsApp
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-body-strong sm:mt-10 sm:gap-x-6 sm:gap-y-3 sm:text-sm sm:text-muted lg:justify-start">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-400 sm:h-4 sm:w-4" />
              PayPal y USDT
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
              <Zap className="h-3.5 w-3.5 text-brand-400 sm:h-4 sm:w-4" />
              Precios fijos
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:border-0 sm:bg-transparent sm:p-0">
              <MessageCircle className="h-3.5 w-3.5 text-brand-400 sm:h-4 sm:w-4" />
              Soporte directo
            </li>
          </ul>
        </div>

        {/* Visual de marca */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-[460px] lg:block" aria-hidden>
          <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
          <div className="absolute inset-[12%] rounded-full border border-dashed border-white/[0.08]" />
          <div className="absolute inset-[26%] rounded-full border border-brand-500/25 bg-brand-500/[0.05] shadow-[inset_0_0_50px_rgb(241_90_35/0.12)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoMark decorative priority className="h-[58%] w-auto animate-float drop-shadow-[0_30px_60px_rgb(241_90_35/0.35)]" />
          </div>

          <FloatingChip className="left-[-6%] top-[14%]" delay="0s">
            <Palette className="h-4 w-4 text-brand-400" />
            Branding listo para crecer
          </FloatingChip>
          <FloatingChip className="right-[-8%] top-[42%]" delay="1.2s">
            <Sparkles className="h-4 w-4 text-brand-400" />
            UI/UX que convierte
          </FloatingChip>
          <FloatingChip className="bottom-[12%] left-[2%]" delay="2.4s">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Pedido confirmado
          </FloatingChip>
        </div>
      </Container>

      <div className="relative border-y border-white/[0.06] bg-ink-900/60 py-4 sm:py-6">
        <Marquee
          items={marqueeItems}
          itemClassName="font-display text-2xl font-bold uppercase tracking-tight text-outline sm:text-5xl"
        />
      </div>
    </section>
  );
}

function FloatingChip({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: string;
}) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`absolute flex animate-float items-center gap-2 rounded-2xl border border-white/10 bg-ink-850/80 px-4 py-3 text-sm font-semibold text-heading shadow-2xl backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
