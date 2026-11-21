"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TrustList } from "@/components/checkout/TrustList";
import { getServiceBySlug } from "@/data/services";
import { iconMap } from "@/lib/icon-map";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

/**
 * Resumen del pedido para la columna lateral del checkout. En móvil se
 * muestra plegado (total visible) y se expande al tocarlo.
 */
export function OrderSummary({
  items,
  totalUnico,
  totalMensual,
  orderId,
  children,
  className,
}: {
  items: CartItem[];
  totalUnico: number;
  totalMensual: number;
  orderId?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [openMobile, setOpenMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const totalDue = totalUnico + totalMensual;

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

  const details = (
    <>
      <ul className="space-y-3">
        {items.map((item) => {
          const service = getServiceBySlug(item.serviceSlug);
          const Icon = service ? iconMap[service.icon] : undefined;
          return (
            <li key={item.cartItemId} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                {Icon && <Icon className="h-4.5 w-4.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-heading">{item.packageName}</p>
                <p className="truncate text-xs text-muted">{item.serviceName}</p>
              </div>
              <p className="text-sm font-semibold text-heading">
                {formatCurrency(item.price)}
                {item.billing === "mensual" && <span className="text-xs font-normal text-muted">/mes</span>}
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-5 space-y-2 border-t border-default pt-5 text-sm">
        {totalUnico > 0 && (
          <div className="flex justify-between">
            <dt className="text-body">Pago único</dt>
            <dd className="font-medium text-heading">{formatCurrency(totalUnico)}</dd>
          </div>
        )}
        {totalMensual > 0 && (
          <div className="flex justify-between">
            <dt className="text-body">Primer mes de suscripción</dt>
            <dd className="font-medium text-heading">{formatCurrency(totalMensual)}</dd>
          </div>
        )}
      </dl>
    </>
  );

  return (
    <aside className={cn("h-fit lg:sticky lg:top-28", className)}>
      <div className="overflow-hidden rounded-3xl border border-default bg-card">
        {/* Encabezado plegable en móvil */}
        <button
          type="button"
          onClick={() => setOpenMobile((v) => !v)}
          aria-expanded={openMobile}
          className="flex w-full items-center justify-between px-6 py-5 text-left lg:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-heading">
            {openMobile ? "Ocultar" : "Ver"} resumen ({items.length})
            <ChevronDown className={cn("h-4 w-4 transition-transform", openMobile && "rotate-180")} />
          </span>
          <span className="font-display text-lg font-bold text-heading">{formatCurrency(totalDue)}</span>
        </button>
        <AnimatePresence initial={false}>
          {openMobile && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="border-t border-default px-6 py-5">
                {orderId && (
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">Pedido</span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-body-strong ring-1 ring-white/10 transition-colors hover:text-white"
                      aria-label={`Copiar número de pedido ${orderId}`}
                    >
                      {orderId}
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                )}
                {details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden p-6 lg:block">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-heading">Resumen del pedido</h2>
            {orderId && (
              <button
                type="button"
                onClick={copyOrderId}
                className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-body-strong ring-1 ring-white/10 transition-colors hover:text-white"
                aria-label={`Copiar número de pedido ${orderId}`}
              >
                {orderId}
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            )}
          </div>
          <div className="mt-5">{details}</div>
        </div>

        <div className="border-t border-default bg-white/[0.02] px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-heading">Total a pagar hoy</span>
            <span className="font-display text-3xl font-extrabold tracking-tight text-heading">
              {formatCurrency(totalDue)}
              <span className="ml-1 text-xs font-medium text-muted">USD</span>
            </span>
          </div>
          {totalMensual > 0 && (
            <p className="mt-1.5 text-xs text-muted">
              Luego {formatCurrency(totalMensual)}/mes. Cancela cuando quieras.
            </p>
          )}
          {children}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-default p-5 lg:mt-5 lg:p-6">
        <div className="lg:hidden">
          <TrustList compact />
        </div>
        <div className="hidden lg:block">
          <TrustList />
        </div>
      </div>
    </aside>
  );
}
