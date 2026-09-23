import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { briefQuestions } from "@/data/briefs";
import { services } from "@/data/services";
import { formatCurrency } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────
// Validación estricta del pedido: límites de tamaño, tipos y precios
// verificados contra el catálogo (el cliente no puede alterar montos).
// ─────────────────────────────────────────────────────────────────────────

const text = (max: number) => z.string().trim().max(max);

const orderSchema = z.object({
  orderId: z.string().regex(/^PIX-\d{6}-[A-Z0-9]{2,8}$/),
  customer: z.object({
    fullName: text(80).min(2),
    email: z.string().trim().email().max(120),
    phone: text(25).min(7),
    company: text(80).optional(),
    country: text(60).min(2),
    notes: text(1000).optional(),
  }),
  items: z
    .array(
      z.object({
        cartItemId: text(80),
        serviceSlug: text(40),
        serviceName: text(80),
        packageId: text(60),
        packageName: text(80),
        price: z.number().nonnegative(),
        billing: z.enum(["unico", "mensual"]),
      })
    )
    .min(1)
    .max(20),
  totalUnico: z.number().nonnegative(),
  totalMensual: z.number().nonnegative(),
  paymentMethod: z.enum(["paypal", "usdt"]).optional(),
  briefs: z.record(z.string().max(40), z.record(z.string().max(40), z.union([text(2000), z.array(text(100)).max(20)]))).optional(),
  confirmedAt: z.string().max(40).optional(),
});

type OrderPayload = z.infer<typeof orderSchema>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Reemplaza nombres y precios por los del catálogo oficial. */
function withCatalogPrices(order: OrderPayload) {
  const items = order.items.map((item) => {
    const service = services.find((s) => s.slug === item.serviceSlug);
    const pkg = service?.packages.find((p) => p.id === item.packageId);
    if (!service || !pkg) return null;
    return { ...item, serviceName: service.name, packageName: pkg.name, price: pkg.price, billing: pkg.billing };
  });
  if (items.some((item) => item === null)) return null;
  const valid = items as OrderPayload["items"];
  return {
    ...order,
    items: valid,
    totalUnico: valid.filter((i) => i.billing === "unico").reduce((sum, i) => sum + i.price, 0),
    totalMensual: valid.filter((i) => i.billing === "mensual").reduce((sum, i) => sum + i.price, 0),
  };
}

function buildEmailHtml(order: OrderPayload, amountMismatch: boolean) {
  const e = escapeHtml;
  const totalDue = order.totalUnico + order.totalMensual;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${e(item.packageName)} (${e(item.serviceName)}) — ${formatCurrency(item.price)}${
          item.billing === "mensual" ? "/mes" : ""
        }</li>`
    )
    .join("");

  const seenServices = new Map<string, string>();
  for (const item of order.items) {
    if (!seenServices.has(item.serviceSlug)) {
      seenServices.set(item.serviceSlug, item.serviceName);
    }
  }

  let briefsHtml = "";
  if (order.briefs) {
    for (const [slug, serviceName] of seenServices) {
      const answers = order.briefs[slug];
      const questions = briefQuestions[slug];
      if (!answers || !questions) continue;

      const rows = questions
        .map((q) => {
          const answer = answers[q.id];
          if (!answer || (Array.isArray(answer) && answer.length === 0)) return "";
          const value = Array.isArray(answer) ? answer.join(", ") : answer;
          return `<li><strong>${e(q.label)}:</strong> ${e(value)}</li>`;
        })
        .filter(Boolean)
        .join("");

      if (rows) {
        briefsHtml += `<h3 style="color:#f15a23;">Briefing — ${e(serviceName)}</h3><ul>${rows}</ul>`;
      }
    }
  }

  const paymentLabel =
    order.paymentMethod === "paypal"
      ? "PayPal"
      : order.paymentMethod === "usdt"
        ? "USDT (Binance Pay)"
        : "Sin especificar";

  const c = order.customer;

  return `
    <div style="font-family: Arial, sans-serif; color: #111110; max-width: 600px;">
      <div style="background:#0b0b0a; padding:20px 24px; border-radius:12px 12px 0 0;">
        <span style="color:#ffffff; font-size:20px; font-weight:bold;">Pixolve <span style="color:#f15a23;">Agency</span></span>
      </div>
      <div style="border:1px solid #eee; border-top:0; padding:24px; border-radius:0 0 12px 12px;">
        <h2 style="margin-top:0;">Nuevo pedido: ${e(order.orderId)}</h2>
        ${
          amountMismatch
            ? `<p style="background:#fff4ee; border:1px solid #f15a23; padding:10px; border-radius:8px;"><strong>Atención:</strong> los montos enviados por el navegador no coincidían con el catálogo. Se muestran los precios oficiales.</p>`
            : ""
        }
        <p><strong>Total:</strong> ${formatCurrency(totalDue)}${
          order.totalMensual > 0 ? " (incluye primer mes de servicio(s) recurrente(s))" : ""
        }</p>
        <p><strong>Método de pago elegido:</strong> ${paymentLabel}</p>

        <h3 style="color:#f15a23;">Servicios contratados</h3>
        <ul>${itemsHtml}</ul>

        <h3 style="color:#f15a23;">Datos del cliente</h3>
        <ul>
          <li><strong>Nombre:</strong> ${e(c.fullName)}</li>
          <li><strong>Correo:</strong> ${e(c.email)}</li>
          <li><strong>Teléfono:</strong> ${e(c.phone)}</li>
          ${c.company ? `<li><strong>Empresa:</strong> ${e(c.company)}</li>` : ""}
          <li><strong>País:</strong> ${e(c.country)}</li>
          ${c.notes ? `<li><strong>Notas:</strong> ${e(c.notes)}</li>` : ""}
        </ul>

        ${briefsHtml}

        <p style="color:#6f6f69; font-size: 12px;">Este correo se generó automáticamente desde el sitio de Pixolve Agency para llevar control de pedidos.</p>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // Solo aceptamos peticiones hechas desde el propio sitio.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ sent: false, reason: "forbidden" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 50_000) {
    return NextResponse.json({ sent: false, reason: "too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ sent: false, reason: "invalid_body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ sent: false, reason: "invalid_order" }, { status: 400 });
  }

  const order = withCatalogPrices(parsed.data);
  if (!order) {
    return NextResponse.json({ sent: false, reason: "unknown_items" }, { status: 400 });
  }
  const amountMismatch =
    order.totalUnico !== parsed.data.totalUnico || order.totalMensual !== parsed.data.totalMensual;

  if (!gmailUser || !gmailPass) {
    console.warn(
      "notify-order: GMAIL_USER/GMAIL_APP_PASSWORD no configurados; se omite el envío de correo."
    );
    return NextResponse.json({ sent: false, reason: "not_configured" }, { status: 200 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `Pixolve Agency <${gmailUser}>`,
      to: gmailUser,
      replyTo: order.customer.email,
      subject: `Nuevo pedido ${order.orderId} — ${order.customer.fullName.replace(/[\r\n]+/g, " ")}`,
      html: buildEmailHtml(order, amountMismatch),
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("notify-order: fallo al enviar el correo", error);
    return NextResponse.json({ sent: false, reason: "send_failed" }, { status: 200 });
  }
}
