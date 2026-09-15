import type {
  CartItem,
  CustomerInfo,
  PaymentMethod,
  ServiceBriefAnswers,
} from "@/lib/types";

const STORAGE_KEY = "pixolve-pending-order";

export type PendingOrder = {
  orderId: string;
  customer: CustomerInfo;
  items: CartItem[];
  totalUnico: number;
  totalMensual: number;
  paymentMethod?: PaymentMethod;
  briefs?: Record<string, ServiceBriefAnswers>;
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

export function clearPendingOrder() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorado
  }
}
