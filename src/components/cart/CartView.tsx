"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, ShoppingBag, Trash2, Undo2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/context/CartContext";
import { getServiceBySlug, services } from "@/data/services";
import { iconMap } from "@/lib/icon-map";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export function CartView() {
  const { items, removeItem, restoreItem, totalUnico, totalMensual, isHydrated } = useCart();
  const [lastRemoved, setLastRemoved] = useState<{ item: CartItem; index: number } | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);

  if (!isHydrated) {
    return <Container className="min-h-[60vh] py-16" />;
  }

  function handleRemove(item: CartItem, index: number) {
    removeItem(item.cartItemId);
    setLastRemoved({ item, index });
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setLastRemoved(null), 6000);
  }

  function handleUndo() {
    if (!lastRemoved) return;
    restoreItem(lastRemoved.item, lastRemoved.index);
    setLastRemoved(null);
  }

  const inCartSlugs = new Set(items.map((item) => item.serviceSlug));
  const suggestions = services.filter((service) => !inCartSlugs.has(service.slug)).slice(0, 3);

  return (
    <Container className="py-12 sm:py-16">
      <CheckoutSteps current={0} />

      {items.length === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10">
            <ShoppingBag className="h-9 w-9 text-subtle" />
          </div>
          <h1 className="mt-7 text-3xl font-bold text-heading">Tu carrito está vacío</h1>
          <p className="mt-3 text-body">Explora nuestros servicios y agrega el paquete que necesitas.</p>
          {lastRemoved && (
            <button type="button" onClick={handleUndo} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300">
              <Undo2 className="h-4 w-4" /> Deshacer: {lastRemoved.item.packageName}
            </button>
          )}
          <div className="mt-8">
            <Button href="/servicios" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
              Ver servicios
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="mt-10 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Tu carrito <span className="text-subtle">({items.length})</span>
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
            <div>
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => {
                    const service = getServiceBySlug(item.serviceSlug);
                    const Icon = service ? iconMap[service.icon] : undefined;
                    return (
                      <motion.li
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                        className="flex items-center gap-3.5 rounded-3xl border border-default bg-card p-4 sm:gap-4 sm:p-6"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20 sm:h-14 sm:w-14">
                          {Icon && <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/servicios/${item.serviceSlug}`}
                            className="text-xs font-semibold uppercase tracking-wider text-brand-400 hover:text-brand-300"
                          >
                            {item.serviceName}
                          </Link>
                          <p className="mt-0.5 truncate text-base font-bold text-heading sm:text-lg">{item.packageName}</p>
                          <p className="mt-0.5 text-xs text-muted sm:text-sm">
                            {item.billing === "mensual" ? "Suscripción mensual" : "Pago único"}
                          </p>
                          <p className="mt-1.5 font-display text-lg font-bold text-heading sm:hidden">
                            {formatCurrency(item.price)}
                            {item.billing === "mensual" && <span className="text-xs font-medium text-muted">/mes</span>}
                          </p>
                        </div>
                        <p className="hidden font-display text-xl font-bold text-heading sm:block">
                          {formatCurrency(item.price)}
                          {item.billing === "mensual" && <span className="text-sm font-medium text-muted">/mes</span>}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemove(item, index)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-red-500/10 hover:text-red-400"
                          aria-label={`Quitar ${item.packageName}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              <AnimatePresence>
                {lastRemoved && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    role="status"
                    className="mt-3 flex items-center justify-between rounded-2xl bg-white/5 px-5 py-3 text-sm text-body ring-1 ring-white/10"
                  >
                    Quitaste <strong className="font-semibold text-heading">{lastRemoved.item.packageName}</strong>
                    <button type="button" onClick={handleUndo} className="inline-flex items-center gap-1.5 font-semibold text-brand-400 hover:text-brand-300">
                      <Undo2 className="h-4 w-4" /> Deshacer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link href="/servicios" className="mt-4 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-body transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Seguir explorando servicios
              </Link>

              {suggestions.length > 0 && (
                <div className="mt-12">
                  <p className="text-sm font-semibold text-heading">Complementa tu proyecto</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {suggestions.map((service) => {
                      const Icon = iconMap[service.icon];
                      const starting = Math.min(...service.packages.map((p) => p.price));
                      return (
                        <Link
                          key={service.slug}
                          href={`/servicios/${service.slug}`}
                          className="group flex items-center gap-3 rounded-2xl border border-dashed border-white/15 p-4 transition-colors hover:border-brand-500/50 hover:bg-brand-500/5"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-brand-400">
                            {Icon && <Icon className="h-4 w-4" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-heading">{service.shortName}</span>
                            <span className="text-xs text-muted">Desde {formatCurrency(starting)}</span>
                          </span>
                          <Plus className="h-4 w-4 text-subtle transition-colors group-hover:text-brand-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <OrderSummary items={items} totalUnico={totalUnico} totalMensual={totalMensual}>
              <Button
                href="/checkout"
                fullWidth
                size="lg"
                className="mt-5"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                Continuar al checkout
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                Aún no se te cobrará nada. Pagas en el último paso.
              </p>
            </OrderSummary>
          </div>
        </>
      )}
    </Container>
  );
}
