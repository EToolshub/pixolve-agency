import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { ServiceCard } from "@/components/services/ServiceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceListSchema } from "@/lib/structured-data";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Servicios de Diseño Gráfico, UI/UX y Desarrollo Web",
  description:
    "Diseño gráfico, manejo de redes sociales, diseño UI/UX, creación de páginas web y hosting. Paquetes con precios claros para pymes y grandes empresas, pago con PayPal o USDT.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Inicio", url: siteConfig.url },
    { name: "Servicios", url: `${siteConfig.url}/servicios` },
  ]);

  return (
    <section className="py-20">
      <JsonLd data={[serviceListSchema(services), breadcrumb]} />
      <Container>
        <SectionHeading
          eyebrow="Tienda de servicios"
          title="Elige el servicio que tu marca necesita"
          description="Cada servicio incluye paquetes con precios claros. Agrégalos al carrito y completa tu compra en minutos."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeIn key={service.slug} delay={index * 0.06}>
              <ServiceCard service={service} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
