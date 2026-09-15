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
import { briefQuestions } from "@/data/briefs";
import type { PaymentMethod } from "@/lib/types";

export function PaymentView() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<"binance" | "wallet" | "paypal" | null>(null);

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

  function handleCopy(field: "binance" | "wallet" | "paypal", value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedField(field);
        window.setTimeout(() => setCopiedField(null), 2000);
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

    const briefLines: string[] = [];
    if (order.briefs) {
      const seenServices = new Map<string, string>();
      for (const item of order.items) {
        if (!seenServices.has(item.serviceSlug)) {
          seenServices.set(item.serviceSlug, item.serviceName);
        }
      }
      for (const [slug, serviceName] of seenServices) {
        const serviceAnswers = order.briefs[slug];
        const questions = briefQuestions[slug];
        if (!serviceAnswers || !questions) continue;

        briefLines.push(" ", `*Briefing — ${serviceName}*`);
        for (const question of questions) {
          const answer = serviceAnswers[question.id];
          if (!answer || (Array.isArray(answer) && answer.length === 0)) continue;
          const text = Array.isArray(answer) ? answer.join(", ") : answer;
          briefLines.push(`${question.label}: ${text}`);
        }
      }
    }

    const message = [
      `Hola Pixolve Agency 👋, quiero confirmar mi pedido *${order.orderId}*.`,
      " ",
      itemsList,
      " ",
      `Total: ${formatCurrency(totalDue)}${
        order.totalMensual > 0 ? " (incluye primer mes de servicio(s) recurrente(s))" : ""
      }`,
      `Método de pago elegido: ${method === "paypal" ? "PayPal" : "USDT (Binance Pay)"}`,
      " ",
      `Nombre: ${order.customer.fullName}`,
      `Correo: ${order.customer.email}`,
      `Teléfono: ${order.customer.phone}`,
      order.customer.company ? `Empresa: ${order.customer.company}` : "",
      `País: ${order.customer.country}`,
      order.customer.notes ? `Notas: ${order.customer.notes}` : "",
      ...briefLines,
      " ",
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
        onClick={() => router.push("/checkout/brief")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al briefing
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight text-heading">
        Elige tu método de pago
      </h1>
      <p className="mt-2 text-body">
        Pedido <span className="font-semibold">{order.orderId}</span> · Total
        a pagar:{" "}
        <span className="font-semibold text-heading">
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
              ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10"
              : "border-default hover:border-blue-300"
          )}
        >
          <span className="text-lg font-bold text-heading">PayPal</span>
          <p className="mt-1 text-sm text-body">
            Paga con tu cuenta de PayPal o tarjeta asociada.
          </p>
        </button>

        <button
          onClick={() => setMethod("usdt")}
          className={cn(
            "rounded-2xl border-2 p-6 text-left transition-colors",
            method === "usdt"
              ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10"
              : "border-default hover:border-blue-300"
          )}
        >
          <span className="text-lg font-bold text-heading">
            USDT (Binance Pay)
          </span>
          <p className="mt-1 text-sm text-body">
            Paga en criptomonedas mediante transferencia USDT.
          </p>
        </button>
      </div>

      {method === "paypal" && (
        <div className="mt-6 rounded-2xl border border-default p-6">
          <h2 className="font-bold text-heading">Instrucciones de pago con PayPal</h2>
          <p className="mt-2 text-sm text-body">Correo de PayPal:</p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-alt p-4">
            <code className="break-all text-sm text-body-strong">
              {siteConfig.payments.paypal.email}
            </code>
            <button
              onClick={() => handleCopy("paypal", siteConfig.payments.paypal.email)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-body shadow-sm hover:text-blue-600"
              aria-label="Copiar correo de PayPal"
            >
              {copiedField === "paypal" ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>
              Abre PayPal (app o web) y envía{" "}
              <span className="font-semibold">{formatCurrency(totalDue)}</span> al
              correo de arriba, eligiendo la opción &quot;Pagar por bienes y
              servicios&quot;.
            </li>
            <li>Toma una captura de pantalla del comprobante de pago.</li>
            <li>
              Presiona &quot;Confirmar pedido&quot; y adjunta el comprobante
              en el chat de WhatsApp que se abrirá.
            </li>
          </ol>
          {siteConfig.payments.paypal.meLink && (
            <Button
              href={`${siteConfig.payments.paypal.meLink}/${totalDue}`}
              variant="secondary"
              className="mt-5"
            >
              Pagar {formatCurrency(totalDue)} con PayPal.Me
            </Button>
          )}
        </div>
      )}

      {method === "usdt" && (
        <div className="mt-6 rounded-2xl border border-default p-6">
          <h2 className="font-bold text-heading">
            Instrucciones de pago con USDT (Binance Pay)
          </h2>
          <p className="mt-2 text-sm text-body">Binance Pay ID:</p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-alt p-4">
            <code className="break-all text-sm text-body-strong">
              {siteConfig.payments.usdt.binancePayId}
            </code>
            <button
              onClick={() => handleCopy("binance", siteConfig.payments.usdt.binancePayId)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-body shadow-sm hover:text-blue-600"
              aria-label="Copiar Binance Pay ID"
            >
              {copiedField === "binance" ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-body">
            <li>
              Abre tu app de Binance, ve a{" "}
              <span className="font-semibold">Pay → Enviar</span> y busca el
              Pay ID de arriba.
            </li>
            <li>
              Envía{" "}
              <span className="font-semibold">{totalDue} USDT</span> (el
              monto puede variar ligeramente según la tasa de tu exchange).
            </li>
            <li>Toma una captura de pantalla del comprobante de la transacción.</li>
            <li>
              Presiona &quot;Confirmar pedido&quot; y adjunta el comprobante
              en el chat de WhatsApp que se abrirá.
            </li>
          </ol>
          {siteConfig.payments.usdt.walletAddress && (
            <p className="mt-3 text-xs text-muted">
              ¿No usas Binance Pay? También puedes enviar USDT ({siteConfig.payments.usdt.network}) a:{" "}
              <span className="font-medium text-body-strong">
                {siteConfig.payments.usdt.walletAddress}
              </span>
            </p>
          )}
        </div>
      )}

      {method && (
        <div className="mt-8 rounded-2xl bg-alt p-6">
          <p className="flex items-center gap-2 text-sm text-body">
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
