// ─────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL SITIO
// Edita los valores marcados con "TODO" antes de publicar en producción.
// Ninguno de estos datos es secreto: son públicos por diseño (número de
// WhatsApp, enlace de PayPal, dirección de wallet USDT), así que es seguro
// dejarlos aquí en vez de en variables de entorno.
// ─────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "Pixolve Agency",
  legalName: "Pixolve Agency",
  tagline: "Diseño y tecnología que impulsan tu marca",
  description:
    "Agencia de diseño gráfico, redes sociales, UI/UX, desarrollo web y hosting para empresas de cualquier tamaño, desde pymes hasta grandes marcas.",
  url: "https://pixolve-agency.vercel.app", // TODO: actualiza cuando conectes tu dominio propio

  whatsapp: {
    phoneDigitsOnly: "584164086825",
    displayNumber: "+58 416 408 6825",
    defaultMessage:
      "Hola Pixolve Agency 👋, quiero más información sobre sus servicios.",
  },

  email: "contacto@pixolveagency.com", // TODO: tu correo real
  location: "Atención 100% remota para clientes en toda Latinoamérica y EE. UU.",

  social: {
    instagram: "https://instagram.com/pixolveagency", // TODO
    facebook: "https://facebook.com/pixolveagency", // TODO
    linkedin: "https://linkedin.com/company/pixolveagency", // TODO
    tiktok: "https://tiktok.com/@pixolveagency", // TODO
  },

  // Métodos de pago manuales (sin necesidad de claves secretas de API).
  payments: {
    paypal: {
      // TODO: reemplaza "pixolveagency" con tu usuario real de PayPal.me
      meLink: "https://paypal.me/pixolveagency",
      email: "pagos@pixolveagency.com", // TODO
    },
    usdt: {
      network: "BEP20 (BNB Smart Chain) vía Binance Pay",
      // TODO: reemplaza con tu dirección real de wallet USDT o tu Binance Pay ID
      walletAddress: "0xTU_DIRECCION_USDT_AQUI",
      binancePayId: "000000000", // TODO: tu Binance Pay ID (opcional)
    },
  },

  businessHours: "Lunes a viernes, 9:00 a.m. – 6:00 p.m. (GMT-4)",
};

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proceso", label: "Cómo trabajamos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas-frecuentes", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export const footerLegalLinks = [
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/reembolsos", label: "Política de reembolsos" },
];
