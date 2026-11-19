import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { siteConfig } from "@/data/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const homeTitle = `${siteConfig.name} | Agencia de Diseño Gráfico, UI/UX y Desarrollo Web`;
const homeDescription =
  "Agencia de diseño gráfico, diseño UI/UX, manejo de redes sociales, creación de páginas web y hosting para pymes y grandes empresas. Precios claros, pago con PayPal o USDT y soporte directo por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: homeTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: homeDescription,
  keywords: [
    "agencia de diseño",
    "agencia de diseño gráfico",
    "diseño gráfico",
    "diseño UI/UX",
    "manejo de redes sociales",
    "creación de páginas web",
    "diseño de páginas web",
    "hosting web",
    "branding para empresas",
    "agencia de diseño para pymes",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0b0a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${jakarta.variable} ${sora.variable} h-full antialiased`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteConfig.googleAnalyticsId}');
          `}
        </Script>
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip bg-surface text-heading">
        <a
          href="#contenido"
          className="sr-only z-[90] rounded-full bg-brand-500 px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <MotionProvider>
          <AuthProvider>
            <CartProvider>
              <ScrollProgress />
              <Header />
              <main id="contenido" className="flex-1">
                {children}
              </main>
              <Footer />
              <WhatsAppFloatingButton />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
