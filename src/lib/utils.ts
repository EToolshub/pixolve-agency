import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  const hasCents = !Number.isInteger(amount);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateOrderId() {
  const date = new Date();
  const stamp = `${date.getFullYear().toString().slice(2)}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  // Sin 0/O/1/I para que el número sea fácil de dictar por WhatsApp.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const random = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `PIX-${stamp}-${random}`;
}

export function buildWhatsAppLink(phoneDigitsOnly: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneDigitsOnly}?text=${encoded}`;
}
