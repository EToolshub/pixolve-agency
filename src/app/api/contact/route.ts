import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16_000;

const ipBuckets = new Map<string, number[]>();

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(7).max(25),
  service: z.string().trim().min(1).max(120),
  message: z.string().trim().min(10).max(1500),
  /** Campo trampa invisible para bots: debe llegar vacío. */
  website: z.string().max(0).optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipBuckets.get(ip) ?? []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX_REQUESTS) {
    ipBuckets.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipBuckets.set(ip, hits);
  return false;
}

function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) return false;
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return process.env.NODE_ENV !== "production";
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

function jsonNoStore(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonNoStore({ sent: false, reason: "forbidden" }, 403);
  }

  if (isRateLimited(getClientIp(request))) {
    return jsonNoStore({ sent: false, reason: "rate_limited" }, 429);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonNoStore({ sent: false, reason: "invalid_body" }, 400);
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return jsonNoStore({ sent: false, reason: "too_large" }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonNoStore({ sent: false, reason: "invalid_body" }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonNoStore({ sent: false, reason: "invalid_contact" }, 400);
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return jsonNoStore({ sent: false, reason: "not_configured" });
  }

  const d = parsed.data;
  const e = escapeHtml;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `Pixolve Agency <${gmailUser}>`,
      to: gmailUser,
      replyTo: d.email,
      subject: `Nueva consulta web (${d.service.replace(/[\r\n]+/g, " ")}) — ${d.fullName.replace(/[\r\n]+/g, " ")}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111110; max-width: 600px;">
          <div style="background:#0b0b0a; padding:20px 24px; border-radius:12px 12px 0 0;">
            <span style="color:#ffffff; font-size:20px; font-weight:bold;">Pixolve <span style="color:#f15a23;">Agency</span></span>
          </div>
          <div style="border:1px solid #eee; border-top:0; padding:24px; border-radius:0 0 12px 12px;">
            <h2 style="margin-top:0;">Nueva consulta desde /contacto</h2>
            <ul>
              <li><strong>Nombre:</strong> ${e(d.fullName)}</li>
              <li><strong>Correo:</strong> ${e(d.email)}</li>
              <li><strong>Teléfono / WhatsApp:</strong> ${e(d.phone)}</li>
              <li><strong>Servicio de interés:</strong> ${e(d.service)}</li>
            </ul>
            <h3 style="color:#f15a23;">Mensaje</h3>
            <p style="white-space:pre-line; background:#f8f8f7; padding:14px; border-radius:8px;">${e(d.message)}</p>
          </div>
        </div>
      `,
    });

    return jsonNoStore({ sent: true });
  } catch (error) {
    console.error("contact: fallo al enviar correo", error);
    return jsonNoStore({ sent: false, reason: "send_failed" });
  }
}
