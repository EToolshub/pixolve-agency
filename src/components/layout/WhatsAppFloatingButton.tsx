import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/utils";

export function WhatsAppFloatingButton() {
  const href = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    siteConfig.whatsapp.defaultMessage
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition-transform hover:scale-110 active:scale-95 sm:bottom-8 sm:right-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40 group-hover:opacity-0" />
      <MessageCircle className="relative h-7 w-7" fill="white" strokeWidth={0} />
    </a>
  );
}
