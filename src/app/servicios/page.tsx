import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, serviceListSchema } from "@/lib/structured-data";
import { buildWhatsAppLink } from "@/lib/utils";
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
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    "Hola Pixolve Agency 👋, no sé qué servicio necesito. ¿Me pueden orientar?"
  );

  return (
    <>
      <JsonLd data={[serviceListSchema(services), breadcrumb]} />
      <PageHero
        eyebrow="Tienda de servicios"
        title="Elige el servicio que"
        highlight="tu marca necesita"
        description="Cada servicio tiene su propia página con paquetes, precios claros, entregables y proceso. Agrégalo al carrito y completa tu compra en minutos."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <ServicesExplorer />

          <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl border border-dashed border-white/15 p-7 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-lg font-bold text-heading">¿No sabes cuál elegir?</p>
              <p className="mt-1 text-sm text-body">
                Cuéntanos tu objetivo y te recomendamos el paquete ideal, sin compromiso.
              </p>
            </div>
            <Button href={whatsappHref} variant="whatsapp" icon={<MessageCircle className="h-4 w-4" />}>
              Pedir orientación gratis
            </Button>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
