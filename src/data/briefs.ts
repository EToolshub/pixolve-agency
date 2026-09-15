import type { BriefQuestion } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────
// Briefings creativos por servicio. Basados en estructuras estándar de la
// industria (brief de branding, cuestionario de diseño web, onboarding de
// redes sociales y brief de UX/producto): objetivo, público, referencias,
// preferencias de estilo y alcance funcional. Se muestran en el checkout
// antes del pago para que el equipo empiece a trabajar con información
// precisa desde el primer día.
// ─────────────────────────────────────────────────────────────────────────

export const briefQuestions: Record<string, BriefQuestion[]> = {
  "diseno-grafico": [
    {
      id: "marca",
      label: "Nombre de tu marca o empresa",
      type: "text",
      required: true,
    },
    {
      id: "negocio",
      label: "¿A qué se dedica tu negocio?",
      type: "textarea",
      required: true,
    },
    {
      id: "publico",
      label: "¿Cuál es tu público objetivo?",
      type: "textarea",
      required: true,
    },
    {
      id: "diferenciador",
      label: "¿Qué te hace diferente de tu competencia?",
      type: "textarea",
    },
    {
      id: "estilo",
      label: "¿Qué estilo visual buscas?",
      type: "checkboxes",
      options: [
        "Moderno / Minimalista",
        "Clásico / Elegante",
        "Divertido / Colorido",
        "Corporativo / Serio",
        "Artesanal / Orgánico",
        "Bold / Atrevido",
      ],
    },
    {
      id: "colores",
      label: "Colores que te gustaría incluir o evitar",
      type: "text",
      placeholder: "Ej. azul y blanco sí, rojo no",
    },
    {
      id: "identidad_actual",
      label: "¿Ya tienes un logo o identidad actual?",
      type: "select",
      options: [
        "Sí, quiero un rediseño",
        "No, es mi primera marca",
        "Tengo elementos sueltos (sin definir)",
      ],
    },
    {
      id: "referencias",
      label: "Marcas o diseños que te inspiren (nombres o enlaces)",
      type: "textarea",
    },
    {
      id: "uso",
      label: "¿Dónde usarás principalmente el diseño?",
      type: "checkboxes",
      options: [
        "Redes sociales",
        "Sitio web",
        "Impresos",
        "Empaque / Producto",
        "Señalética",
        "Otro",
      ],
    },
  ],

  "redes-sociales": [
    {
      id: "negocio",
      label: "Nombre y giro de tu negocio",
      type: "text",
      required: true,
    },
    {
      id: "redes_actuales",
      label: "Redes sociales actuales (usuarios o enlaces)",
      type: "text",
    },
    {
      id: "objetivo",
      label: "Objetivo principal",
      type: "select",
      options: [
        "Aumentar ventas",
        "Reconocimiento de marca",
        "Crecer comunidad / seguidores",
        "Generar tráfico al sitio web",
        "Otro",
      ],
      required: true,
    },
    {
      id: "publico",
      label: "Público objetivo (edad, ubicación, intereses)",
      type: "textarea",
      required: true,
    },
    {
      id: "referencias",
      label: "Cuentas de referencia o competidores",
      type: "textarea",
    },
    {
      id: "tono",
      label: "Tono de voz deseado",
      type: "checkboxes",
      options: [
        "Cercano / Casual",
        "Profesional / Formal",
        "Divertido / Humorístico",
        "Inspirador",
        "Técnico / Educativo",
      ],
    },
    {
      id: "contenido",
      label: "Tipo de contenido que prefieres",
      type: "checkboxes",
      options: [
        "Educativo",
        "Promocional",
        "Detrás de cámaras",
        "Testimonios / Casos de éxito",
        "Tendencias / Retos",
      ],
    },
    {
      id: "material",
      label: "¿Tienes material existente (fotos, videos, logo)?",
      type: "select",
      options: [
        "Sí, tengo fotos/videos y logo",
        "Tengo algo, pero falta mucho",
        "No tengo nada aún",
      ],
    },
    {
      id: "fechas_clave",
      label: "Fechas o campañas importantes próximas",
      type: "text",
    },
  ],

  "diseno-ui-ux": [
    {
      id: "proyecto",
      label: "Nombre del producto o proyecto",
      type: "text",
      required: true,
    },
    {
      id: "problema",
      label: "¿Qué problema resuelve para tus usuarios?",
      type: "textarea",
      required: true,
    },
    {
      id: "tipo_producto",
      label: "Tipo de producto",
      type: "select",
      options: [
        "App móvil",
        "Aplicación web",
        "Landing page",
        "Dashboard / Panel interno",
        "Tienda en línea",
        "Otro",
      ],
    },
    {
      id: "plataformas",
      label: "Plataformas objetivo",
      type: "checkboxes",
      options: ["iOS", "Android", "Web de escritorio", "Web responsive"],
    },
    {
      id: "usuarios",
      label: "¿Quiénes son tus usuarios principales?",
      type: "textarea",
      required: true,
    },
    {
      id: "funcionalidades",
      label: "Funcionalidades imprescindibles (must-have)",
      type: "textarea",
    },
    {
      id: "referencias",
      label: "Apps o productos de referencia (qué te gusta de ellos)",
      type: "textarea",
    },
    {
      id: "identidad",
      label: "¿Ya tienes identidad de marca (logo, colores)?",
      type: "select",
      options: [
        "Sí, ya tengo guía de marca",
        "Tengo logo pero nada más",
        "No tengo nada aún",
      ],
    },
    {
      id: "punto_partida",
      label: "¿Partes de cero o ya existe una versión anterior?",
      type: "select",
      options: ["Desde cero", "Rediseño de un producto existente"],
    },
  ],

  "paginas-web": [
    {
      id: "negocio",
      label: "Nombre del negocio o proyecto",
      type: "text",
      required: true,
    },
    {
      id: "objetivo",
      label: "Objetivo principal del sitio",
      type: "select",
      options: [
        "Vender en línea",
        "Generar clientes potenciales (leads)",
        "Informar sobre mi negocio",
        "Mostrar portafolio",
        "Otro",
      ],
      required: true,
    },
    {
      id: "publico",
      label: "Público objetivo",
      type: "textarea",
    },
    {
      id: "paginas",
      label: "Páginas o secciones que necesitas",
      type: "checkboxes",
      options: [
        "Inicio",
        "Nosotros",
        "Servicios / Productos",
        "Blog",
        "Tienda en línea",
        "Contacto",
        "Otro",
      ],
    },
    {
      id: "referencias",
      label: "Sitios web que te gusten (y qué te gusta de ellos)",
      type: "textarea",
    },
    {
      id: "contenido",
      label: "¿Ya tienes contenido listo (textos e imágenes)?",
      type: "select",
      options: [
        "Sí, tengo todo listo",
        "Tengo algo, falta completar",
        "Necesito ayuda con el contenido",
      ],
    },
    {
      id: "funcionalidades",
      label: "Funcionalidades especiales",
      type: "checkboxes",
      options: [
        "Tienda en línea",
        "Reservas / citas",
        "Formularios avanzados",
        "Multilenguaje",
        "Integración con CRM / Email marketing",
        "Ninguna por ahora",
      ],
    },
    {
      id: "dominio",
      label: "¿Ya tienes dominio y hosting actuales?",
      type: "text",
      placeholder: "Ej. midominio.com, alojado en...",
    },
    {
      id: "fecha_limite",
      label: "¿Para cuándo necesitas el sitio listo?",
      type: "text",
    },
  ],

  hosting: [
    {
      id: "migracion",
      label: "¿Tienes un sitio actual que quieras migrar?",
      type: "select",
      options: ["Sí", "No, es un sitio nuevo"],
      required: true,
    },
    {
      id: "url_actual",
      label: "URL del sitio actual (si aplica)",
      type: "text",
    },
    {
      id: "plataforma",
      label: "Plataforma o tecnología de tu sitio",
      type: "select",
      options: [
        "WordPress",
        "Next.js / React",
        "Shopify",
        "Wix / Squarespace",
        "No lo sé",
        "Otro",
      ],
    },
    {
      id: "trafico",
      label: "Tráfico mensual aproximado",
      type: "select",
      options: [
        "Menos de 1,000 visitas",
        "1,000 – 10,000 visitas",
        "10,000 – 50,000 visitas",
        "Más de 50,000 visitas",
        "No lo sé",
      ],
    },
    {
      id: "correo",
      label: "¿Necesitas correo corporativo (@tudominio.com)?",
      type: "select",
      options: ["Sí", "No"],
    },
    {
      id: "dominio_propio",
      label: "¿Ya tienes un dominio propio?",
      type: "select",
      options: ["Sí, ya lo tengo", "No, necesito comprarlo"],
    },
    {
      id: "requisitos",
      label: "Requisitos especiales",
      type: "checkboxes",
      options: [
        "Certificado SSL",
        "Base de datos",
        "Alto tráfico esperado",
        "Cumplimiento normativo (GDPR, etc.)",
        "Ninguno en particular",
      ],
    },
  ],
};
