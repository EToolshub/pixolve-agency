"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const { items, removeItem, clearCart, totalUnico, totalMensual, isHydrated } =
    useCart();

  if (!isHydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-alt-2">
          <ShoppingBag className="h-7 w-7 text-subtle" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-heading">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-body">
          Explora nuestros servicios y agrega el paquete que necesitas.
        </p>
        <div className="mt-6">
          <Button href="/servicios">Ver servicios</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-heading">
        Tu carrito
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center justify-between gap-4 rounded-2xl border border-default p-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {item.serviceName}
                </p>
                <p className="mt-1 font-bold text-heading">
                  {item.packageName}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatCurrency(item.price)}
                  {item.billing === "mensual" ? "/mes" : " · pago único"}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.cartItemId)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Quitar ${item.packageName}`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm font-medium text-muted hover:text-red-600"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="h-fit rounded-2xl border border-default bg-alt p-6">
          <h2 className="font-bold text-heading">Resumen del pedido</h2>

          <div className="mt-4 space-y-2 text-sm">
            {totalUnico > 0 && (
              <div className="flex justify-between text-body">
                <span>Pago único</span>
                <span className="font-semibold text-heading">
                  {formatCurrency(totalUnico)}
                </span>
              </div>
            )}
            {totalMensual > 0 && (
              <div className="flex justify-between text-body">
                <span>Suscripción mensual</span>
                <span className="font-semibold text-heading">
                  {formatCurrency(totalMensual)}/mes
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-default pt-4">
            <p className="text-xs text-muted">
              El primer cobro incluye el pago único más el primer mes de
              cualquier servicio recurrente.
            </p>
          </div>

          <Button
            href="/checkout"
            fullWidth
            className="mt-6"
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Continuar al checkout
          </Button>

          <Link
            href="/servicios"
            className="mt-4 block text-center text-sm font-medium text-muted hover:text-blue-600"
          >
            Seguir explorando servicios
          </Link>
        </div>
      </div>
    </Container>
  );
}
