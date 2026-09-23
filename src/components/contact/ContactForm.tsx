"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send } from "lucide-react";
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
});

type FormValues = z.infer<typeof schema>;

const serviceOptions = [...services.map((service) => service.name), "Aún no lo sé / necesito orientación"];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, dirtyFields },
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

    const href = buildWhatsAppLink(siteConfig.whatsapp.phoneDigitsOnly, message);
    window.open(href, "_blank", "noopener,noreferrer");
    reset();
  }

  const ok = (field: keyof FormValues) => Boolean(dirtyFields[field]) && !errors[field];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

      <Button type="submit" fullWidth size="lg" icon={<Send className="h-4 w-4" />}>
        Enviar por WhatsApp
      </Button>

      {isSubmitSuccessful && (
        <p role="status" className="flex items-center justify-center gap-2 text-center text-sm font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Abrimos WhatsApp con tu mensaje. Si no se abrió, escríbenos al {siteConfig.whatsapp.displayNumber}.
        </p>
      )}
    </form>
  );
}
