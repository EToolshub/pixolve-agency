import { siteConfig } from "@/data/site";
import { getStartingPrice } from "@/data/services";
import type { Service } from "@/lib/types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/opengraph-image`,
    priceRange: "$$",
    areaServed: [
      { "@type": "Place", name: "Latinoamérica" },
      { "@type": "Place", name: "Estados Unidos" },
    ],
    email: siteConfig.email,
    sameAs: Object.values(siteConfig.social),
    knowsAbout: [
      "Diseño gráfico",
      "Branding",
      "Manejo de redes sociales",
      "Diseño UI/UX",
      "Desarrollo web",
      "Hosting",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "es",
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}/servicios/${service.slug}/#service`,
    name: service.name,
    description: service.description,
    serviceType: service.name,
    provider: { "@id": `${siteConfig.url}/#organization` },
    areaServed: [
      { "@type": "Place", name: "Latinoamérica" },
      { "@type": "Place", name: "Estados Unidos" },
    ],
    url: `${siteConfig.url}/servicios/${service.slug}`,
    offers: service.packages.map((pkg) => ({
      "@type": "Offer",
      name: pkg.name,
      price: pkg.price,
      priceCurrency: "USD",
      url: `${siteConfig.url}/servicios/${service.slug}`,
      ...(pkg.billing === "mensual" ? { priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: pkg.price,
        priceCurrency: "USD",
        billingDuration: "P1M",
      } } : {}),
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceListSchema(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}/servicios/${service.slug}`,
      name: service.name,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.shortDescription,
        offers: {
          "@type": "AggregateOffer",
          lowPrice: getStartingPrice(service),
          priceCurrency: "USD",
        },
      },
    })),
  };
}
