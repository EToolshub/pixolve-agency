"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  Download,
  Inbox,
  Lock,
  Mail,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/Field";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  formatDate,
  orderStatuses,
  type OrderRow,
  type OrderStatus,
  type Profile,
  type Subscriber,
} from "@/lib/account";
import { briefQuestions } from "@/data/briefs";
import { services } from "@/data/services";
import { buildWhatsAppLink, cn, formatCurrency } from "@/lib/utils";

type Tab = "pedidos" | "clientes" | "suscriptores";

type Data = {
  orders: OrderRow[];
  profiles: Profile[];
  subscribers: Subscriber[];
};

const PAID_STATUSES: OrderStatus[] = ["pagado", "en_progreso", "entregado"];

const orderTotal = (o: OrderRow) => Number(o.total_unico) + Number(o.total_mensual);

/** Ítems cuyo precio no coincide con el catálogo actual (posible manipulación). */
function catalogMismatches(order: OrderRow) {
  return order.items.filter((item) => {
    const pkg = services.find((s) => s.slug === item.serviceSlug)?.packages.find((p) => p.id === item.packageId);
    return !pkg || pkg.price !== item.price;
  });
}

export function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <Container className="min-h-[70vh] py-16" />;

  if (!user) {
    return (
      <Gate
        icon={<Lock className="h-6 w-6" />}
        title="Panel de administrador"
        text="Inicia sesión con tu cuenta de administrador para continuar."
        action={<Button href="/cuenta?next=/admin">Iniciar sesión</Button>}
      />
    );
  }

  if (!isAdmin) {
    return (
      <Gate
        icon={<ShieldAlert className="h-6 w-6" />}
        title="No tienes acceso"
        text="Esta cuenta no tiene permisos de administrador."
        action={<Button href="/cuenta" variant="secondary">Ir a mi cuenta</Button>}
      />
    );
  }

  return <Panel />;
}

function Gate({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action: React.ReactNode }) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
          {icon}
        </span>
        <h1 className="mt-5 text-2xl font-bold text-heading">{title}</h1>
        <p className="mt-2 text-body">{text}</p>
        <div className="mt-6">{action}</div>
      </div>
    </Container>
  );
}

function Panel() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>("pedidos");

  const load = useCallback(async () => {
    setRefreshing(true);
    const [orders, profiles, subscribers] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("subscribers").select("email, source, created_at").order("created_at", { ascending: false }).limit(5000),
    ]);
    setError(Boolean(orders.error || profiles.error || subscribers.error));
    setData({
      orders: (orders.data as OrderRow[] | null) ?? [],
      profiles: (profiles.data as Profile[] | null) ?? [],
      subscribers: (subscribers.data as Subscriber[] | null) ?? [],
    });
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    load();
  }, [load]);

  const stats = useMemo(() => {
    if (!data) return null;
    const pending = data.orders.filter((o) => o.status === "pendiente");
    const paid = data.orders.filter((o) => PAID_STATUSES.includes(o.status));
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, o) => sum + orderTotal(o), 0),
      revenue: paid.reduce((sum, o) => sum + orderTotal(o), 0),
      paidCount: paid.length,
      clients: data.profiles.length,
      subscribers: data.subscribers.length,
    };
  }, [data]);

  function updateOrder(id: string, changes: Partial<OrderRow>) {
    setData((prev) => prev && { ...prev, orders: prev.orders.map((o) => (o.id === id ? { ...o, ...changes } : o)) });
  }

  function removeOrder(id: string) {
    setData((prev) => prev && { ...prev, orders: prev.orders.filter((o) => o.id !== id) });
  }

  function removeSubscriber(email: string) {
    setData((prev) => prev && { ...prev, subscribers: prev.subscribers.filter((s) => s.email !== email) });
  }

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">Pixolve Agency</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl">Panel de administrador</h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={load}
          disabled={refreshing}
          icon={<RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />}
        >
          Actualizar
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/[0.07] p-4 text-sm text-red-300">
          Algunos datos no cargaron. Revisa tu conexión y pulsa «Actualizar».
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Inbox className="h-4.5 w-4.5" />}
          label="Pagos por verificar"
          value={stats ? String(stats.pendingCount) : "—"}
          detail={stats && stats.pendingCount > 0 ? `${formatCurrency(stats.pendingAmount)} en espera` : "Todo al día"}
          highlight={Boolean(stats && stats.pendingCount > 0)}
        />
        <StatCard
          icon={<Wallet className="h-4.5 w-4.5" />}
          label="Ingresos verificados"
          value={stats ? formatCurrency(stats.revenue) : "—"}
          detail={stats ? `${stats.paidCount} ${stats.paidCount === 1 ? "pedido" : "pedidos"}` : ""}
        />
        <StatCard icon={<Users className="h-4.5 w-4.5" />} label="Clientes registrados" value={stats ? String(stats.clients) : "—"} />
        <StatCard icon={<Mail className="h-4.5 w-4.5" />} label="Suscriptores" value={stats ? String(stats.subscribers) : "—"} />
      </div>

      <div role="tablist" aria-label="Secciones del panel" className="mt-10 flex gap-1 overflow-x-auto border-b border-white/10">
        {(
          [
            { id: "pedidos", label: "Pedidos", count: data?.orders.length },
            { id: "clientes", label: "Clientes", count: data?.profiles.length },
            { id: "suscriptores", label: "Suscriptores", count: data?.subscribers.length },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
              tab === t.id ? "border-brand-500 text-heading" : "border-transparent text-muted hover:text-white"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-body-strong">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {!data ? (
          <div className="h-64 animate-pulse rounded-3xl bg-card" />
        ) : tab === "pedidos" ? (
          <OrdersTab orders={data.orders} onChange={updateOrder} onRemove={removeOrder} />
        ) : tab === "clientes" ? (
          <ClientsTab profiles={data.profiles} orders={data.orders} />
        ) : (
          <SubscribersTab subscribers={data.subscribers} onRemove={removeSubscriber} />
        )}
      </div>
    </Container>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("rounded-3xl border bg-card p-5", highlight ? "border-brand-500/50" : "border-default")}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        <span className={cn(highlight ? "text-brand-400" : "text-subtle")}>{icon}</span>
        {label}
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-heading sm:text-3xl">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted">{detail}</p>}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(inputClasses, "border-input py-2.5 pl-10")}
      />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-3xl border border-dashed border-default p-10 text-center text-sm text-muted">{text}</p>;
}

