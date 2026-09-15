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
    instagram: "https://instagram.com/pixolve.agency",
    facebook: "https://facebook.com/pixolveagency", // TODO
    linkedin: "https://linkedin.com/company/pixolveagency", // TODO
    tiktok: "https://tiktok.com/@pixolveagency", // TODO
    behance: "https://www.behance.net/GaboDesign1",
  },

  googleBusinessUrl: "https://share.google/6R1l1Bh6T5S8ffS4K",

  googleAnalyticsId: "G-6BLMSG6GXM",

  // Métodos de pago manuales (sin necesidad de claves secretas de API).
  payments: {
    paypal: {
      email: "gabosbmaestre@gmail.com",
      // TODO (opcional): si creas un enlace PayPal.me, agrégalo aquí para tener un botón directo.
      meLink: "",
    },
    usdt: {
      // Red usada solo si además agregas una wallet on-chain abajo.
      network: "BEP20 (BNB Smart Chain)",
      binancePayId: "281448770",
      // TODO (opcional): agrega una dirección de wallet on-chain si también aceptas USDT fuera de Binance Pay.
      walletAddress: "",
    },
  },

  businessHours: "Lunes a viernes, 9:00 a.m. – 6:00 p.m. (GMT-4)",
};

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Portafolio" },
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
