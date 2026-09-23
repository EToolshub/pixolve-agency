"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { getServiceBySlug } from "@/data/services";
import { iconMap } from "@/lib/icon-map";
import { formatCurrency } from "@/lib/utils";

/** Carrito lateral: se abre al agregar un paquete o desde el ícono del header. */
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, totalUnico, totalMensual } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const totalDue = totalUnico + totalMensual;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="no-print fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-ink-900 shadow-2xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-default px-6 py-5">
              <h2 id="cart-drawer-title" className="flex items-center gap-2 text-lg font-bold text-heading">
                <ShoppingBag className="h-5 w-5 text-brand-400" />
                Tu carrito
                {items.length > 0 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-body-strong">
                    {items.length}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <ShoppingBag className="h-7 w-7 text-subtle" />
                </div>
                <p className="mt-5 font-display text-lg font-semibold text-heading">Tu carrito está vacío</p>
                <p className="mt-1.5 text-sm text-body">
                  Explora los servicios y agrega el paquete que tu marca necesita.
                </p>
                <Button href="/servicios" onClick={closeCart} className="mt-6">
                  Ver servicios
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const service = getServiceBySlug(item.serviceSlug);
                      const Icon = service ? iconMap[service.icon] : undefined;
                      return (
                        <motion.li
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                          className="flex items-center gap-4 rounded-2xl border border-default bg-card p-4"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                            {Icon && <Icon className="h-5 w-5" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-muted">{item.serviceName}</p>
                            <p className="truncate font-semibold text-heading">{item.packageName}</p>
                            <p className="text-sm text-body-strong">
                              {formatCurrency(item.price)}
                              <span className="text-muted">{item.billing === "mensual" ? "/mes" : " · pago único"}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Quitar ${item.packageName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-default bg-ink-950/60 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
                  <div className="space-y-1.5 text-sm">
                    {totalUnico > 0 && (
                      <div className="flex justify-between text-body">
                        <span>Pago único</span>
                        <span className="font-semibold text-heading">{formatCurrency(totalUnico)}</span>
                      </div>
                    )}
                    {totalMensual > 0 && (
                      <div className="flex justify-between text-body">
                        <span>Mensual</span>
                        <span className="font-semibold text-heading">{formatCurrency(totalMensual)}/mes</span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-2">
                      <span className="font-semibold text-heading">Total a pagar hoy</span>
                      <span className="font-display text-2xl font-bold text-heading">
                        {formatCurrency(totalDue)}
                      </span>
                    </div>
                  </div>

                  <Button
                    href="/checkout"
                    onClick={closeCart}
                    fullWidth
                    size="lg"
                    className="mt-5"
                    icon={<ArrowRight className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    Continuar al checkout
                  </Button>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted">
                      <Lock className="h-3.5 w-3.5 text-brand-400" />
                      Checkout seguro · PayPal o USDT
                    </span>
                    <Link href="/carrito" onClick={closeCart} className="font-medium text-body-strong underline-offset-4 hover:text-white hover:underline">
                      Ver carrito
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
