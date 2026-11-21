"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Copy,
  Hammer,
  MessageCircle,
  Printer,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";
import { formatCurrency, buildWhatsAppLink } from "@/lib/utils";
import { buildOrderWhatsAppMessage, getPendingOrder, type PendingOrder } from "@/lib/order-storage";
import { siteConfig } from "@/data/site";

const nextSteps = [
  {
    icon: BadgeCheck,
    title: "Validamos tu pago",
    description: "Nuestro equipo confirma tu comprobante en menos de 24 horas hábiles.",
  },
  {
    icon: CalendarCheck,
    title: "Reunión de arranque",
    description: "Te contactamos por WhatsApp o correo para agendar el kickoff.",
  },
  {
    icon: Hammer,
    title: "Manos a la obra",
    description: "Comenzamos tu proyecto según el tiempo de entrega de tu paquete.",
  },
];

export function OrderConfirmationView() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("order");
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const pending = getPendingOrder();
    // Solo mostramos el resumen si corresponde al pedido de la URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación desde localStorage al montar
    setOrder(pending && (!orderIdParam || pending.orderId === orderIdParam) ? pending : null);
  }, [orderIdParam]);

  const orderId = order?.orderId ?? orderIdParam;
  const totalDue = order ? order.totalUnico + order.totalMensual : 0;

  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    order
      ? buildOrderWhatsAppMessage(order)
      : `Hola Pixolve Agency 👋, quiero enviar el comprobante de pago de mi pedido ${orderId ?? ""}.`
  );

  function copyOrderId() {
    if (!orderId) return;
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
      <Container className="relative max-w-3xl py-16 sm:py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-ink-950 shadow-[0_0_0_10px_rgb(16_185_129/0.12),0_0_0_22px_rgb(16_185_129/0.06)]"
          >
            <Check className="h-10 w-10" strokeWidth={3} />
          </motion.div>

          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-heading sm:text-5xl">
            ¡Gracias por tu pedido!
          </h1>
          {orderId && (
            <button
              type="button"
              onClick={copyOrderId}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-body ring-1 ring-white/10 transition-colors hover:text-white"
              aria-label={`Copiar número de pedido ${orderId}`}
            >
              Pedido <span className="font-mono font-semibold text-heading">{orderId}</span>
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
          <p className="mx-auto mt-5 max-w-xl text-body">
            Abrimos WhatsApp con el resumen de tu pedido. Si no se abrió
            automáticamente, escríbenos y adjunta tu comprobante de pago para
            confirmar tu proyecto.
          </p>

          <div className="no-print mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={whatsappHref} variant="whatsapp" size="lg" icon={<MessageCircle className="h-5 w-5" />}>
              Abrir WhatsApp
            </Button>
            {order && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.print()}
                icon={<Printer className="h-5 w-5" />}
              >
                Imprimir / guardar recibo
              </Button>
            )}
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-default bg-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-heading">¿Qué sigue ahora?</h2>
          <ol className="relative mt-6 space-y-6">
            <span aria-hidden className="absolute bottom-3 left-5 top-3 w-px bg-gradient-to-b from-brand-500 to-transparent" />
            {nextSteps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.12 }}
                className="relative flex gap-4"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-800 text-brand-400 ring-1 ring-brand-500/40">
                  <step.icon className="h-4.5 w-4.5" />
                </span>
                <div className="pt-1">
                  <p className="font-semibold text-heading">{step.title}</p>
                  <p className="mt-0.5 text-sm text-body">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {order && order.items.length > 0 && (
          <div className="mt-6 rounded-3xl border border-default bg-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-heading">Recibo de tu pedido</h2>
              <LogoMark decorative className="h-8" />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">Cliente</dt>
                <dd className="font-medium text-heading">{order.customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-muted">Método de pago</dt>
                <dd className="font-medium text-heading">
                  {order.paymentMethod === "usdt" ? "USDT (Binance Pay)" : order.paymentMethod === "paypal" ? "PayPal" : "—"}
                </dd>
              </div>
              {order.confirmedAt && (
                <div>
                  <dt className="text-muted">Fecha</dt>
                  <dd className="font-medium text-heading">
                    {new Date(order.confirmedAt).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
                  </dd>
                </div>
              )}
            </dl>
            <ul className="mt-6 divide-y divide-white/5 border-y border-white/5">
              {order.items.map((item) => (
                <li key={item.cartItemId} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-body">
                    <span className="font-medium text-heading">{item.packageName}</span> · {item.serviceName}
                  </span>
                  <span className="shrink-0 font-medium text-heading">
                    {formatCurrency(item.price)}
                    {item.billing === "mensual" ? "/mes" : ""}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-semibold text-heading">Total</span>
              <span className="font-display text-2xl font-bold text-heading">{formatCurrency(totalDue)} USD</span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Pedido sujeto a validación del pago. {siteConfig.legalName} · {siteConfig.email}
            </p>
          </div>
        )}

        <div className="no-print mt-10 text-center">
          <Button href="/" variant="ghost" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
            Volver al inicio
          </Button>
        </div>
      </Container>
    </section>
  );
}
