import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Pixolve Agency recopila, usa y protege tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" updatedAt="Septiembre de 2026">
      <p>
        Esta plantilla describe de forma general el tratamiento de datos en
        este sitio. Te recomendamos adaptarla con asesoría legal según la
        normativa de protección de datos de tu país (por ejemplo, LFPDPPP en
        México, GDPR en la Unión Europea, o leyes locales equivalentes).
      </p>

      <h2>1. Datos que recopilamos</h2>
      <ul>
        <li>Datos de contacto: nombre, correo electrónico, teléfono y empresa (si aplica).</li>
        <li>Detalles del pedido: servicios y paquetes contratados, notas del proyecto.</li>
        <li>
          Datos técnicos básicos de navegación (a través de almacenamiento
          local del navegador para mantener tu carrito de compras).
        </li>
      </ul>
      <p>
        No solicitamos ni almacenamos datos de tarjetas de crédito, débito ni
        información financiera sensible en nuestros servidores: los pagos se
        procesan directamente en PayPal o mediante transferencias USDT
        verificables en la blockchain.
      </p>

      <h2>2. Uso de los datos</h2>
      <p>
        Utilizamos tus datos exclusivamente para gestionar tu pedido,
        contactarte sobre tu proyecto y brindarte soporte. No vendemos ni
        compartimos tu información con terceros con fines publicitarios.
      </p>

      <h2>3. Almacenamiento</h2>
      <p>
        Los datos del carrito y del checkout se guardan temporalmente en el
        almacenamiento local (localStorage) de tu propio navegador y se
        envían directamente a nuestro WhatsApp de negocio al confirmar tu
        pedido. No mantenemos una base de datos centralizada de pedidos en
        este sitio.
      </p>

      <h2>4. Tus derechos</h2>
      <p>
        Puedes solicitar en cualquier momento acceso, corrección o
        eliminación de los datos que nos hayas compartido, escribiendo a{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-blue-600 underline">
          {siteConfig.email}
        </a>
        .
      </p>

      <h2>5. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política ocasionalmente. Publicaremos
        cualquier cambio importante en esta misma página.
      </p>
    </LegalLayout>
  );
}
