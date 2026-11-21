"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, CheckCircle2, Copy, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { buildWhatsAppLink } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { services } from "@/data/services";

const schema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo").max(80),
  email: z.string().trim().email("Escribe un correo válido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Incluye el código de país, por ejemplo +58 412 123 4567"),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().trim().min(10, "Cuéntanos un poco más sobre tu proyecto").max(1500),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

const serviceOptions = [...services.map((service) => service.name), "Aún no lo sé / necesito orientación"];

export function ContactForm() {
  const [submitted, setSubmitted] = useState<{ href: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  function onSubmit(data: FormValues) {
    const message = [
      `Hola Pixolve Agency 👋, quiero más información.`,
      `Nombre: ${data.fullName}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone}`,
      `Servicio de interés: ${data.service}`,
      `Mensaje: ${data.message}`,
    ].join("\n");

    // Respaldo silencioso por correo para no perder leads si el navegador móvil bloquea WhatsApp.
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {});

    const href = buildWhatsAppLink(siteConfig.whatsapp.phoneDigitsOnly, message);
    setSubmitted({ href, text: message });
    window.open(href, "_blank", "noopener,noreferrer");
    reset();
  }

  function handleCopyMessage() {
    if (!submitted) return;
    navigator.clipboard
      .writeText(submitted.text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  const ok = (field: keyof FormValues) => Boolean(dirtyFields[field]) && !errors[field];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Campo honeypot invisible para frenar spam automatizado */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
        {...register("website")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper id="c-fullName" label="Nombre completo" required error={errors.fullName?.message} valid={ok("fullName")}>
          <Input id="c-fullName" autoComplete="name" placeholder="Tu nombre" invalid={errors.fullName?.message} valid={ok("fullName")} {...register("fullName")} />
        </FieldWrapper>
        <FieldWrapper id="c-email" label="Correo electrónico" required error={errors.email?.message} valid={ok("email")}>
          <Input id="c-email" type="email" inputMode="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" invalid={errors.email?.message} valid={ok("email")} {...register("email")} />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper id="c-phone" label="Teléfono / WhatsApp" required error={errors.phone?.message} valid={ok("phone")}>
          <Input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+58 412 123 4567" invalid={errors.phone?.message} valid={ok("phone")} {...register("phone")} />
        </FieldWrapper>
        <FieldWrapper id="c-service" label="Servicio de interés" required error={errors.service?.message}>
          <Select id="c-service" defaultValue="" invalid={errors.service?.message} {...register("service")}>
            <option value="" disabled>
              Selecciona una opción
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      </div>

      <FieldWrapper id="c-message" label="Cuéntanos sobre tu proyecto" required error={errors.message?.message} valid={ok("message")}>
        <Textarea id="c-message" rows={5} placeholder="Describe brevemente lo que necesitas, tus plazos y tu presupuesto aproximado…" invalid={errors.message?.message} valid={ok("message")} {...register("message")} />
      </FieldWrapper>

      <Button type="submit" fullWidth size="lg" disabled={isSubmitting} icon={<Send className="h-4 w-4" />}>
        {isSubmitting ? "Enviando..." : "Enviar consulta por WhatsApp"}
      </Button>

      {submitted && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300"
        >
          <p className="flex items-start gap-2 font-medium">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Registramos tu consulta y abrimos WhatsApp. Si tu navegador bloqueó la ventana emergente, usa el botón de abajo:
            </span>
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              href={submitted.href}
              variant="whatsapp"
              size="sm"
              className="w-full sm:w-auto"
              icon={<MessageCircle className="h-4 w-4" />}
            >
              Abrir WhatsApp ahora
            </Button>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold text-heading transition-colors hover:bg-white/10 sm:w-auto"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Mensaje copiado" : "Copiar mensaje"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
