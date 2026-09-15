import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PackageCard } from "@/components/services/PackageCard";
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
    title: service.name,
    description: service.shortDescription,
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

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <Container>
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/servicios" className="hover:text-blue-600">
              Servicios
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-700">{service.name}</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {service.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <Check className="h-4 w-4 text-blue-600" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                ¿Necesitas algo diferente a nuestros paquetes?
              </p>
              <p className="mt-1.5 text-sm text-slate-500">
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
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Elige tu paquete
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
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
        <section className="border-t border-slate-200 bg-slate-50 py-20">
          <Container className="max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-slate-900">
              Preguntas frecuentes sobre {service.shortName}
            </h2>
            <div className="mt-10 space-y-4">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <p className="font-semibold text-slate-900">{faq.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
          <h2 className="text-2xl font-bold text-slate-900">
            Explora otros servicios
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                href={`/servicios/${other.slug}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {other.shortName}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
