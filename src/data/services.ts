import type { Service } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────
// Catálogo de servicios. Los precios son ejemplos profesionales de
// referencia: ajústalos a tu mercado real antes de publicar.
// ─────────────────────────────────────────────────────────────────────────

export const services: Service[] = [
  {
    slug: "diseno-grafico",
    name: "Diseño Gráfico",
    shortName: "Diseño Gráfico",
    icon: "PenTool",
    shortDescription:
      "Identidad visual y piezas gráficas que comunican quién eres.",
    description:
      "Creamos identidades de marca sólidas y piezas gráficas que conectan con tu audiencia: desde un logo profesional hasta un sistema de marca completo listo para escalar.",
    bullets: [
      "Logotipo y sistema de marca",
      "Manual de marca y guías de uso",
      "Piezas para redes, impresos y punto de venta",
    ],
    packages: [
      {
        id: "diseno-grafico-esencial",
        name: "Esencial",
        price: 25,
        billing: "unico",
        tagline: "Ideal para marcas que están empezando.",
        features: [
          "Logotipo profesional (2 propuestas)",
          "Paleta de colores y tipografías",
          "2 rondas de revisión",
          "Archivos en formatos editables y de impresión",
        ],
        deliveryTime: "5 días hábiles",
      },
      {
        id: "diseno-grafico-profesional",
        name: "Profesional",
        price: 75,
        billing: "unico",
        tagline: "Identidad completa lista para todos tus canales.",
        highlighted: true,
        features: [
          "Identidad de marca completa (logo, paleta, tipografía)",
          "Manual de marca digital",
          "10 plantillas para redes sociales",
          "4 rondas de revisión",
          "Papelería digital (tarjeta, firma de correo)",
        ],
        deliveryTime: "10 días hábiles",
      },
      {
        id: "diseno-grafico-empresarial",
        name: "Empresarial",
        price: 275,
        billing: "unico",
        tagline: "Sistema de marca a escala, con gerente dedicado.",
        features: [
          "Sistema de marca extendido (múltiples líneas)",
          "Soporte de naming y tono de voz",
          "Guidelines extensos para equipos internos",
          "Revisiones ilimitadas durante 30 días",
          "Gerente de proyecto dedicado",
        ],
        deliveryTime: "A definir según alcance",
      },
    ],
    faqs: [
      {
        question: "¿Qué necesito enviarles para empezar?",
        answer:
          "Un breve brief sobre tu marca, referencias visuales que te gusten y, si ya tienes, tu logo o materiales actuales. Nosotros te guiamos con un cuestionario si no sabes por dónde empezar.",
      },
      {
        question: "¿Incluye archivos editables?",
        answer:
          "Sí, en todos los paquetes recibes los archivos fuente (AI/Figma) además de los formatos listos para usar (PNG, SVG, PDF).",
      },
    ],
    seo: {
      title: "Diseño Gráfico Profesional | Agencia de Branding",
      description:
        "Agencia de diseño gráfico y branding: logotipos, identidad de marca y piezas gráficas para pymes y empresas. Precios claros, entrega rápida y pago con PayPal o USDT.",
    },
  },
  {
    slug: "redes-sociales",
    name: "Manejo de Redes Sociales",
    shortName: "Redes Sociales",
    icon: "Megaphone",
    shortDescription:
      "Gestión de contenido y comunidad para pymes y grandes empresas.",
    description:
      "Gestionamos tus redes sociales de punta a punta: estrategia, contenido, diseño y community management, con planes que crecen contigo desde una pyme hasta una operación multicanal de alto volumen.",
    bullets: [
      "Estrategia de contenido y calendario editorial",
      "Diseño de piezas y producción audiovisual",
      "Community management y reportes de resultados",
    ],
    packages: [
      {
        id: "redes-starter",
        name: "Starter (Pymes)",
        price: 150,
        billing: "mensual",
        tagline: "Presencia constante y profesional desde el primer mes.",
        features: [
          "Hasta 2 redes sociales",
          "12 publicaciones al mes",
          "Diseño de piezas incluido",
          "Calendario de contenido mensual",
          "Reporte mensual de desempeño",
        ],
      },
      {
        id: "redes-growth",
        name: "Growth",
        price: 350,
        billing: "mensual",
        tagline: "Para marcas que buscan crecer de forma activa.",
        highlighted: true,
        features: [
          "Hasta 3 redes sociales",
          "20 publicaciones + 4 reels al mes",
          "Community management diario",
          "Gestión de pauta publicitaria (presupuesto de ads aparte)",
          "Reporte quincenal con recomendaciones",
        ],
      },
      {
        id: "redes-enterprise",
        name: "Enterprise",
        price: 750,
        billing: "mensual",
        tagline: "Operación multicanal para grandes empresas.",
        features: [
          "Redes sociales ilimitadas",
          "Contenido diario y producción audiovisual",
          "Estrategia multicanal y gestión de crisis",
          "Reportes semanales",
          "Estratega de cuenta dedicado",
        ],
        deliveryTime: "Cotización personalizada según alcance",
      },
    ],
    faqs: [
      {
        question: "¿El presupuesto de publicidad está incluido?",
        answer:
          "No. Nuestras tarifas cubren la gestión, estrategia y creación de contenido; el presupuesto de pauta publicitaria (Meta Ads, TikTok Ads, etc.) se maneja por separado y se define contigo según tus objetivos.",
      },
      {
        question: "¿Puedo cambiar de plan más adelante?",
        answer:
          "Sí, puedes subir o bajar de plan en cualquier momento; los cambios aplican desde el siguiente ciclo de facturación.",
      },
    ],
    seo: {
      title: "Manejo de Redes Sociales para Empresas y Pymes",
      description:
        "Gestión profesional de redes sociales: estrategia, contenido, diseño y community management. Planes desde pymes hasta grandes empresas con reportes de resultados.",
    },
  },
  {
    slug: "diseno-ui-ux",
    name: "Diseño UI/UX",
    shortName: "UI/UX",
    icon: "LayoutPanelTop",
    shortDescription: "Interfaces claras y experiencias que convierten.",
    description:
      "Diseñamos productos digitales centrados en el usuario: research, wireframes, prototipos interactivos y una interfaz final pulida y lista para desarrollo.",
    bullets: [
      "Investigación de usuarios y arquitectura de información",
      "Wireframes y prototipos interactivos en Figma",
      "Sistemas de diseño escalables",
    ],
    packages: [
      {
        id: "uiux-mvp",
        name: "Landing / MVP",
        price: 250,
        billing: "unico",
        tagline: "Valida tu idea con un diseño profesional.",
        features: [
          "Hasta 5 pantallas",
          "Investigación básica de referencia",
          "Prototipo interactivo en Figma",
          "3 rondas de revisión",
        ],
        deliveryTime: "10 días hábiles",
      },
      {
        id: "uiux-producto",
        name: "Producto Digital",
        price: 750,
        billing: "unico",
        tagline: "App o plataforma completa, de research a UI final.",
        highlighted: true,
        features: [
          "Hasta 15 pantallas",
          "Research + wireframes + UI final",
          "Sistema de diseño básico (componentes reutilizables)",
          "Prueba de usabilidad con usuarios reales",
          "Prototipo navegable de alta fidelidad",
        ],
        deliveryTime: "3–4 semanas",
      },
      {
        id: "uiux-enterprise",
        name: "Enterprise / Design System",
        price: 1750,
        billing: "unico",
        tagline: "Design system completo para equipos de producto.",
        features: [
          "Design system completo y documentado",
          "Research avanzado (entrevistas, tests)",
          "Pantallas ilimitadas por fase de trabajo",
          "Handoff técnico a tu equipo de desarrollo",
          "Soporte continuo post-entrega",
        ],
        deliveryTime: "A definir según alcance",
      },
    ],
    faqs: [
      {
        question: "¿Trabajan con mi equipo de desarrollo?",
        answer:
          "Sí. Entregamos especificaciones claras, componentes documentados y acompañamos el handoff técnico para que tu equipo (o el nuestro) implemente el diseño sin fricción.",
      },
    ],
    seo: {
      title: "Diseño UI/UX Profesional | Agencia de Diseño de Producto",
      description:
        "Diseño UI/UX centrado en el usuario: research, wireframes, prototipos interactivos y sistemas de diseño para apps y plataformas web. Cotiza tu proyecto en minutos.",
    },
  },
  {
    slug: "paginas-web",
    name: "Creación de Páginas Web",
    shortName: "Páginas Web",
    icon: "Globe2",
    shortDescription: "Sitios y tiendas online rápidas, seguras y a tu medida.",
    description:
      "Construimos sitios web y tiendas en línea modernas, optimizadas para conversión y velocidad, desde un sitio informativo hasta una plataforma e-commerce a medida.",
    bullets: [
      "Diseño responsive y optimizado para SEO",
      "Tiendas en línea con pasarelas de pago",
      "Integraciones a medida (CRM, APIs, ERPs)",
    ],
    packages: [
      {
        id: "web-basico",
        name: "Sitio Básico",
        price: 300,
        billing: "unico",
        tagline: "Presencia web profesional en pocas semanas.",
        features: [
          "Hasta 5 páginas",
          "Diseño 100% responsive",
          "Formulario de contacto",
          "Optimización SEO básica",
        ],
        deliveryTime: "2 semanas",
      },
      {
        id: "web-ecommerce",
        name: "E-commerce / Avanzado",
        price: 750,
        billing: "unico",
        tagline: "Tu tienda en línea, lista para vender.",
        highlighted: true,
        features: [
          "Tienda online o sitio a medida",
          "Integración de pasarelas de pago",
          "Panel de administración de contenido",
          "SEO avanzado + integración con redes/CRM",
        ],
        deliveryTime: "4 semanas",
      },
      {
        id: "web-enterprise",
        name: "Enterprise / A Medida",
        price: 1500,
        billing: "unico",
        tagline: "Plataformas complejas y de alta escala.",
        features: [
          "Desarrollo 100% a medida",
          "Integraciones personalizadas (APIs, ERPs)",
          "Arquitectura escalable y segura",
          "Soporte prioritario",
        ],
        deliveryTime: "A definir según alcance",
      },
    ],
    faqs: [
      {
        question: "¿El hosting está incluido?",
        answer:
          "El desarrollo del sitio no incluye hosting; lo ofrecemos como servicio independiente (ver 'Hosting y Mantenimiento') para que elijas el nivel que necesitas.",
      },
    ],
    seo: {
      title: "Creación de Páginas Web y Tiendas Online",
      description:
        "Diseño y desarrollo de páginas web y tiendas online rápidas, seguras y optimizadas para SEO. Desde sitios informativos hasta e-commerce a medida con pasarelas de pago.",
    },
  },
  {
    slug: "hosting",
    name: "Hosting y Mantenimiento",
    shortName: "Hosting",
    icon: "Server",
    shortDescription: "Tu sitio siempre disponible, rápido y respaldado.",
    description:
      "Alojamos y mantenemos tu sitio o tienda en línea con monitoreo, respaldos automáticos y soporte técnico, para que tú te enfoques en tu negocio.",
    bullets: [
      "Certificado SSL y monitoreo de disponibilidad",
      "Respaldos automáticos",
      "Soporte técnico continuo",
    ],
    packages: [
      {
        id: "hosting-basico",
        name: "Básico",
        price: 5,
        billing: "mensual",
        tagline: "Para sitios informativos y de bajo tráfico.",
        features: [
          "SSL incluido",
          "Respaldos semanales",
          "99.9% de disponibilidad garantizada",
        ],
      },
      {
        id: "hosting-pro",
        name: "Pro",
        price: 12.5,
        billing: "mensual",
        tagline: "Optimizado para tiendas en línea.",
        highlighted: true,
        features: [
          "Respaldos diarios",
          "CDN para carga rápida global",
          "Monitoreo 24/7",
          "Soporte prioritario",
        ],
      },
      {
        id: "hosting-enterprise",
        name: "Enterprise",
        price: 30,
        billing: "mensual",
        tagline: "Infraestructura dedicada de alta disponibilidad.",
        features: [
          "Infraestructura escalable dedicada",
          "Seguridad avanzada (WAF)",
          "Soporte con SLA garantizado",
        ],
        deliveryTime: "Activación en 48 horas",
      },
    ],
    faqs: [
      {
        question: "¿Puedo migrar un sitio que ya tengo con ustedes?",
        answer:
          "Sí, hacemos la migración sin costo adicional en los planes Pro y Enterprise; para el plan Básico tiene un costo simbólico único.",
      },
    ],
    seo: {
      title: "Hosting Web y Mantenimiento para tu Sitio o Tienda",
      description:
        "Alojamiento web seguro y confiable con SSL, respaldos automáticos, monitoreo 24/7 y soporte técnico. Planes desde sitios informativos hasta e-commerce de alto tráfico.",
    },
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getStartingPrice(service: Service) {
  return Math.min(...service.packages.map((pkg) => pkg.price));
}
