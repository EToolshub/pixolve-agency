import { createClient } from "@supabase/supabase-js";

// La URL y la clave pública ("publishable") están pensadas para exponerse
// en el cliente: el acceso real está protegido por Row Level Security en
// Supabase (ver supabase/migrations/). Permiten sobrescribirse con variables
// NEXT_PUBLIC_* para entornos de desarrollo o staging.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gqjptrcvkbzotzserdop.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_dstVrKuYhGngxh4wQisgpg_yvx4XEST";

export type AuthRedirect =
  | { kind: "error"; code: string }
  | { kind: "ok"; type: "signup" | "recovery" | "magiclink" | "email_change" };

/**
 * Qué traía la URL al llegar desde un enlace de correo de Supabase
 * (confirmar cuenta, recuperar contraseña…). Se lee ANTES de crear el
 * cliente, porque supabase-js limpia la URL al procesar el enlace.
 */
export const authRedirect: AuthRedirect | null = readAuthRedirect();

function readAuthRedirect(): AuthRedirect | null {
  if (typeof window === "undefined") return null;
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);
  const errorCode = hash.get("error_code") ?? query.get("error_code") ?? hash.get("error") ?? query.get("error");
  if (errorCode) return { kind: "error", code: errorCode };
  const type = hash.get("type") ?? query.get("type");
  if (type === "signup" || type === "recovery" || type === "magiclink" || type === "email_change") {
    return { kind: "ok", type };
  }
  return null;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
