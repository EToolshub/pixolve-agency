"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn, formatCurrency, buildWhatsAppLink } from "@/lib/utils";
import { getPendingOrder, savePendingOrder, type PendingOrder } from "@/lib/order-storage";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/data/site";
import type { PaymentMethod } from "@/lib/types";

export function PaymentView() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const pending = getPendingOrder();
    if (!pending) {
      router.replace("/carrito");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación desde localStorage al montar
    setOrder(pending);
  }, [router]);

  if (!order) return null;

  const totalDue = order.totalUnico + order.totalMensual;

  function handleCopy() {
    navigator.clipboard
      .writeText(siteConfig.payments.usdt.walletAddress)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // el navegador bloqueó el acceso al portapapeles; el usuario puede copiar manualmente
      });
  }

  function handleConfirm() {
    if (!order || !method) return;

    savePendingOrder({ ...order, paymentMethod: method });

    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.packageName} (${item.serviceName}) — ${formatCurrency(
            item.price
          )}${item.billing === "mensual" ? "/mes" : ""}`
      )
      .join("\n");

    const message = [
      `Hola Pixolve Agency 👋, quiero confirmar mi pedido *${order.orderId}*.`,
      "",
      itemsList,
      "",
      `Total: ${formatCurrency(totalDue)}${
        order.totalMensual > 0 ? " (incluye primer mes de servicio(s) recurrente(s))" : ""
      }`,
      `Método de pago elegido: ${method === "paypal" ? "PayPal" : "USDT (Binance Pay)"}`,
      "",
      `Nombre: ${order.customer.fullName}`,
      `Correo: ${order.customer.email}`,
      `Teléfono: ${order.customer.phone}`,
      order.customer.company ? `Empresa: ${order.customer.company}` : "",
      `País: ${order.customer.country}`,
      order.customer.notes ? `Notas: ${order.customer.notes}` : "",
      "",
      "Adjunto mi comprobante de pago a continuación.",
    ]
      .filter(Boolean)
      .join("\n");

    const href = buildWhatsAppLink(siteConfig.whatsapp.phoneDigitsOnly, message);
    window.open(href, "_blank", "noopener,noreferrer");
    clearCart();
    setConfirmed(true);
    router.push(`/pedido-confirmado?order=${order.orderId}`);
  }

  return (
    <Container className="max-w-3xl py-16">
      <button
        onClick={() => router.push("/checkout")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis datos
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Elige tu método de pago
      </h1>
      <p className="mt-2 text-slate-600">
        Pedido <span className="font-semibold">{order.orderId}</span> · Total
        a pagar:{" "}
        <span className="font-semibold text-slate-900">
          {formatCurrency(totalDue)}
        </span>
        {order.totalMensual > 0 && " (incluye el primer mes de tu(s) servicio(s) recurrente(s))"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => setMethod("paypal")}
          className={cn(
            "rounded-2xl border-2 p-6 text-left transition-colors",
            method === "paypal"
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 hover:border-blue-300"
          )}
        >
          <span className="text-lg font-bold text-slate-900">PayPal</span>
          <p className="mt-1 text-sm text-slate-600">
            Paga con tu cuenta de PayPal o tarjeta asociada.
          </p>
        </button>

        <button
          onClick={() => setMethod("usdt")}
          className={cn(
            "rounded-2xl border-2 p-6 text-left transition-colors",
            method === "usdt"
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 hover:border-blue-300"
          )}
        >
          <span className="text-lg font-bold text-slate-900">
            USDT (Binance Pay)
          </span>
          <p className="mt-1 text-sm text-slate-600">
            Paga en criptomonedas mediante transferencia USDT.
          </p>
        </button>
      </div>

      {method === "paypal" && (
        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900">Instrucciones de pago con PayPal</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>
              Haz clic en el botón para abrir PayPal con el monto de tu
              pedido ({formatCurrency(totalDue)}) precargado.
            </li>
            <li>Completa el pago desde tu cuenta de PayPal.</li>
            <li>
              Regresa aquí y presiona &quot;Confirmar pedido&quot; para
              enviarnos tu comprobante por WhatsApp.
            </li>
          </ol>
          <Button
            href={`${siteConfig.payments.paypal.meLink}/${totalDue}`}
            variant="secondary"
            className="mt-5"
          >
            Pagar {formatCurrency(totalDue)} con PayPal
          </Button>
          <p className="mt-3 text-xs text-slate-500">
            ¿Prefieres pagar manualmente? Envía tu pago a{" "}
            <span className="font-medium text-slate-700">
              {siteConfig.payments.paypal.email}
            </span>
            .
          </p>
        </div>
      )}

      {method === "usdt" && (
        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900">
            Instrucciones de pago con USDT
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Red: <span className="font-medium">{siteConfig.payments.usdt.network}</span>
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <code className="break-all text-sm text-slate-800">
              {siteConfig.payments.usdt.walletAddress}
            </code>
            <button
              onClick={handleCopy}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-blue-600"
              aria-label="Copiar dirección"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>
              Abre tu app de Binance y envía{" "}
              <span className="font-semibold">
                {totalDue} USDT
              </span>{" "}
              (el monto puede variar ligeramente según la tasa de tu
              exchange) a la dirección de arriba, usando la red indicada.
            </li>
            <li>Toma una captura de pantalla del comprobante de la transacción.</li>
            <li>
              Presiona &quot;Confirmar pedido&quot; y adjunta el comprobante
              en el chat de WhatsApp que se abrirá.
            </li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            Binance Pay ID alternativo:{" "}
            <span className="font-medium text-slate-700">
              {siteConfig.payments.usdt.binancePayId}
            </span>
          </p>
        </div>
      )}

      {method && (
        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
            Al confirmar, abriremos WhatsApp con el resumen de tu pedido para
            que envíes tu comprobante y nuestro equipo valide tu pago en
            menos de 24 horas hábiles.
          </p>
          <Button
            onClick={handleConfirm}
            fullWidth
            variant="whatsapp"
            className="mt-4"
            icon={<MessageCircle className="h-4 w-4" />}
            disabled={confirmed}
          >
            Confirmar pedido y enviar comprobante
          </Button>
        </div>
      )}
    </Container>
  );
}
