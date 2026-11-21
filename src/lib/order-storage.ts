import type {
  CartItem,
  CustomerInfo,
  PaymentMethod,
  ServiceBriefAnswers,
} from "@/lib/types";
import { services } from "@/data/services";
import { formatCurrency } from "@/lib/utils";
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

/** Recalcula los precios e ítems contra el catálogo oficial antes de persistir. */
export function reconcilePendingOrder(order: PendingOrder): PendingOrder {
  const validItems = order.items.flatMap((item) => {
    const service = services.find((s) => s.slug === item.serviceSlug);
    const pkg = service?.packages.find((p) => p.id === item.packageId);
    if (!service || !pkg) return [];
    return [
      {
        ...item,
        serviceName: service.name,
        packageName: pkg.name,
        price: pkg.price,
        billing: pkg.billing,
      },
    ];
  });

  const items = validItems.length > 0 ? validItems : order.items;
  return {
    ...order,
    items,
    totalUnico: items.filter((i) => i.billing === "unico").reduce((sum, i) => sum + i.price, 0),
    totalMensual: items.filter((i) => i.billing === "mensual").reduce((sum, i) => sum + i.price, 0),
  };
}

/**
 * Construye un mensaje conciso para WhatsApp que evita superar límites de
 * longitud de URL en móviles (el briefing completo se guarda en Supabase y
 * llega por correo a la agencia).
 */
export function buildOrderWhatsAppMessage(order: PendingOrder, method?: PaymentMethod): string {
  const normalized = reconcilePendingOrder(order);
  const totalDue = normalized.totalUnico + normalized.totalMensual;
  const chosen = method ?? normalized.paymentMethod;
  const itemsList = normalized.items
    .map(
      (item) =>
        `• ${item.packageName} (${item.serviceName}) — ${formatCurrency(item.price)}${
          item.billing === "mensual" ? "/mes" : ""
        }`
    )
    .join("\n");

  const hasBrief = Boolean(
    normalized.briefs &&
      Object.values(normalized.briefs).some((answers) =>
        Object.values(answers).some((v) =>
          typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) && v.length > 0
        )
      )
  );

  return [
    `Hola Pixolve Agency 👋, quiero confirmar mi pedido *${normalized.orderId}*.`,
    " ",
    itemsList,
    " ",
    `Total: ${formatCurrency(totalDue)} USD${
      normalized.totalMensual > 0 ? " (incluye primer mes de servicio(s) recurrente(s))" : ""
    }`,
    chosen ? `Método de pago: ${chosen === "paypal" ? "PayPal" : "USDT (Binance Pay)"}` : "",
    " ",
    `Nombre: ${normalized.customer.fullName}`,
    `Correo: ${normalized.customer.email}`,
    normalized.customer.company ? `Empresa: ${normalized.customer.company}` : "",
    `País: ${normalized.customer.country}`,
    hasBrief ? "Briefing completado en la web." : "",
    " ",
    "Adjunto mi comprobante de pago a continuación.",
  ]
    .filter(Boolean)
    .join("\n");
}

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
  const normalized = reconcilePendingOrder(order);
  const c = normalized.customer;
  const { error } = await supabase.from("orders").insert({
    order_code: normalized.orderId,
    user_id: userId,
    customer_name: c.fullName.trim(),
    customer_email: c.email.trim().toLowerCase(),
    customer_phone: c.phone.trim(),
    customer_company: c.company?.trim() || null,
    customer_country: c.country,
    notes: c.notes?.trim() || null,
    items: normalized.items,
    briefs: normalized.briefs ?? null,
    total_unico: normalized.totalUnico,
    total_mensual: normalized.totalMensual,
    payment_method: normalized.paymentMethod ?? null,
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
