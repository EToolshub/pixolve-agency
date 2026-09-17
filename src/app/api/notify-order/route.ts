import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { briefQuestions } from "@/data/briefs";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, CustomerInfo, PaymentMethod, ServiceBriefAnswers } from "@/lib/types";

type OrderPayload = {
  orderId: string;
  customer: CustomerInfo;
  items: CartItem[];
  totalUnico: number;
  totalMensual: number;
  paymentMethod?: PaymentMethod;
  briefs?: Record<string, ServiceBriefAnswers>;
};

function buildEmailHtml(order: OrderPayload) {
  const totalDue = order.totalUnico + order.totalMensual;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.packageName} (${item.serviceName}) — ${formatCurrency(item.price)}${
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
          const text = Array.isArray(answer) ? answer.join(", ") : answer;
          return `<li><strong>${q.label}:</strong> ${text}</li>`;
        })
        .filter(Boolean)
        .join("");

      if (rows) {
        briefsHtml += `<h3>Briefing — ${serviceName}</h3><ul>${rows}</ul>`;
      }
    }
  }

  const paymentLabel =
    order.paymentMethod === "paypal"
      ? "PayPal"
      : order.paymentMethod === "usdt"
        ? "USDT (Binance Pay)"
        : "Sin especificar";

  return `
    <div style="font-family: sans-serif; color: #0f172a; max-width: 600px;">
      <h2>Nuevo pedido: ${order.orderId}</h2>
      <p><strong>Total:</strong> ${formatCurrency(totalDue)}${
        order.totalMensual > 0 ? " (incluye primer mes de servicio(s) recurrente(s))" : ""
      }</p>
      <p><strong>Método de pago elegido:</strong> ${paymentLabel}</p>

      <h3>Servicios contratados</h3>
      <ul>${itemsHtml}</ul>

      <h3>Datos del cliente</h3>
      <ul>
        <li><strong>Nombre:</strong> ${order.customer.fullName}</li>
        <li><strong>Correo:</strong> ${order.customer.email}</li>
        <li><strong>Teléfono:</strong> ${order.customer.phone}</li>
        ${order.customer.company ? `<li><strong>Empresa:</strong> ${order.customer.company}</li>` : ""}
        <li><strong>País:</strong> ${order.customer.country}</li>
        ${order.customer.notes ? `<li><strong>Notas:</strong> ${order.customer.notes}</li>` : ""}
      </ul>

      ${briefsHtml}

      <p style="color:#64748b; font-size: 12px;">Este correo se generó automáticamente desde el sitio de Pixolve Agency para llevar control de pedidos.</p>
    </div>
  `;
}

export async function POST(request: Request) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn(
      "notify-order: GMAIL_USER/GMAIL_APP_PASSWORD no configurados; se omite el envío de correo."
    );
    return NextResponse.json({ sent: false, reason: "not_configured" }, { status: 200 });
  }

  let order: OrderPayload;
  try {
    order = await request.json();
  } catch {
    return NextResponse.json({ sent: false, reason: "invalid_body" }, { status: 400 });
  }

  if (!order?.orderId || !order?.customer || !Array.isArray(order.items)) {
    return NextResponse.json({ sent: false, reason: "invalid_order" }, { status: 400 });
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
      subject: `Nuevo pedido ${order.orderId} — ${order.customer.fullName}`,
      html: buildEmailHtml(order),
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("notify-order: fallo al enviar el correo", error);
    return NextResponse.json({ sent: false, reason: "send_failed" }, { status: 200 });
  }
}
