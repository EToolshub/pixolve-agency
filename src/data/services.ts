import type { Service } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────
// Catálogo de servicios. Los precios son ejemplos profesionales de
// referencia: ajústalos a tu mercado real antes de publicar.
//
// Cada servicio tiene su propia página en /servicios/[slug] que se arma con
// estos datos: titular (headline), entregables (deliverables), pasos de
// trabajo (steps), perfiles ideales (idealFor), paquetes y preguntas.
// Los íconos son nombres registrados en src/lib/icon-map.ts.
// ─────────────────────────────────────────────────────────────────────────

export const services: Service[] = [
  {
    slug: "diseno-grafico",
    name: "Diseño Gráfico",
    shortName: "Diseño Gráfico",
    icon: "PenTool",
    category: "Diseño",
    headline: "Una marca que se reconoce al primer vistazo",
    portfolioCategory: "Branding",
    shortDescription:
      "Identidad visual y piezas gráficas que comunican quién eres.",
    description:
      "Creamos identidades de marca sólidas y piezas gráficas que conectan con tu audiencia: desde un logo profesional hasta un sistema de marca completo listo para escalar.",
    bullets: [
      "Logotipo y sistema de marca",
      "Manual de marca y guías de uso",
      "Piezas para redes, impresos y punto de venta",
    ],
    deliverables: [
      { icon: "PenTool", title: "Logotipo profesional", description: "Propuestas originales diseñadas desde cero, pensadas para verse bien en cualquier tamaño y soporte." },
      { icon: "Palette", title: "Paleta y tipografías", description: "Un sistema de color y tipografías coherente para que tu marca se vea igual en todos tus canales." },
      { icon: "BookOpen", title: "Manual de marca", description: "Guía clara de uso del logo, colores y aplicaciones para que cualquier persona use tu marca correctamente." },
      { icon: "Layers", title: "Archivos editables", description: "Recibes los archivos fuente (AI/Figma) y los formatos listos para usar: PNG, SVG y PDF." },
    ],
    steps: [
      { title: "Brief de marca", description: "Nos cuentas quién eres, a quién le hablas y qué te diferencia, con un cuestionario guiado." },
      { title: "Exploración creativa", description: "Investigamos tu sector y creamos propuestas de concepto con una dirección visual clara." },
      { title: "Refinamiento", description: "Ajustamos la propuesta elegida contigo dentro de las rondas de revisión de tu paquete." },
      { title: "Entrega final", description: "Te entregamos el logo, el sistema visual y todos los archivos organizados y listos para usar." },
    ],
    idealFor: [
      "Emprendimientos que lanzan su marca",
      "Negocios que necesitan un rebranding",
      "Empresas que quieren unificar su imagen",
    ],
    packages: [
      {
        id: "diseno-grafico-esencial",
        name: "Esencial",
        price: 50,
        billing: "unico",
        tagline: "Ideal para marcas que están empezando.",
        features: [
          "Logotipo profesional (2 propuestas)",
          "Paleta de colores y tipografías",
          "2 rondas de revisión",
          "Archivos en formatos editables y de impresión",
        ],
        deliveryTime: "2 días hábiles",
      },
      {
        id: "diseno-grafico-profesional",
        name: "Profesional",
        price: 100,
        billing: "unico",
        tagline: "Identidad completa lista para todos tus canales.",
        highlighted: true,
        features: [
          "Identidad de marca completa (logo, paleta, tipografía)",
          "Manual de marca digital",
          "5 plantillas para redes sociales",
          "3 rondas de revisión",
          "Papelería digital (tarjeta, firma de correo)",
        ],
        deliveryTime: "5 días hábiles",
      },
      {
        id: "diseno-grafico-empresarial",
        name: "Empresarial",
        price: 300,
        billing: "unico",
        tagline: "Sistema de marca a escala, con gerente dedicado.",
        features: [
          "Sistema de marca extendido (múltiples líneas)",
          "Soporte de naming y tono de voz",
          "Guidelines extensos para equipos internos",
          "6 rondas de revisión",
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
    category: "Marketing",
    headline: "Redes sociales que construyen comunidad y ventas",
    portfolioCategory: "Redes Sociales",
    shortDescription:
      "Gestión de contenido y comunidad para pymes y grandes empresas.",
    description:
      "Gestionamos tus redes sociales de punta a punta: estrategia, contenido, diseño y community management, con planes que crecen contigo desde una pyme hasta una operación multicanal de alto volumen.",
    bullets: [
      "Estrategia de contenido y calendario editorial",
      "Diseño de piezas y producción audiovisual",
      "Community management y reportes de resultados",
    ],
    deliverables: [
      { icon: "CalendarDays", title: "Calendario editorial", description: "Planificación mensual de contenido alineada a tus objetivos, fechas clave y lanzamientos." },
      { icon: "Video", title: "Diseño y reels", description: "Piezas gráficas y videos de formato corto con la identidad de tu marca, listos para publicar." },
      { icon: "MessagesSquare", title: "Community management", description: "Respondemos comentarios y mensajes para que tu comunidad se sienta escuchada." },
      { icon: "ChartColumn", title: "Reportes de resultados", description: "Métricas claras y recomendaciones accionables para mejorar mes a mes." },
    ],
    steps: [
      { title: "Diagnóstico", description: "Revisamos tus redes actuales y tu competencia, y definimos objetivos medibles." },
      { title: "Estrategia", description: "Creamos pilares de contenido, tono de voz y el calendario del primer mes." },
      { title: "Producción y publicación", description: "Diseñamos, programamos y publicamos tu contenido con tu aprobación previa." },
      { title: "Medición y mejora", description: "Analizamos resultados y ajustamos la estrategia en cada ciclo." },
    ],
    idealFor: [
      "Pymes sin tiempo para publicar",
      "Marcas que quieren vender por redes",
      "Empresas con operación multicanal",
    ],
    packages: [
      {
        id: "redes-starter",
        name: "Starter (Pymes)",
        price: 150,
        billing: "mensual",
        tagline: "Presencia constante y profesional desde el primer mes.",
        features: [
          "1 red social",
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
          "2 redes sociales",
          "20 publicaciones + 2 reels al mes",
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
          "3 redes sociales",
          "24 publicaciones + 4 reels al mes",
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
    category: "Diseño",
    headline: "Interfaces que se entienden sin instrucciones",
    portfolioCategory: "UI/UX",
    shortDescription: "Interfaces claras y experiencias que convierten.",
    description:
      "Diseñamos productos digitales centrados en el usuario: research, wireframes, prototipos interactivos y una interfaz final pulida y lista para desarrollo.",
    bullets: [
      "Investigación de usuarios y arquitectura de información",
      "Wireframes y prototipos interactivos en Figma",
      "Sistemas de diseño escalables",
    ],
    deliverables: [
      { icon: "ScanSearch", title: "Research de usuarios", description: "Entendemos a tus usuarios y sus problemas antes de dibujar una sola pantalla." },
      { icon: "Workflow", title: "Arquitectura y wireframes", description: "Flujos claros y una estructura de información que reduce la fricción." },
      { icon: "MousePointerClick", title: "Prototipo interactivo", description: "Un prototipo navegable en Figma para validar la experiencia antes de desarrollar." },
      { icon: "Blocks", title: "Sistema de diseño", description: "Componentes reutilizables y documentados que aceleran a tu equipo de desarrollo." },
    ],
    steps: [
      { title: "Descubrimiento", description: "Definimos objetivos de negocio, usuarios y métricas de éxito del producto." },
      { title: "Wireframes", description: "Diseñamos la estructura y los flujos principales en baja fidelidad." },
      { title: "UI y prototipo", description: "Aplicamos la interfaz final y armamos un prototipo navegable de alta fidelidad." },
      { title: "Handoff", description: "Entregamos especificaciones y componentes listos para que tu equipo implemente." },
    ],
    idealFor: [
      "Startups validando un MVP",
      "Empresas rediseñando su app o plataforma",
      "Equipos de producto que necesitan un design system",
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
    icon: "Globe",
    category: "Desarrollo",
    headline: "Sitios web rápidos, seguros y hechos para vender",
    portfolioCategory: "UI/UX",
    shortDescription: "Sitios y tiendas online rápidas, seguras y a tu medida.",
    description:
      "Construimos sitios web y tiendas en línea modernas, optimizadas para conversión y velocidad, desde un sitio informativo hasta una plataforma e-commerce a medida.",
    bullets: [
      "Diseño responsive y optimizado para SEO",
      "Tiendas en línea con pasarelas de pago",
      "Integraciones a medida (CRM, APIs, ERPs)",
    ],
    deliverables: [
      { icon: "Smartphone", title: "Diseño responsive", description: "Tu sitio se ve y funciona perfecto en celulares, tablets y computadoras." },
      { icon: "Gauge", title: "Velocidad y SEO", description: "Optimizado para cargar rápido y aparecer en Google desde el primer día." },
      { icon: "Store", title: "Tienda y pagos", description: "Catálogo, carrito y pasarelas de pago integradas para vender en línea." },
      { icon: "CodeXml", title: "Integraciones", description: "Conectamos tu sitio con CRM, APIs, ERPs y herramientas de marketing." },
    ],
    steps: [
      { title: "Planificación", description: "Definimos objetivos, páginas, contenido y funcionalidades del sitio." },
      { title: "Diseño", description: "Diseñamos la experiencia y la interfaz con tu identidad de marca." },
      { title: "Desarrollo", description: "Construimos el sitio con código limpio, rápido y seguro." },
      { title: "Lanzamiento", description: "Publicamos, probamos todo y te capacitamos para administrarlo." },
    ],
    idealFor: [
      "Negocios sin presencia web",
      "Marcas que quieren vender en línea",
      "Empresas con procesos que integrar",
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
    category: "Desarrollo",
    headline: "Tu sitio siempre en línea, sin preocupaciones técnicas",
    shortDescription: "Tu sitio siempre disponible, rápido y respaldado.",
    description:
      "Alojamos y mantenemos tu sitio o tienda en línea con monitoreo, respaldos automáticos y soporte técnico, para que tú te enfoques en tu negocio.",
    bullets: [
      "Certificado SSL y monitoreo de disponibilidad",
      "Respaldos automáticos",
      "Soporte técnico continuo",
    ],
    deliverables: [
      { icon: "Lock", title: "Certificado SSL", description: "Conexión cifrada (HTTPS) incluida para proteger a tus visitantes y mejorar tu SEO." },
      { icon: "HardDrive", title: "Respaldos automáticos", description: "Copias de seguridad periódicas para recuperar tu sitio ante cualquier imprevisto." },
      { icon: "Gauge", title: "Monitoreo y velocidad", description: "Vigilamos la disponibilidad y el rendimiento de tu sitio de forma continua." },
      { icon: "LifeBuoy", title: "Soporte técnico", description: "Un equipo real que resuelve incidencias y actualizaciones por ti." },
    ],
    steps: [
      { title: "Evaluación", description: "Revisamos tu sitio actual y elegimos el plan adecuado a tu tráfico." },
      { title: "Migración", description: "Movemos tu sitio sin pérdida de datos y con el menor tiempo fuera de línea." },
      { title: "Configuración", description: "Activamos SSL, respaldos, monitoreo y optimizaciones de velocidad." },
      { title: "Soporte continuo", description: "Mantenemos tu sitio actualizado y te atendemos cuando lo necesites." },
    ],
    idealFor: [
      "Sitios informativos y landing pages",
      "Tiendas en línea con tráfico constante",
      "Empresas que necesitan alta disponibilidad",
    ],
    packages: [
      {
        id: "hosting-basico",
        name: "Básico",
        price: 15,
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
        price: 35,
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
        price: 60,
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

export function getStartingPackage(service: Service) {
  return service.packages.reduce((min, pkg) => (pkg.price < min.price ? pkg : min));
}
