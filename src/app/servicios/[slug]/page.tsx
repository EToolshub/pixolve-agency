import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Lock,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { PackageCard } from "@/components/services/PackageCard";
import { SectionNav } from "@/components/services/SectionNav";
import { MobileBuyBar } from "@/components/services/MobileBuyBar";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";
import { iconMap } from "@/lib/icon-map";
import { buildWhatsAppLink, formatCurrency } from "@/lib/utils";
import { getServiceBySlug, getStartingPackage, services } from "@/data/services";
import { portfolioItems } from "@/data/portfolio";
import { paymentFaqs } from "@/data/faq";
import { siteConfig } from "@/data/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/servicios/${service.slug}` },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: `${siteConfig.url}/servicios/${service.slug}`,
    },
  };
}

const guarantees = [
  { icon: Lock, title: "Pago seguro", description: "PayPal o USDT, sin compartir datos de tarjeta." },
  { icon: ClipboardList, title: "Brief guiado", description: "Te ayudamos a definir tu proyecto desde el checkout." },
  { icon: BadgeCheck, title: "Rondas de revisión", description: "Ajustamos hasta cumplir lo acordado en tu paquete." },
  { icon: MessageCircle, title: "Soporte directo", description: "Hablas con el equipo por WhatsApp en todo momento." },
];

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon];
  const starting = getStartingPackage(service);
  const otherServices = services.filter((s) => s.slug !== service.slug);
  const relatedWork = service.portfolioCategory
    ? portfolioItems.filter((item) => item.category === service.portfolioCategory).slice(0, 3)
    : [];
  const faqs = [...service.faqs, ...paymentFaqs.slice(0, 2)];
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    `Hola Pixolve Agency 👋, quiero un plan a medida para: ${service.name}.`
  );

  const sections = [
    { id: "paquetes", label: "Paquetes" },
    { id: "incluye", label: "Qué incluye" },
    { id: "proceso", label: "Proceso" },
    ...(relatedWork.length > 0 ? [{ id: "trabajos", label: "Trabajos" }] : []),
    { id: "faq", label: "Preguntas" },
  ];

  const breadcrumb = breadcrumbSchema([
    { name: "Inicio", url: siteConfig.url },
    { name: "Servicios", url: `${siteConfig.url}/servicios` },
    { name: service.name, url: `${siteConfig.url}/servicios/${service.slug}` },
  ]);

  return (
    <>
      <JsonLd
        data={
          service.faqs.length > 0
            ? [serviceSchema(service), breadcrumb, faqSchema(service.faqs)]
            : [serviceSchema(service), breadcrumb]
        }
      />

      {/* HERO */}
      <section className="relative -mt-[4.75rem] overflow-hidden pt-[4.75rem]">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_10%,black,transparent)]" />
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-[130px]" />

        <Container className="relative pb-16 pt-10 sm:pb-20 sm:pt-14">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="-my-2 py-2 transition-colors hover:text-white">Inicio</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/servicios" className="-my-2 py-2 transition-colors hover:text-white">Servicios</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-body-strong" aria-current="page">{service.shortName}</span>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-ink-950 shadow-[0_12px_30px_-10px_rgb(241_90_35/0.8)]">
                  {Icon && <Icon className="h-6 w-6" />}
                </span>
                <Eyebrow>{service.name}</Eyebrow>
              </div>
              <h1 className="text-balance mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading sm:text-6xl">
                {service.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{service.description}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="#paquetes" size="lg" icon={<ArrowDown className="h-5 w-5" />} iconPosition="right">
                  Ver paquetes desde {formatCurrency(starting.price)}
                  {starting.billing === "mensual" ? "/mes" : ""}
                </Button>
                <Button
                  href={whatsappHref}
                  variant="secondary"
                  size="lg"
                  icon={<MessageCircle className="h-5 w-5 text-whatsapp" />}
                >
                  Cotizar a medida
                </Button>
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-400" /> Pago seguro con PayPal o USDT
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-brand-400" /> {service.packages.length} paquetes con precio fijo
                </li>
              </ul>
            </div>

            <SpotlightCard className="p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">Qué obtienes</p>
              <ul className="mt-5 space-y-4">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-[15px] font-medium text-body-strong">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-heading">
                  <Users className="h-4 w-4 text-brand-400" /> Ideal para
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {service.idealFor.map((profile) => (
                    <li key={profile} className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-body-strong ring-1 ring-white/10">
                      {profile}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </div>
        </Container>
      </section>

      <SectionNav sections={sections} />

      {/* PAQUETES */}
      <section id="paquetes" className="scroll-mt-40 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Paquetes y precios"
            title="Elige el paquete"
            highlight="para tu etapa"
            description="Precios claros en USD, sin sorpresas. Agrega el paquete al carrito y completa tu compra en minutos."
          />

          <div className="mt-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-5">
            {service.packages.map((pkg, index) => (
              <FadeIn key={pkg.id} delay={index * 0.08} className="h-full">
                <PackageCard pkg={pkg} serviceSlug={service.slug} serviceName={service.name} />
              </FadeIn>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-default bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 bg-ink-900 p-6">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                <div>
                  <p className="text-sm font-semibold text-heading">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            ¿Necesitas algo diferente?{" "}
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-400 underline-offset-4 hover:underline">
              Escríbenos y armamos una propuesta a tu medida
            </a>
            .
          </p>
        </Container>
      </section>

      {/* QUÉ INCLUYE */}
      <section id="incluye" className="scroll-mt-40 border-y border-default bg-alt py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Qué incluye"
            title="Todo lo que recibes con"
            highlight={service.shortName}
          />
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.deliverables.map((item, index) => {
              const DeliverableIcon = iconMap[item.icon];
              return (
                <FadeIn key={item.title} delay={index * 0.07} className="h-full">
                  <SpotlightCard className="h-full p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/25">
                      {DeliverableIcon && <DeliverableIcon className="h-5 w-5" />}
                    </span>
                    <h3 className="mt-6 text-lg font-bold text-heading">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-body">{item.description}</p>
                  </SpotlightCard>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="scroll-mt-40 py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-40 lg:self-start">
              <SectionHeading
                align="left"
                eyebrow="Cómo lo hacemos"
                title="Del brief a la entrega,"
                highlight="paso a paso"
                description="Sabrás en qué etapa está tu proyecto en todo momento. Te acompañamos por WhatsApp de principio a fin."
              />
              <Button href="/proceso" variant="secondary" className="mt-8" icon={<ArrowUpRight className="h-4 w-4" />} iconPosition="right">
                Ver nuestro proceso general
              </Button>
            </div>

            <ol className="relative space-y-5">
              {service.steps.map((step, index) => (
                <li key={step.title}>
                  <FadeIn delay={index * 0.08}>
                    <div className="group flex gap-5 rounded-3xl border border-default bg-card p-6 transition-colors hover:border-brand-500/40 sm:p-7">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/10 font-display text-lg font-bold text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-ink-950">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-heading">{step.title}</h3>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-body">{step.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* TRABAJOS RELACIONADOS */}
      {relatedWork.length > 0 && (
        <section id="trabajos" className="scroll-mt-40 border-t border-default py-20 sm:py-28">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                align="left"
                eyebrow="Trabajos reales"
                title="Proyectos de"
                highlight={service.portfolioCategory}
              />
              <Button href="/portafolio" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" />} iconPosition="right">
                Ver portafolio
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {relatedWork.map((item, index) => (
                <FadeIn key={item.behanceUrl} delay={index * 0.06}>
                  <PortfolioCard item={item} />
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="scroll-mt-40 border-t border-default bg-alt py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="Preguntas frecuentes"
            title="Dudas sobre"
            highlight={service.shortName}
            description="¿No encuentras tu respuesta? Escríbenos por WhatsApp y te respondemos directamente."
          />
          <FaqAccordion items={faqs} />
        </Container>
      </section>

      {/* OTROS SERVICIOS */}
      <section className="pt-20 sm:pt-28">
        <Container>
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">Complementa con otros servicios</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map((other) => {
              const OtherIcon = iconMap[other.icon];
              const otherStarting = getStartingPackage(other);
              return (
                <Link
                  key={other.slug}
                  href={`/servicios/${other.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-default bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-ink-950">
                    {OtherIcon && <OtherIcon className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-heading">{other.shortName}</span>
                    <span className="block text-xs text-muted">
                      Desde {formatCurrency(otherStarting.price)}
                      {otherStarting.billing === "mensual" ? "/mes" : ""}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-subtle transition-all group-hover:rotate-45 group-hover:text-brand-400" />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection
        title={`Hagamos realidad tu proyecto de ${service.shortName}`}
        description="Agrega tu paquete al carrito y en minutos completas tu pedido, o escríbenos si prefieres una propuesta a medida."
      />

      <MobileBuyBar
        serviceName={service.name}
        price={starting.price}
        monthly={starting.billing === "mensual"}
      />
    </>
  );
}
