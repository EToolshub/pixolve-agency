import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/services";

// Distribución bento: dos tarjetas grandes arriba y tres abajo.
const spans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export function ServicesOverview() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Nuestros servicios"
          title="Todo lo que tu marca necesita"
          highlight="para crecer"
          description="Elige el servicio, agrégalo al carrito y completa tu compra en minutos. Sin llamadas eternas ni cotizaciones ambiguas."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service, index) => (
            <FadeIn
              key={service.slug}
              delay={index * 0.06}
              className={`${spans[index] ?? "lg:col-span-2"} ${index === 4 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <ServiceCard service={service} featured={index < 2} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
