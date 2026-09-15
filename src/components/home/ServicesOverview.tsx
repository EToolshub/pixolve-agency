import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/services";

export function ServicesOverview() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Todo lo que tu marca necesita para crecer"
          description="Elige el servicio que necesitas, agrégalo al carrito y completa tu compra en minutos. Sin llamadas eternas ni cotizaciones ambiguas."
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
