"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  BellRing,
  Check,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Receipt,
  UserRound,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Field";
import { AuthCard } from "@/components/account/AuthCard";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatDate, safeNextPath, type OrderRow, type Profile } from "@/lib/account";
import { formatCurrency } from "@/lib/utils";

const benefits = [
  { icon: PackageSearch, title: "Sigue tus pedidos", text: "Mira en qué etapa está cada proyecto, sin preguntar por WhatsApp." },
  { icon: Zap, title: "Compra más rápido", text: "Tus datos se completan solos en el checkout." },
  { icon: BellRing, title: "Ofertas primero", text: "Entérate antes que nadie de promociones y lanzamientos." },
];

export function AccountView() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));

  // Tras iniciar sesión, vuelve a la página que la pidió (p. ej. /admin).
  useEffect(() => {
    if (user && next) router.replace(next);
  }, [user, next, router]);

  if (loading || (user && next)) {
    return <Container className="min-h-[70vh] py-16" />;
  }

  if (!user) {
    return (
      <Container className="py-12 sm:py-20">
        {/* Móvil: título → cuadro de registro → beneficios. Escritorio: dos columnas. */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_460px] lg:gap-x-16 lg:gap-y-10">
          <div className="lg:col-start-1 lg:row-start-1 lg:pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">Tu cuenta Pixolve</p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-heading sm:text-5xl">
              Todos tus proyectos, <span className="text-gradient-brand">en un solo lugar</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-body">
              Crea tu cuenta gratis en menos de un minuto. No necesitas tarjeta.
            </p>
          </div>
          <AuthCard initialMode={next ? "ingreso" : "registro"} className="lg:col-start-2 lg:row-span-2 lg:row-start-1" />
          <div className="lg:col-start-1 lg:row-start-2">
            <ul className="space-y-6">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-heading">{title}</span>
                    <span className="mt-0.5 block text-sm text-body">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  // undefined = cargando · null = sin perfil
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]).then(([profileRes, ordersRes]) => {
      if (!active) return;
      if (profileRes.error || ordersRes.error) setLoadError(true);
      setProfile((profileRes.data as Profile | null) ?? null);
      setOrders((ordersRes.data as OrderRow[] | null) ?? []);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const firstName = (profile?.full_name ?? user?.user_metadata?.full_name ?? "").split(" ")[0];

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">Mi cuenta</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            {firstName ? `Hola, ${firstName}` : "Hola"} 👋
          </h1>
          <p className="mt-1.5 break-all text-body">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Button href="/admin" size="sm" icon={<LayoutDashboard className="h-4 w-4" />}>
              Panel de administrador
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={signOut} icon={<LogOut className="h-4 w-4" />}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/[0.07] p-4 text-sm text-red-300">
          No pudimos cargar todos tus datos. Recarga la página en un momento.
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <section aria-labelledby="mis-pedidos" className="min-w-0">
          <h2 id="mis-pedidos" className="flex items-center gap-2 text-lg font-bold text-heading">
            <Receipt className="h-5 w-5 text-brand-400" /> Mis pedidos
          </h2>
          {orders === null ? (
            <div className="mt-4 h-40 animate-pulse rounded-3xl bg-card" />
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-dashed border-default p-8 text-center">
              <ClipboardList className="mx-auto h-8 w-8 text-subtle" />
              <p className="mt-3 font-semibold text-heading">Aún no tienes pedidos</p>
              <p className="mt-1 text-sm text-body">Cuando contrates un servicio con tu sesión iniciada, aparecerá aquí.</p>
              <Button href="/servicios" className="mt-6" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                Ver servicios
              </Button>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="rounded-3xl border border-default bg-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-heading">{order.order_code}</p>
                      <p className="mt-0.5 text-xs text-muted">{formatDate(order.created_at)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm text-body">
                    {order.items.map((item) => (
                      <li key={item.cartItemId} className="flex justify-between gap-4">
                        <span className="min-w-0">
                          {item.packageName} <span className="text-muted">· {item.serviceName}</span>
                        </span>
                        <span className="shrink-0 text-body-strong">
                          {formatCurrency(item.price)}
                          {item.billing === "mensual" && "/mes"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-white/5 pt-3 text-right text-sm text-body">
                    Total <span className="font-semibold text-heading">{formatCurrency(Number(order.total_unico) + Number(order.total_mensual))}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside aria-labelledby="mis-datos">
          <h2 id="mis-datos" className="flex items-center gap-2 text-lg font-bold text-heading">
            <UserRound className="h-5 w-5 text-brand-400" /> Mis datos
          </h2>
          {profile ? (
            <ProfileForm profile={profile} onSaved={setProfile} />
          ) : profile === null ? (
            <p className="mt-4 rounded-3xl border border-default bg-card p-6 text-sm text-body">
              No encontramos tu perfil. Cierra sesión y vuelve a entrar; si sigue igual, escríbenos.
            </p>
          ) : (
            <div className="mt-4 h-64 animate-pulse rounded-3xl bg-card" />
          )}
        </aside>
      </div>
    </Container>
  );
}

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Escribe tu nombre completo").max(80, "Máximo 80 caracteres"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[\d\s()-]{7,20})?$/, "Incluye el código de país, por ejemplo +58 412 123 4567"),
});

type ProfileValues = z.infer<typeof profileSchema>;

function ProfileForm({ profile, onSaved }: { profile: Profile; onSaved: (profile: Profile) => void }) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: profile.full_name ?? "", phone: profile.phone ?? "" },
  });

  async function onSubmit(values: ProfileValues) {
    setStatus("idle");
    const changes = { full_name: values.full_name, phone: values.phone || null };
    const { error } = await supabase.from("profiles").update(changes).eq("id", profile.id);
    if (error) {
      setStatus("error");
      return;
    }
    onSaved({ ...profile, ...changes });
    reset(values);
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-5 rounded-3xl border border-default bg-card p-6">
      <FieldWrapper id="profile-name" label="Nombre completo" error={errors.full_name?.message}>
        <Input id="profile-name" autoComplete="name" invalid={errors.full_name?.message} {...register("full_name")} />
      </FieldWrapper>
      <FieldWrapper id="profile-phone" label="WhatsApp" optional error={errors.phone?.message}>
        <Input id="profile-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+58 412 123 4567" invalid={errors.phone?.message} {...register("phone")} />
      </FieldWrapper>
      <div>
        <p className="mb-2 text-sm font-medium text-body-strong">Correo</p>
        <p className="break-all rounded-2xl border border-input bg-ink-800/30 px-4 py-3.5 text-[15px] text-muted">{profile.email}</p>
      </div>
      <Button type="submit" fullWidth disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </Button>
      {status === "saved" && !isDirty && (
        <p className="flex items-center justify-center gap-1.5 text-sm text-emerald-400">
          <Check className="h-4 w-4" /> Datos guardados
        </p>
      )}
      {status === "error" && <p className="text-center text-sm text-red-400">No se pudo guardar. Intenta de nuevo.</p>}
      <p className="text-center text-xs text-muted">
        ¿Necesitas ayuda? <Link href="/contacto" className="font-semibold text-brand-400 hover:underline">Contáctanos</Link>
      </p>
    </form>
  );
}
