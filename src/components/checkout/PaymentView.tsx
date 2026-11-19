"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Coins,
  Copy,
  ExternalLink,
  Lock,
  MessageCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { cn, formatCurrency, buildWhatsAppLink } from "@/lib/utils";
import { getPendingOrder, saveOrderToDatabase, savePendingOrder, type PendingOrder } from "@/lib/order-storage";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { siteConfig } from "@/data/site";
import { briefQuestions } from "@/data/briefs";
import type { PaymentMethod } from "@/lib/types";

type CopyField = "binance" | "wallet" | "paypal" | "amount";

const methods: {
  id: PaymentMethod;
  name: string;
  description: string;
  tag: string;
  icon: typeof Wallet;
}[] = [
  {
    id: "paypal",
    name: "PayPal",
    description: "Paga con tu saldo o la tarjeta vinculada a tu cuenta PayPal.",
    tag: "Protección al comprador de PayPal",
    icon: Wallet,
  },
  {
    id: "usdt",
    name: "USDT · Binance Pay",
    description: "Transferencia en criptomoneda estable desde tu app de Binance.",
    tag: "Transacción verificable",
    icon: Coins,
  },
];

export function PaymentView() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [paid, setPaid] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<CopyField | null>(null);

  useEffect(() => {
    const pending = getPendingOrder();
    if (!pending || pending.confirmedAt) {
      router.replace("/carrito");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación desde localStorage al montar
    setOrder(pending);
    if (pending.paymentMethod) setMethod(pending.paymentMethod);
  }, [router]);

  if (!order) return <Container className="min-h-[60vh] py-16" />;

  const totalDue = order.totalUnico + order.totalMensual;
  const canConfirm = Boolean(method) && paid && accepted && !confirmed;

  function handleCopy(field: CopyField, value: string) {
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

  function selectMethod(next: PaymentMethod) {
    setMethod(next);
    setPaid(false);
  }

  function handleConfirm() {
    if (!order || !method || !canConfirm) return;

    const finalOrder: PendingOrder = {
      ...order,
      paymentMethod: method,
      confirmedAt: new Date().toISOString(),
    };
    savePendingOrder(finalOrder);

    // Registro del pedido en Supabase para el panel de administrador (y en
    // "Mi cuenta" si el cliente tiene sesión). No bloquea el checkout si falla.
    saveOrderToDatabase(finalOrder, user?.id ?? null).catch(() => {
      // sin conexión: el pedido sigue llegando por WhatsApp y correo
    });

    // Aviso por correo a la agencia; no bloquea el checkout si falla.
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalOrder),
    }).catch(() => {
      // sin conexión o error de red: el pedido sigue confirmándose por WhatsApp
    });

    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.packageName} (${item.serviceName}) — ${formatCurrency(item.price)}${
            item.billing === "mensual" ? "/mes" : ""
          }`
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
    router.push(`/pedido-confirmado?order=${encodeURIComponent(order.orderId)}`);
  }

  const helpHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    `Hola Pixolve Agency 👋, necesito ayuda para pagar mi pedido ${order.orderId}.`
  );

  return (
    <Container className="py-12 sm:py-16">
      <CheckoutSteps current={3} />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="order-2 lg:order-1">
          <Link href="/checkout/brief" className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Volver al briefing
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">Elige cómo pagar</h1>
          <p className="mt-2 text-body">
            Pedido <span className="font-mono font-semibold text-heading">{order.orderId}</span> · Total{" "}
            <span className="font-semibold text-heading">{formatCurrency(totalDue)} USD</span>
          </p>

          {/* Métodos de pago (radio nativo, accesible con teclado) */}
          <fieldset className="mt-8">
            <legend className="sr-only">Método de pago</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {methods.map((option) => {
                const selected = method === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "relative flex cursor-pointer flex-col rounded-3xl border-2 p-6 transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-400",
                      selected
                        ? "border-brand-500 bg-brand-500/[0.07] shadow-[0_12px_40px_-16px_rgb(241_90_35/0.6)]"
                        : "border-default bg-card hover:border-white/20"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={option.id}
                      checked={selected}
                      onChange={() => selectMethod(option.id)}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                          selected ? "bg-brand-500 text-ink-950" : "bg-white/5 text-brand-400"
                        )}
                      >
                        <option.icon className="h-5 w-5" />
                      </span>
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                          selected ? "border-brand-500 bg-brand-500 text-ink-950" : "border-ink-500"
                        )}
                      >
                        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                    </div>
                    <span className="mt-5 font-display text-lg font-bold text-heading">{option.name}</span>
                    <span className="mt-1 text-sm text-body">{option.description}</span>
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-body-strong ring-1 ring-white/10">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
                      {option.tag}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <AnimatePresence mode="wait">
            {method && (
              <motion.div
                key={method}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 rounded-3xl border border-default bg-card p-6 sm:p-8"
              >
                <h2 className="text-lg font-bold text-heading">
                  {method === "paypal" ? "Cómo pagar con PayPal" : "Cómo pagar con USDT (Binance Pay)"}
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CopyBox
                    label="Monto a enviar"
                    value={method === "paypal" ? `${totalDue} USD` : `${totalDue} USDT`}
                    copied={copiedField === "amount"}
                    onCopy={() => handleCopy("amount", String(totalDue))}
                  />
                  {method === "paypal" ? (
                    <CopyBox
                      label="Correo de PayPal"
                      value={siteConfig.payments.paypal.email}
                      copied={copiedField === "paypal"}
                      onCopy={() => handleCopy("paypal", siteConfig.payments.paypal.email)}
                    />
                  ) : (
                    <CopyBox
                      label="Binance Pay ID"
                      value={siteConfig.payments.usdt.binancePayId}
                      copied={copiedField === "binance"}
                      onCopy={() => handleCopy("binance", siteConfig.payments.usdt.binancePayId)}
                    />
                  )}
                </div>

                <ol className="mt-6 space-y-4">
                  {(method === "paypal"
                    ? [
                        <>Abre PayPal (app o web) y envía <strong className="text-heading">{formatCurrency(totalDue)} USD</strong> al correo de arriba.</>,
                        <>Elige la opción <strong className="text-heading">&quot;Pagar por bienes y servicios&quot;</strong> para contar con la protección al comprador.</>,
                        <>Toma una captura de pantalla del comprobante de pago.</>,
                      ]
                    : [
                        <>Abre tu app de Binance y ve a <strong className="text-heading">Pay → Enviar</strong>.</>,
                        <>Busca el Pay ID de arriba y envía <strong className="text-heading">{totalDue} USDT</strong> (puede variar ligeramente según tu exchange).</>,
                        <>Toma una captura de pantalla del comprobante de la transacción.</>,
                      ]
                  ).map((step, index) => (
                    <li key={index} className="flex gap-3.5 text-sm leading-relaxed text-body">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-300">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>

                {method === "paypal" && siteConfig.payments.paypal.meLink && (
                  <Button
                    href={`${siteConfig.payments.paypal.meLink}/${totalDue}`}
                    variant="secondary"
                    className="mt-6"
                    icon={<ExternalLink className="h-4 w-4" />}
                    iconPosition="right"
                  >
                    Pagar {formatCurrency(totalDue)} con PayPal.Me
                  </Button>
                )}
                {method === "usdt" && siteConfig.payments.usdt.walletAddress && (
                  <p className="mt-5 break-all text-xs text-muted">
                    ¿No usas Binance Pay? También puedes enviar USDT ({siteConfig.payments.usdt.network}) a:{" "}
                    <span className="font-mono text-body-strong">{siteConfig.payments.usdt.walletAddress}</span>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {method && (
            <div className="mt-6 rounded-3xl border border-default bg-card p-6 sm:p-8">
              <h2 className="text-lg font-bold text-heading">Confirma tu pedido</h2>
              <div className="mt-5 space-y-3">
                <CheckRow checked={paid} onChange={setPaid}>
                  Ya envié el pago de <strong className="text-heading">{formatCurrency(totalDue)}</strong> por{" "}
                  {method === "paypal" ? "PayPal" : "Binance Pay"} y tengo mi comprobante.
                </CheckRow>
                <CheckRow checked={accepted} onChange={setAccepted}>
                  Acepto los{" "}
                  <Link href="/terminos" target="_blank" className="font-medium text-brand-400 underline-offset-2 hover:underline">
                    Términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/reembolsos" target="_blank" className="font-medium text-brand-400 underline-offset-2 hover:underline">
                    Política de reembolsos
                  </Link>
                  .
                </CheckRow>
              </div>

              <Button
                onClick={handleConfirm}
                fullWidth
                size="lg"
                variant="whatsapp"
                className="mt-6"
                icon={<MessageCircle className="h-5 w-5" />}
                disabled={!canConfirm}
              >
                Confirmar pedido y enviar comprobante
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                Se abrirá WhatsApp con el resumen de tu pedido para que adjuntes el comprobante.
                Validamos tu pago en menos de 24 horas hábiles.
              </p>
            </div>
          )}

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-1.5 text-center text-sm text-muted">
            <Lock className="h-4 w-4 text-brand-400" />
            Nunca te pediremos datos de tarjeta ni contraseñas. ¿Dudas para pagar?
            <a href={helpHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-400 hover:text-brand-300">
              Escríbenos
            </a>
          </p>
        </div>

        <OrderSummary
          className="order-1 lg:order-2"
          items={order.items}
          totalUnico={order.totalUnico}
          totalMensual={order.totalMensual}
          orderId={order.orderId}
        />
      </div>
    </Container>
  );
}

function CopyBox({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-800/60 p-4">
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 break-all font-mono text-[15px] font-semibold text-heading">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all",
          copied ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-body-strong hover:bg-brand-500 hover:text-ink-950"
        )}
        aria-label={`Copiar ${label}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span aria-live="polite">{copied ? "Copiado" : "Copiar"}</span>
      </button>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-sm leading-relaxed text-body transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-400",
        checked ? "border-brand-500/50 bg-brand-500/[0.06]" : "border-default hover:border-white/20"
      )}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
          checked ? "border-brand-500 bg-brand-500 text-ink-950" : "border-ink-500"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </label>
  );
}
