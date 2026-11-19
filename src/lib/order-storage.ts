import type {
  CartItem,
  CustomerInfo,
  PaymentMethod,
  ServiceBriefAnswers,
} from "@/lib/types";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "pixolve-pending-order";

export type PendingOrder = {
  orderId: string;
  customer: CustomerInfo;
  items: CartItem[];
  totalUnico: number;
  totalMensual: number;
  paymentMethod?: PaymentMethod;
  briefs?: Record<string, ServiceBriefAnswers>;
  /** Fecha ISO en que el cliente confirmó el pedido; a partir de ahí no se reutiliza. */
  confirmedAt?: string;
};

export function savePendingOrder(order: PendingOrder) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // almacenamiento no disponible; el flujo continúa igualmente
  }
}

export function getPendingOrder(): PendingOrder | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingOrder) : null;
  } catch {
    return null;
  }
}

/**
 * Guarda el pedido confirmado en Supabase (tabla `orders`). Las reglas de
 * seguridad solo permiten crearlo como "pendiente" y a nombre del propio
 * cliente; el estado lo cambia el administrador desde /admin.
 */
export async function saveOrderToDatabase(order: PendingOrder, userId: string | null) {
  const c = order.customer;
  const { error } = await supabase.from("orders").insert({
    order_code: order.orderId,
    user_id: userId,
    customer_name: c.fullName.trim(),
    customer_email: c.email.trim().toLowerCase(),
    customer_phone: c.phone.trim(),
    customer_company: c.company?.trim() || null,
    customer_country: c.country,
    notes: c.notes?.trim() || null,
    items: order.items,
    briefs: order.briefs ?? null,
    total_unico: order.totalUnico,
    total_mensual: order.totalMensual,
    payment_method: order.paymentMethod ?? null,
  });
  if (error) throw error;
}

export function clearPendingOrder() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorado
  }
}
