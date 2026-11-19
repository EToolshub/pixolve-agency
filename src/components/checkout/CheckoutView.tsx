"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Lock, UserRound } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/context/CartContext";
import { generateOrderId } from "@/lib/utils";
import { getPendingOrder, savePendingOrder } from "@/lib/order-storage";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const countries = [
  "Argentina",
  "Bolivia",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro",
];

const schema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo").max(80, "Máximo 80 caracteres"),
  email: z.string().trim().email("Escribe un correo válido, por ejemplo nombre@empresa.com"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Incluye el código de país, por ejemplo +58 412 123 4567"),
  company: z.string().trim().max(80).optional(),
  country: z.string().min(2, "Selecciona tu país"),
  notes: z.string().trim().max(1000, "Máximo 1000 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutView() {
  const router = useRouter();
  const { items, totalUnico, totalMensual, isHydrated } = useCart();
  const { user } = useAuth();
  const userId = user?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.replace("/carrito");
    }
  }, [isHydrated, items.length, router]);

  // Si el cliente vuelve atrás, recupera los datos que ya había escrito; si
  // no, y tiene sesión iniciada, completa con los datos de su cuenta.
  useEffect(() => {
    const pending = getPendingOrder();
    if (pending?.customer) {
      reset(pending.customer);
      return;
    }
    if (!userId) return;
    let active = true;
    supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        reset((current) => ({
          ...current,
          fullName: current.fullName || data.full_name || "",
          email: current.email || data.email || "",
          phone: current.phone || data.phone || "",
        }));
      });
    return () => {
      active = false;
    };
  }, [reset, userId]);

  function onSubmit(data: FormValues) {
    const stored = getPendingOrder();
    // Un pedido ya confirmado no se reutiliza: se genera uno nuevo.
    const pending = stored && !stored.confirmedAt ? stored : null;
    savePendingOrder({
      orderId: pending?.orderId ?? generateOrderId(),
      customer: data,
      items,
      totalUnico,
      totalMensual,
      briefs: pending?.briefs,
    });
    router.push("/checkout/brief");
  }

  if (!isHydrated || items.length === 0) {
    return <Container className="min-h-[60vh] py-16" />;
  }

  const ok = (field: keyof FormValues) => Boolean(dirtyFields[field]) && !errors[field];

  return (
    <Container className="py-12 sm:py-16">
      <CheckoutSteps current={1} />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="order-2 lg:order-1">
          <Link href="/carrito" className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Volver al carrito
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">Tus datos de contacto</h1>
          <p className="mt-2 text-body">
            Los usamos solo para coordinar tu proyecto y enviarte la confirmación.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 space-y-6 rounded-3xl border border-default bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-heading">
              <UserRound className="h-4 w-4 text-brand-400" /> Información personal
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrapper id="fullName" label="Nombre completo" required error={errors.fullName?.message} valid={ok("fullName")}>
                <Input id="fullName" autoComplete="name" placeholder="Ana Pérez" invalid={errors.fullName?.message} valid={ok("fullName")} {...register("fullName")} />
              </FieldWrapper>
              <FieldWrapper id="email" label="Correo electrónico" required error={errors.email?.message} valid={ok("email")} hint="Aquí te enviaremos la confirmación.">
                <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="nombre@empresa.com" invalid={errors.email?.message} valid={ok("email")} {...register("email")} />
              </FieldWrapper>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrapper id="phone" label="Teléfono / WhatsApp" required error={errors.phone?.message} valid={ok("phone")} hint="Con código de país. Te escribiremos por aquí.">
                <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+58 412 123 4567" invalid={errors.phone?.message} valid={ok("phone")} {...register("phone")} />
              </FieldWrapper>
              <FieldWrapper id="country" label="País" required error={errors.country?.message}>
                <Select id="country" autoComplete="country-name" defaultValue="" invalid={errors.country?.message} {...register("country")}>
                  <option value="" disabled>
                    Selecciona tu país
                  </option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
              </FieldWrapper>
            </div>

            <FieldWrapper id="company" label="Empresa o marca" optional valid={ok("company")}>
              <Input id="company" autoComplete="organization" placeholder="Nombre de tu negocio" valid={ok("company")} {...register("company")} />
            </FieldWrapper>

            <FieldWrapper id="notes" label="Notas adicionales" optional error={errors.notes?.message}>
              <Textarea id="notes" rows={3} placeholder="Fechas importantes, enlaces de referencia o cualquier detalle que debamos saber…" invalid={errors.notes?.message} {...register("notes")} />
            </FieldWrapper>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Continuar: contarnos tu proyecto
            </Button>

            <p className="text-center text-xs text-muted">
              <Lock className="mr-1 inline h-3.5 w-3.5 -translate-y-px text-brand-400" />
              No solicitamos datos de tarjeta ni información financiera. Lee nuestra{" "}
              <Link href="/privacidad" target="_blank" className="underline underline-offset-2 hover:text-white">
                política de privacidad
              </Link>
              .
            </p>
          </form>
        </div>

        <OrderSummary
          className="order-1 lg:order-2"
          items={items}
          totalUnico={totalUnico}
          totalMensual={totalMensual}
        />
      </div>
    </Container>
  );
}
