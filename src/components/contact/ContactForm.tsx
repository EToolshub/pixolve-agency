"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/utils";
import { siteConfig } from "@/data/site";

const schema = z.object({
  fullName: z.string().min(2, "Escribe tu nombre completo"),
  email: z.string().email("Escribe un correo válido"),
  phone: z.string().min(7, "Escribe un teléfono válido"),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().min(10, "Cuéntanos un poco más sobre tu proyecto"),
});

type FormValues = z.infer<typeof schema>;

const serviceOptions = [
  "Diseño gráfico",
  "Manejo de redes sociales",
  "Diseño UI/UX",
  "Creación de páginas web",
  "Hosting y mantenimiento",
  "Aún no lo sé / necesito orientación",
];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-body-strong">
            Nombre completo
          </label>
          <input
            {...register("fullName")}
            type="text"
            className="w-full rounded-xl border border-input px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Tu nombre"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-body-strong">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-xl border border-input px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-body-strong">
            Teléfono / WhatsApp
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full rounded-xl border border-input px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="+52 55 1234 5678"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-body-strong">
            Servicio de interés
          </label>
          <select
            {...register("service")}
            defaultValue=""
            className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-xs text-red-600">{errors.service.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-body-strong">
          Cuéntanos sobre tu proyecto
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full rounded-xl border border-input px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Describe brevemente lo que necesitas..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" fullWidth icon={<Send className="h-4 w-4" />}>
        Enviar por WhatsApp
      </Button>

      {isSubmitSuccessful && (
        <p className="text-center text-sm font-medium text-emerald-600">
          Abrimos WhatsApp con tu mensaje. Si no se abrió, escríbenos
          directamente al {siteConfig.whatsapp.displayNumber}.
        </p>
      )}
    </form>
  );
}
