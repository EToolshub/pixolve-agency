"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatCurrency, generateOrderId } from "@/lib/utils";
import { savePendingOrder } from "@/lib/order-storage";

const schema = z.object({
  fullName: z.string().min(2, "Escribe tu nombre completo"),
  email: z.string().email("Escribe un correo válido"),
  phone: z.string().min(7, "Escribe un teléfono válido con código de país"),
  company: z.string().optional(),
  country: z.string().min(2, "Escribe tu país"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutView() {
  const router = useRouter();
  const { items, totalUnico, totalMensual, isHydrated } = useCart();

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.replace("/carrito");
    }
  }, [isHydrated, items.length, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormValues) {
    savePendingOrder({
      orderId: generateOrderId(),
      customer: data,
      items,
      totalUnico,
      totalMensual,
    });
    router.push("/checkout/pago");
  }

  if (!isHydrated || items.length === 0) {
    return null;
  }

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Datos de contacto
      </h1>
      <p className="mt-2 text-slate-600">
        Completa tus datos para coordinar el inicio de tu proyecto.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 rounded-2xl border border-slate-200 p-6 sm:p-8 lg:col-span-2"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                {...register("fullName")}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Teléfono / WhatsApp
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+52 55 1234 5678"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Empresa (opcional)
              </label>
              <input
                {...register("company")}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              País
            </label>
            <input
              {...register("country")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.country && (
              <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notas adicionales (opcional)
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Cuéntanos algo importante sobre tu proyecto..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Continuar a método de pago
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            No solicitamos datos de tarjetas ni información financiera en este
            formulario.
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="font-bold text-slate-900">Resumen del pedido</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.cartItemId} className="text-sm">
                <p className="font-semibold text-slate-800">
                  {item.packageName}
                </p>
                <p className="text-slate-500">
                  {item.serviceName} ·{" "}
                  {formatCurrency(item.price)}
                  {item.billing === "mensual" ? "/mes" : ""}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-slate-200 pt-4 text-sm">
            {totalUnico > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Pago único</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totalUnico)}
                </span>
              </div>
            )}
            {totalMensual > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Mensual</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totalMensual)}/mes
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
