import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PackageCard } from "@/components/services/PackageCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";
import { iconMap } from "@/lib/icon-map";
import { buildWhatsAppLink } from "@/lib/utils";
import { getServiceBySlug, services } from "@/data/services";
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

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon];
  const otherServices = services.filter((s) => s.slug !== service.slug);
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    `Hola Pixolve Agency 👋, quiero un plan a medida para: ${service.name}.`
  );

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
      <section className="border-b border-default bg-alt py-16">
        <Container>
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/servicios" className="hover:text-blue-600">
              Servicios
            </Link>
            <span>/</span>
            <span className="font-medium text-body-strong">{service.name}</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
                {service.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-body">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5 text-sm font-medium text-body-strong">
                    <Check className="h-4 w-4 text-blue-600" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 rounded-2xl border border-default bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold text-heading">
                ¿Necesitas algo diferente a nuestros paquetes?
              </p>
              <p className="mt-1.5 text-sm text-muted">
                Escríbenos y armamos una propuesta a tu medida.
              </p>
              <Button
                href={whatsappHref}
                variant="whatsapp"
                className="mt-4"
                fullWidth
                icon={<MessageCircle className="h-4 w-4" />}
              >
                Cotizar por WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold text-heading sm:text-3xl">
            Elige tu paquete
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-body">
            Precios claros, sin sorpresas. Agrega el paquete que más se ajuste
            a tu etapa actual.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {service.packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                serviceSlug={service.slug}
                serviceName={service.name}
              />
            ))}
          </div>
        </Container>
      </section>

      {service.faqs.length > 0 && (
        <section className="border-t border-default bg-alt py-20">
          <Container className="max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-heading">
              Preguntas frecuentes sobre {service.shortName}
            </h2>
            <div className="mt-10 space-y-4">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-default bg-card p-5"
                >
                  <p className="font-semibold text-heading">{faq.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-20">
        <Container>
          <h2 className="text-2xl font-bold text-heading">
            Explora otros servicios
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                href={`/servicios/${other.slug}`}
                className="group flex items-center justify-between rounded-xl border border-default p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                <span className="text-sm font-semibold text-body-strong">
                  {other.shortName}
                </span>
                <ArrowRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
