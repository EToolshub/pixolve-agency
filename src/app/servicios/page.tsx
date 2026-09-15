import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Servicios y precios",
  description:
    "Explora nuestros servicios de diseño gráfico, redes sociales, UI/UX, páginas web y hosting, con precios claros y paquetes para cada etapa de tu negocio.",
};

export default function ServiciosPage() {
  return (
    <section className="py-20">
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
