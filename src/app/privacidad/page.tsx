import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Pixolve Agency recopila, usa y protege tus datos personales.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" updatedAt="Noviembre de 2026">
      <p>
        En {siteConfig.legalName} respetamos tu privacidad y protegemos los
        datos personales que compartes al crear una cuenta, suscribirte a
        novedades o contratar nuestros servicios.
      </p>

      <h2>1. Datos que recopilamos</h2>
      <ul>
        <li>
          <strong>Datos de cuenta y contacto:</strong> nombre completo, correo
          electrónico, teléfono / WhatsApp, país y empresa o marca (si aplica).
        </li>
        <li>
          <strong>Detalles del proyecto:</strong> servicios y paquetes
          contratados, respuestas del briefing creativo y notas adicionales.
        </li>
        <li>
          <strong>Suscripción a novedades:</strong> correo electrónico si te
          registras voluntariamente en nuestra lista de ofertas y lanzamientos.
        </li>
        <li>
          <strong>Datos técnicos y analítica:</strong> almacenamiento local del
          navegador (<code>localStorage</code>) para conservar tu carrito y
          borradores de briefing, además de métricas agregadas de navegación
          mediante Google Analytics para mejorar el sitio.
        </li>
      </ul>
      <p>
        No solicitamos ni almacenamos datos de tarjetas de crédito, débito ni
        información financiera sensible: los pagos se realizan directamente en
        PayPal o mediante transferencias USDT en Binance Pay.
      </p>

      <h2>2. Uso de los datos</h2>
      <p>
        Utilizamos tu información exclusivamente para gestionar y dar
        seguimiento a tus pedidos, mostrarte el estado de tus proyectos en tu
        cuenta, contactarte sobre tus entregas y enviarte comunicaciones solo si
        te suscribiste. No vendemos ni alquilamos tus datos personales a
        terceros.
      </p>

      <h2>3. Almacenamiento y seguridad</h2>
      <p>
        Los datos de tu cuenta, pedidos, briefings y suscripciones se almacenan
        de forma segura en nuestra infraestructura en la nube (Supabase) con
        conexión cifrada (HTTPS) y políticas estrictas de control de acceso por
        fila (Row Level Security), de modo que solo tú y el equipo autorizado de{" "}
        {siteConfig.legalName} puedan consultar tus pedidos. El carrito y los
        borradores previos a la confirmación se guardan temporalmente en el
        almacenamiento local de tu navegador.
      </p>

      <h2>4. Tus derechos</h2>
      <p>
        Puedes solicitar en cualquier momento acceso, rectificación, descarga o
        eliminación de tus datos personales y de tu cuenta escribiendo a{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-brand-400 underline">
          {siteConfig.email}
        </a>
        . También puedes editar tu nombre y teléfono directamente desde{" "}
        <a href="/cuenta" className="text-brand-400 underline">
          Mi cuenta
        </a>
        .
      </p>

      <h2>5. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política ocasionalmente para reflejar mejoras en
        nuestros servicios o cambios normativos. Publicaremos la versión vigente
        y su fecha de actualización en esta misma página.
      </p>
    </LegalLayout>
  );
}
