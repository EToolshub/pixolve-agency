// ─────────────────────────────────────────────────────────────────────────
// Casos reales: proyectos publicados o en curso que el visitante puede ver
// por sí mismo. Las capturas y los clips viven en /public/casos (no se
// enlazan desde otros sitios, así no se rompen si el original cambia).
//
// Regla: aquí solo va lo que se puede comprobar. Nada de cifras de
// resultados que no tengamos medidas.
// ─────────────────────────────────────────────────────────────────────────

type Shot = { src: string; alt: string };

export type CaseMedia =
  | { kind: "web"; domain: string; desktop: Shot; mobile: Shot; extra?: Shot }
  | { kind: "video"; clips: { src: string; poster: string; label: string }[] };

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  /** Servicio de Pixolve al que pertenece el caso. */
  service: string;
  /** Estado visible: "En vivo", "Contrato activo"… */
  status: string;
  title: string;
  challenge: string;
  work: string[];
  tags: string[];
  link: { href: string; label: string };
  media: CaseMedia;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "signum-media",
    client: "Signum Media",
    sector: "Señalización digital · Venezuela",
    service: "Páginas Web",
    status: "En vivo en signum.com.ve",
    title: "Una web que enseña, en vivo, cómo se controla una red de pantallas",
    challenge:
      "Signum diseña, instala y automatiza menús digitales para cadenas de comida rápida. Necesitaba una web que le hablara a gerentes de mercadeo de grandes cadenas, no a pequeños negocios.",
    work: [
      "Portada con un muro de pantallas animado: un botón cambia todos los menús a la vez.",
      "Demostración interactiva de su software de automatización por horario y sucursal.",
      "Diseño propio con su identidad y versión móvil pensada aparte.",
      "Publicada en su propio dominio.",
    ],
    tags: ["Diseño web", "WebGL", "Responsive", "Dominio propio"],
    link: { href: "https://signum.com.ve/", label: "Ver sitio en vivo" },
    media: {
      kind: "web",
      domain: "signum.com.ve",
      desktop: { src: "/casos/signum-portada.webp", alt: "Portada de la web de Signum Media con un muro de pantallas digitales" },
      mobile: { src: "/casos/signum-movil.webp", alt: "Web de Signum Media vista en un celular" },
      extra: { src: "/casos/signum-software.webp", alt: "Sección de la web de Signum Media que muestra su software de automatización" },
    },
  },
  {
    slug: "una-vainita",
    client: "Una Vainita",
    sector: "Comida criolla congelada · Caracas",
    service: "Páginas Web",
    status: "En vivo en unavainita.com.ve",
    title: "Un menú que arma el pedido y lo envía por WhatsApp",
    challenge:
      "Una Vainita vende platos criollos congelados. Su menú vivía en un Drive enlazado desde Instagram, y necesitaba una web donde el cliente viera los platos y armara su pedido.",
    work: [
      "Menú de 24 platos con precios, fichas de cada plato y combos armados.",
      "Carrito con forma de vaina que se llena con cada plato y manda el pedido completo por WhatsApp.",
      "Portada ilustrada: una hallaca que se arma mientras bajas por la página.",
      "Identidad de la marca llevada a toda la web, en computadora y celular.",
    ],
    tags: ["Landing de ventas", "Pedidos por WhatsApp", "Ilustración", "Responsive"],
    link: { href: "https://unavainita.com.ve/", label: "Ver sitio en vivo" },
    media: {
      kind: "web",
      domain: "unavainita.com.ve",
      desktop: { src: "/casos/unavainita-portada.webp", alt: "Portada de la web de Una Vainita con una hallaca ilustrada" },
      mobile: { src: "/casos/unavainita-movil.webp", alt: "Web de Una Vainita vista en un celular" },
      extra: { src: "/casos/unavainita-menu.webp", alt: "Menú de combos y carrito de pedido de la web de Una Vainita" },
    },
  },
  {
    slug: "monitor-btc",
    client: "Monitor BTC",
    sector: "Canal de YouTube sobre Bitcoin · casi 90 mil suscriptores",
    service: "Redes Sociales",
    status: "Contrato activo · un Short diario",
    title: "Un Short al día sobre Bitcoin, del guion al video final",
    challenge:
      "El canal publica videos largos cada pocos días y quería volver a los Shorts con constancia. Nos encargó 30 al mes que lleven a la gente hacia sus videos largos.",
    work: [
      "Plan de 30 días repartido en series fijas: Historias de Bitcoin, Mercado en 60 s, Máquina del tiempo y más.",
      "Guiones escritos por nosotros con datos revisados el mismo día.",
      "Animación, voz y edición vertical a 60 fps, con la marca del canal.",
      "Cada Short termina apuntando a un video largo del canal.",
    ],
    tags: ["YouTube Shorts", "Guion", "Motion graphics", "Plan de contenido"],
    link: { href: "https://www.youtube.com/@MonitorBTC/shorts", label: "Ver los Shorts en YouTube" },
    media: {
      kind: "video",
      clips: [
        { src: "/casos/monitorbtc-pizza.mp4", poster: "/casos/monitorbtc-pizza.webp", label: "Historias de Bitcoin" },
        { src: "/casos/monitorbtc-hackeo.mp4", poster: "/casos/monitorbtc-hackeo.webp", label: "Mercado en 60 s" },
        { src: "/casos/monitorbtc-100.mp4", poster: "/casos/monitorbtc-100.webp", label: "Máquina del tiempo" },
      ],
    },
  },
];

export function getCaseStudies(slugs: string[]) {
  return slugs
    .map((slug) => caseStudies.find((c) => c.slug === slug))
    .filter((c): c is CaseStudy => Boolean(c));
}
