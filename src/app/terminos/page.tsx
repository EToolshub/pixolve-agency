import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso y compra de los servicios de Pixolve Agency.",
};

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updatedAt="Septiembre de 2026">
      <p>
        Este documento es una plantilla de referencia y no sustituye la
        asesoría de un profesional legal. Te recomendamos revisarlo con un
        abogado antes de operar comercialmente.
      </p>

      <h2>1. Aceptación de los términos</h2>
      <p>
        Al contratar cualquier servicio ofrecido por {siteConfig.legalName}{" "}
        (&quot;nosotros&quot;, &quot;la Agencia&quot;) a través de este sitio
        web, aceptas los presentes Términos y Condiciones en su totalidad.
      </p>

      <h2>2. Servicios ofrecidos</h2>
      <p>
        Ofrecemos servicios de diseño gráfico, manejo de redes sociales,
        diseño UI/UX, creación de páginas web y hosting, descritos con
        detalle en cada página de servicio junto con sus paquetes, precios y
        tiempos de entrega estimados.
      </p>

      <h2>3. Proceso de compra y confirmación</h2>
      <p>
        La compra se realiza a través del carrito y checkout de este sitio.
        El pedido se considera confirmado únicamente cuando: (a) se completa
        el pago por PayPal o USDT según las instrucciones mostradas en el
        checkout, y (b) el comprobante de pago es validado por nuestro
        equipo, generalmente en un plazo de 24 horas hábiles.
      </p>

      <h2>4. Precios y pagos</h2>
      <ul>
        <li>Todos los precios se muestran en dólares estadounidenses (USD).</li>
        <li>
          Aceptamos pagos mediante PayPal y USDT a través de Binance Pay,
          según las instrucciones mostradas durante el checkout.
        </li>
        <li>
          Los servicios recurrentes (mensuales) se renuevan automáticamente
          salvo cancelación notificada con al menos 5 días de anticipación al
          siguiente ciclo de facturación.
        </li>
      </ul>

      <h2>5. Rondas de revisión y alcance</h2>
      <p>
        Cada paquete incluye un número definido de rondas de revisión.
        Cambios que excedan el alcance original del paquete contratado
        podrán generar un cargo adicional, el cual será comunicado y
        aprobado por el cliente antes de ejecutarse.
      </p>

      <h2>6. Propiedad intelectual</h2>
      <p>
        Una vez confirmado el pago completo del servicio, los derechos de
        uso de los entregables finales se transfieren al cliente. La Agencia
        se reserva el derecho de mostrar el trabajo realizado en su
        portafolio, salvo acuerdo de confidencialidad expreso.
      </p>

      <h2>7. Cancelaciones y reembolsos</h2>
      <p>
        Consulta nuestra{" "}
        <a href="/reembolsos" className="text-blue-600 underline">
          Política de reembolsos
        </a>{" "}
        para conocer las condiciones específicas según la etapa del proyecto.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        La Agencia no será responsable por daños indirectos, pérdida de
        ingresos o de datos derivados del uso de los entregables, salvo lo
        establecido por la legislación aplicable.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para dudas sobre estos términos, escríbenos a{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-blue-600 underline">
          {siteConfig.email}
        </a>{" "}
        o por WhatsApp al {siteConfig.whatsapp.displayNumber}.
      </p>
    </LegalLayout>
  );
}
