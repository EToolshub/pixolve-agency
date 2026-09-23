export type Billing = "unico" | "mensual";

export type ServicePackage = {
  id: string;
  name: string;
  price: number;
  billing: Billing;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  deliveryTime?: string;
};

export type ServiceCategory = "Diseño" | "Marketing" | "Desarrollo";

export type ServiceHighlight = {
  /** Nombre de un ícono registrado en `src/lib/icon-map.ts`. */
  icon: string;
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  category: ServiceCategory;
  /** Titular corto y persuasivo para la página individual del servicio. */
  headline: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  /** Entregables / qué obtienes, mostrados como bento en la página del servicio. */
  deliverables: ServiceHighlight[];
  /** Pasos específicos de cómo se trabaja este servicio. */
  steps: { title: string; description: string }[];
  /** Perfiles de cliente para los que este servicio es ideal. */
  idealFor: string[];
  /** Categoría del portafolio relacionada, para mostrar trabajos reales. */
  portfolioCategory?: "Branding" | "UI/UX" | "Redes Sociales";
  packages: ServicePackage[];
  faqs: { question: string; answer: string }[];
  seo: {
    title: string;
    description: string;
  };
};

export type CartItem = {
  cartItemId: string;
  serviceSlug: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  price: number;
  billing: Billing;
};

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  notes?: string;
};

export type PaymentMethod = "paypal" | "usdt";

export type BriefQuestion = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkboxes";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type BriefAnswer = string | string[];

export type ServiceBriefAnswers = Record<string, BriefAnswer>;
