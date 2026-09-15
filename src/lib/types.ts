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

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  shortDescription: string;
  description: string;
  bullets: string[];
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
