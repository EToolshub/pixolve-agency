import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de reembolsos",
  description:
    "Condiciones de cancelación y reembolso de los servicios de Pixolve Agency.",
};

export default function ReembolsosPage() {
  return (
    <LegalLayout title="Política de reembolsos" updatedAt="Septiembre de 2026">
      <p>
        Queremos que tomes una decisión informada antes de comprar. Esta es
        nuestra política general de reembolsos; ajústala según tus propias
        condiciones comerciales.
      </p>

      <h2>1. Antes de iniciar el proyecto</h2>
      <p>
        Si cancelas tu pedido antes de la reunión de arranque (kickoff) y
        antes de que iniciemos cualquier trabajo de producción, reembolsamos
        el 100% del pago realizado.
      </p>

      <h2>2. Durante la producción</h2>
      <p>
        Si el proyecto ya está en producción, se reembolsa el monto pagado
        menos el valor proporcional del trabajo ya realizado, calculado
        según las horas o entregables completados hasta la fecha de
        cancelación.
      </p>

      <h2>3. Después de la entrega final</h2>
      <p>
        Una vez entregado y aprobado el proyecto final, no se realizan
        reembolsos. Sin embargo, cada paquete incluye rondas de revisión
        para asegurar que el resultado cumpla lo acordado antes de la
        entrega definitiva.
      </p>

      <h2>4. Servicios recurrentes (mensuales)</h2>
      <p>
        Puedes cancelar un servicio mensual (por ejemplo, manejo de redes
        sociales u hosting) en cualquier momento. La cancelación aplica a
        partir del siguiente ciclo de facturación; no se reembolsan periodos
        ya iniciados.
      </p>

      <h2>5. Cómo solicitar un reembolso</h2>
      <p>
        Escríbenos por WhatsApp al {siteConfig.whatsapp.displayNumber} o al
        correo{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-blue-600 underline">
          {siteConfig.email}
        </a>{" "}
        indicando tu número de pedido. Evaluamos cada solicitud en un plazo
        máximo de 3 días hábiles.
      </p>
    </LegalLayout>
  );
}
