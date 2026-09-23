import type { NextConfig } from "next";

// Cabeceras de seguridad aplicadas a todo el sitio.
const securityHeaders = [
  // Fuerza HTTPS durante 2 años (incluye subdominios).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Impide que el sitio se incruste en iframes de terceros (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  // Evita que el navegador "adivine" tipos de archivo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No filtra la URL completa (con número de pedido) a sitios externos.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs del navegador que el sitio no usa.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