// ── Pedidos ────────────────────────────────────────────────────────────────

function OrdersTab({
  orders,
  onChange,
  onRemove,
}: {
  orders: OrderRow[];
  onChange: (id: string, changes: Partial<OrderRow>) => void;
  onRemove: (id: string) => void;
}) {
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "todos" || o.status === filter) &&
        (!q || [o.order_code, o.customer_name, o.customer_email, o.customer_phone].some((v) => v.toLowerCase().includes(q)))
    );
  }, [orders, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {[{ id: "todos" as const, label: "Todos" }, ...orderStatuses].map((s) => {
            const count = s.id === "todos" ? orders.length : orders.filter((o) => o.status === s.id).length;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilter(s.id)}
                aria-pressed={filter === s.id}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition-colors",
                  filter === s.id ? "bg-brand-500 text-ink-950 ring-brand-500" : "bg-white/[0.03] text-body ring-white/10 hover:text-white"
                )}
              >
                {s.label} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        <SearchBox value={query} onChange={setQuery} placeholder="Buscar pedido, nombre o correo" />
      </div>

      {visible.length === 0 ? (
        <div className="mt-5">
          <Empty text={orders.length === 0 ? "Todavía no hay pedidos. Aparecerán aquí cuando un cliente confirme su compra." : "Ningún pedido coincide con el filtro."} />
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} onChange={onChange} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onChange,
  onRemove,
}: {
  order: OrderRow;
  onChange: (id: string, changes: Partial<OrderRow>) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const mismatches = catalogMismatches(order);

  async function changeStatus(status: OrderStatus) {
    const previous = order.status;
    setSaving(true);
    setSaveError(false);
    onChange(order.id, { status });
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    setSaving(false);
    if (error) {
      onChange(order.id, { status: previous });
      setSaveError(true);
    }
  }

  async function remove() {
    if (!window.confirm(`¿Eliminar el pedido ${order.order_code}? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", order.id);
    if (error) setSaveError(true);
    else onRemove(order.id);
  }

  const phoneDigits = order.customer_phone.replace(/\D/g, "");
  const whatsappHref = buildWhatsAppLink(
    phoneDigits,
    `Hola ${order.customer_name.split(" ")[0]} 👋, te escribimos de Pixolve Agency sobre tu pedido ${order.order_code}.`
  );

  return (
    <li className={cn("rounded-3xl border bg-card", order.status === "pendiente" ? "border-amber-500/30" : "border-default")}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="group min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-sm font-semibold text-heading">{order.order_code}</span>
            <span className="text-xs text-muted">{formatDate(order.created_at, true)}</span>
            {order.user_id && <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-body-strong ring-1 ring-white/10">Con cuenta</span>}
            {mismatches.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-300 ring-1 ring-red-500/25">
                <AlertTriangle className="h-3 w-3" /> Revisar precios
              </span>
            )}
          </div>
          <p className="mt-1.5 truncate text-[15px] font-semibold text-heading">{order.customer_name}</p>
          <p className="mt-0.5 truncate text-sm text-body">
            {order.items.map((i) => i.packageName).join(" · ")}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-400 group-hover:text-brand-300">
            {open ? "Ocultar detalle" : "Ver detalle"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </span>
        </button>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
          <p className="text-right">
            <span className="block font-display text-xl font-bold tabular-nums text-heading">{formatCurrency(orderTotal(order))}</span>
            <span className="text-xs text-muted">
              {order.payment_method === "paypal" ? "PayPal" : order.payment_method === "usdt" ? "USDT · Binance" : "Sin método"}
            </span>
          </p>
          <label className="sr-only" htmlFor={`status-${order.id}`}>Estado del pedido {order.order_code}</label>
          <select
            id={`status-${order.id}`}
            value={order.status}
            disabled={saving}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            className="h-10 rounded-full border border-white/10 bg-ink-800 px-3.5 text-sm font-semibold text-heading outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:opacity-60"
          >
            {orderStatuses.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {saveError && (
        <p role="alert" className="mx-5 mb-4 rounded-2xl bg-red-500/[0.07] p-3 text-sm text-red-300 sm:mx-6">
          No se pudo guardar el cambio. Intenta de nuevo.
        </p>
      )}

      {open && (
        <div className="grid grid-cols-1 gap-6 border-t border-white/5 p-5 sm:p-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Cliente</h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <Row label="Nombre" value={order.customer_name} />
                <Row label="Correo" value={order.customer_email} />
                <Row label="Teléfono" value={order.customer_phone} />
                {order.customer_company && <Row label="Empresa" value={order.customer_company} />}
                <Row label="País" value={order.customer_country} />
                {order.notes && <Row label="Notas" value={order.notes} />}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {phoneDigits.length >= 7 && (
                  <Button href={whatsappHref} target="_blank" rel="noopener noreferrer" size="sm" variant="whatsapp" icon={<MessageCircle className="h-4 w-4" />}>
                    WhatsApp
                  </Button>
                )}
                <Button href={`mailto:${encodeURIComponent(order.customer_email)}?subject=${encodeURIComponent(`Tu pedido ${order.order_code} — Pixolve Agency`)}`} size="sm" variant="secondary" icon={<Mail className="h-4 w-4" />}>
                  Correo
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Servicios</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {order.items.map((item) => {
                  const wrong = mismatches.includes(item);
                  return (
                    <li key={item.cartItemId} className="flex justify-between gap-4">
                      <span className="text-body">
                        {item.packageName} <span className="text-muted">· {item.serviceName}</span>
                      </span>
                      <span className={cn("shrink-0 tabular-nums", wrong ? "font-semibold text-red-300" : "text-body-strong")}>
                        {formatCurrency(item.price)}
                        {item.billing === "mensual" && "/mes"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {mismatches.length > 0 && (
                <p className="mt-3 flex gap-2 rounded-2xl bg-red-500/[0.07] p-3 text-xs text-red-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Los precios marcados no coinciden con el catálogo actual. Verifica el monto del pago antes de aceptarlo.
                </p>
              )}
            </div>

            <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar pedido
            </button>
          </div>

          <BriefDetails order={order} />
        </div>
      )}
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-body-strong">{value}</dd>
    </div>
  );
}

function BriefDetails({ order }: { order: OrderRow }) {
  const slugs = [...new Set(order.items.map((i) => i.serviceSlug))];
  const sections = slugs
    .map((slug) => {
      const answers = order.briefs?.[slug];
      const questions = briefQuestions[slug];
      if (!answers || !questions) return null;
      const rows = questions
        .map((q) => {
          const answer = answers[q.id];
          if (!answer || (Array.isArray(answer) && answer.length === 0)) return null;
          return { label: q.label, value: Array.isArray(answer) ? answer.join(", ") : answer };
        })
        .filter((r): r is { label: string; value: string } => r !== null);
      if (rows.length === 0) return null;
      const serviceName = order.items.find((i) => i.serviceSlug === slug)?.serviceName ?? slug;
      return { slug, serviceName, rows };
    })
    .filter((s) => s !== null);

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Briefing</h3>
      {sections.length === 0 ? (
        <p className="mt-3 text-sm text-muted">El cliente no llenó el briefing.</p>
      ) : (
        <div className="mt-3 space-y-5">
          {sections.map((section) => (
            <div key={section.slug} className="rounded-2xl border border-white/5 bg-ink-800/40 p-4">
              <p className="text-sm font-semibold text-brand-300">{section.serviceName}</p>
              <dl className="mt-2.5 space-y-2.5 text-sm">
                {section.rows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs text-muted">{row.label}</dt>
                    <dd className="mt-0.5 whitespace-pre-line break-words text-body-strong">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Clientes ───────────────────────────────────────────────────────────────

function ClientsTab({ profiles, orders }: { profiles: Profile[]; orders: OrderRow[] }) {
  const [query, setQuery] = useState("");
  const ordersByUser = useMemo(() => {
    const map = new Map<string, { count: number; spent: number }>();
    for (const o of orders) {
      if (!o.user_id) continue;
      const entry = map.get(o.user_id) ?? { count: 0, spent: 0 };
      entry.count += 1;
      if (PAID_STATUSES.includes(o.status)) entry.spent += orderTotal(o);
      map.set(o.user_id, entry);
    }
    return map;
  }, [orders]);

  const q = query.trim().toLowerCase();
  const visible = profiles.filter(
    (p) => !q || [p.full_name ?? "", p.email, p.phone ?? ""].some((v) => v.toLowerCase().includes(q))
  );

  return (
    <div>
      <div className="flex justify-end">
        <SearchBox value={query} onChange={setQuery} placeholder="Buscar cliente" />
      </div>
      {visible.length === 0 ? (
        <div className="mt-5">
          <Empty text={profiles.length === 0 ? "Aún no hay clientes registrados." : "Ningún cliente coincide con la búsqueda."} />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-3xl border border-default bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/5 text-xs text-muted">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-medium">Cliente</th>
                <th scope="col" className="px-5 py-3.5 font-medium">WhatsApp</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Registro</th>
                <th scope="col" className="px-5 py-3.5 text-right font-medium">Pedidos</th>
                <th scope="col" className="px-5 py-3.5 text-right font-medium">Pagado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visible.map((p) => {
                const stats = ordersByUser.get(p.id);
                return (
                  <tr key={p.id}>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-heading">{p.full_name || "Sin nombre"}</p>
                      <p className="text-xs text-muted">{p.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-body">
                      {p.phone ? (
                        <a
                          href={buildWhatsAppLink(p.phone.replace(/\D/g, ""), `Hola ${(p.full_name ?? "").split(" ")[0]} 👋, te escribimos de Pixolve Agency.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-300"
                        >
                          {p.phone}
                        </a>
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-body">{formatDate(p.created_at)}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-body-strong">{stats?.count ?? 0}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-body-strong">{formatCurrency(stats?.spent ?? 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Suscriptores ───────────────────────────────────────────────────────────

function SubscribersTab({ subscribers, onRemove }: { subscribers: Subscriber[]; onRemove: (email: string) => void }) {
  const [query, setQuery] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const q = query.trim().toLowerCase();
  const visible = subscribers.filter((s) => !q || s.email.toLowerCase().includes(q));

  function exportCsv() {
    const sanitize = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);
    const escape = (v: string) => `"${sanitize(v).replace(/"/g, '""')}"`;
    const rows = [
      ["correo", "origen", "fecha"],
      ...subscribers.map((s) => [s.email, s.source ?? "", s.created_at]),
    ];
    const csv = "﻿" + rows.map((r) => r.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `suscriptores-pixolve-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function remove(email: string) {
    if (!window.confirm(`¿Quitar ${email} de la lista de suscriptores?`)) return;
    setDeleteError(false);
    const { error } = await supabase.from("subscribers").delete().eq("email", email);
    if (error) setDeleteError(true);
    else onRemove(email);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" size="sm" onClick={exportCsv} disabled={subscribers.length === 0} icon={<Download className="h-4 w-4" />}>
          Exportar CSV
        </Button>
        <SearchBox value={query} onChange={setQuery} placeholder="Buscar correo" />
      </div>
      {deleteError && <p role="alert" className="mt-4 text-sm text-red-400">No se pudo quitar el correo. Intenta de nuevo.</p>}
      {visible.length === 0 ? (
        <div className="mt-5">
          <Empty text={subscribers.length === 0 ? "Aún no hay suscriptores." : "Ningún correo coincide con la búsqueda."} />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-3xl border border-default bg-card">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-white/5 text-xs text-muted">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-medium">Correo</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Origen</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Fecha</th>
                <th scope="col" className="px-5 py-3.5"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visible.map((s) => (
                <tr key={s.email}>
                  <td className="break-all px-5 py-3.5 font-medium text-heading">{s.email}</td>
                  <td className="px-5 py-3.5 text-body">{s.source || "—"}</td>
                  <td className="px-5 py-3.5 text-body">{formatDate(s.created_at)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => remove(s.email)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Quitar ${s.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-muted">
        Para enviar una campaña, exporta el CSV e impórtalo en tu herramienta de correo. <Link href="/privacidad" className="text-brand-400 hover:underline">Política de privacidad</Link>
      </p>
    </div>
  );
}
