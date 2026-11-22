import type { NextConfig } from "next";

const SUPABASE_HOST = "gqjptrcvkbzotzserdop.supabase.co";

const GOOGLE_ANALYTICS =
  "https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://mir-s3-cdn-cf.behance.net ${GOOGLE_ANALYTICS}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST} ${GOOGLE_ANALYTICS} https://vercel.live`,
  "frame-src https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Cabeceras de seguridad aplicadas a todo el sitio.
const securityHeaders = [
  // Fuerza HTTPS durante 2 años (incluye subdominios).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Impide que el sitio se incruste en iframes de terceros (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Lista blanca de orígenes. connect-src solo permite NUESTRO proyecto de
  // Supabase: si alguien inyecta código o cambia la configuración, el
  // navegador se niega a mandar contraseñas o datos a otro servidor.
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Evita que el navegador "adivine" tipos de archivo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No filtra la URL completa (con número de pedido) a sitios externos.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs del navegador que el sitio no usa.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
