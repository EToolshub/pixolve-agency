import type { Metadata } from "next";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos por WhatsApp o completa el formulario de contacto y te responderemos a la brevedad para ayudarte con tu proyecto.",
};

export default function ContactoPage() {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    siteConfig.whatsapp.defaultMessage
  );

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Contacto"
          title="Hablemos de tu proyecto"
          description="Completa el formulario o escríbenos directamente por WhatsApp. Normalmente respondemos en menos de un día hábil."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <ContactForm />
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">WhatsApp</h3>
              <p className="mt-1 text-sm text-slate-600">
                {siteConfig.whatsapp.displayNumber}
              </p>
              <Button href={whatsappHref} variant="whatsapp" size="sm" className="mt-4">
                Abrir chat
              </Button>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">Correo</h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-1 block text-sm text-slate-600 hover:text-blue-600"
              >
                {siteConfig.email}
              </a>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">Horario de atención</h3>
              <p className="mt-1 text-sm text-slate-600">
                {siteConfig.businessHours}
              </p>
              <p className="mt-1 text-xs text-slate-500">{siteConfig.location}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
