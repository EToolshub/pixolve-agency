import type { CartItem, PaymentMethod, ServiceBriefAnswers } from "@/lib/types";

// Tipos de las tablas de Supabase usadas por la cuenta del cliente y el panel
// de administrador. El esquema completo está en supabase/migrations/.

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

export type OrderStatus = "pendiente" | "pagado" | "en_progreso" | "entregado" | "cancelado";

export type OrderRow = {
  id: string;
  order_code: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string | null;
  customer_country: string;
  notes: string | null;
  items: CartItem[];
  briefs: Record<string, ServiceBriefAnswers> | null;
  total_unico: number;
  total_mensual: number;
  payment_method: PaymentMethod | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type Subscriber = {
  email: string;
  source: string | null;
  created_at: string;
};

export const orderStatuses: { id: OrderStatus; label: string; tone: string }[] = [
  { id: "pendiente", label: "Pago por verificar", tone: "bg-amber-500/10 text-amber-300 ring-amber-500/25" },
  { id: "pagado", label: "Pago verificado", tone: "bg-sky-500/10 text-sky-300 ring-sky-500/25" },
  { id: "en_progreso", label: "En progreso", tone: "bg-brand-500/10 text-brand-300 ring-brand-500/25" },
  { id: "entregado", label: "Entregado", tone: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25" },
  { id: "cancelado", label: "Cancelado", tone: "bg-white/5 text-muted ring-white/10" },
];

export function getOrderStatus(status: OrderStatus) {
  return orderStatuses.find((s) => s.id === status) ?? orderStatuses[0];
}

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}

/** Solo permite volver a rutas internas del sitio (evita redirecciones abiertas). */
export function safeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return null;
  return next;
}

/** Traduce los errores de Supabase Auth a mensajes claros en español. */
export function authErrorMessage(error: { code?: string; message?: string; status?: number } | null) {
  if (!error) return "";
  switch (error.code) {
    case "invalid_credentials":
      return "Correo o contraseña incorrectos.";
    case "email_not_confirmed":
      return "Primero confirma tu correo: revisa tu bandeja de entrada (y la carpeta de spam).";
    case "user_already_exists":
    case "email_exists":
      return "Ya existe una cuenta con ese correo. Inicia sesión.";
    case "weak_password":
      return "La contraseña es muy débil. Usa al menos 8 caracteres combinando letras y números.";
    case "email_address_invalid":
      return "Ese correo no es válido.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Demasiados intentos seguidos. Espera unos minutos y vuelve a intentarlo.";
    case "email_address_not_authorized":
      return "No pudimos enviar el correo de confirmación. Escríbenos por WhatsApp y te ayudamos.";
    case "signup_disabled":
      return "El registro de cuentas está desactivado por ahora.";
    case "same_password":
      return "La nueva contraseña debe ser distinta a la anterior.";
    default:
      if (error.status === 0 || error.message?.toLowerCase().includes("fetch")) {
        return "Sin conexión. Revisa tu internet e intenta de nuevo.";
      }
      return "Algo salió mal. Intenta de nuevo en un momento.";
  }
}
