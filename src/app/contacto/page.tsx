import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto | Cotiza tu Proyecto de Diseño o Desarrollo Web",
  description:
    "Escríbenos por WhatsApp o completa el formulario de contacto para cotizar diseño gráfico, UI/UX, redes sociales o desarrollo web. Te respondemos a la brevedad.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    siteConfig.whatsapp.defaultMessage
  );

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de"
        highlight="tu proyecto"
        description="Completa el formulario o escríbenos directamente por WhatsApp. Normalmente respondemos en menos de un día hábil."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-3xl border border-default bg-card p-6 sm:p-8 lg:col-span-3">
              <h2 className="text-xl font-bold text-heading">Envíanos un mensaje</h2>
              <p className="mt-1.5 text-sm text-body">
                Al enviarlo se abrirá WhatsApp con tu mensaje listo para mandar.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-3xl border border-whatsapp/30 bg-whatsapp/[0.06] p-6 transition-all hover:-translate-y-0.5 hover:border-whatsapp/60"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-whatsapp text-ink-950">
                    <MessageCircle className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-whatsapp transition-transform group-hover:rotate-45" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-heading">WhatsApp · Respuesta rápida</h3>
                <p className="mt-1 text-sm text-body">{siteConfig.whatsapp.displayNumber}</p>
              </a>

              <div className="rounded-3xl border border-default bg-card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/25">
                  <Mail className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-heading">Correo</h3>
                <a href={`mailto:${siteConfig.email}`} className="mt-1 block break-all text-sm text-body transition-colors hover:text-brand-400">
                  {siteConfig.email}
                </a>
              </div>

              <div className="rounded-3xl border border-default bg-card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/25">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-heading">Horario de atención</h3>
                <p className="mt-1 text-sm text-body">{siteConfig.businessHours}</p>
                <p className="mt-1 text-xs text-muted">{siteConfig.location}</p>
              </div>

              <Button href="/preguntas-frecuentes" variant="secondary" fullWidth>
                Ver preguntas frecuentes
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
