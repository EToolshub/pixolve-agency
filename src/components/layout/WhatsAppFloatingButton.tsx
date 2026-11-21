"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink, cn } from "@/lib/utils";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const href = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    siteConfig.whatsapp.defaultMessage
  );
  // En las páginas de servicio hay una barra fija inferior en móvil: subimos el botón.
  const raised = pathname.startsWith("/servicios/");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={cn(
        "no-print group fixed right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-whatsapp pl-4 pr-4 text-ink-950 shadow-[0_10px_40px_-8px_rgb(37_211_102/0.55)] transition-all duration-300 hover:pr-5 active:scale-95 sm:right-6 lg:right-8",
        raised
          ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] lg:bottom-8"
          : "bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:bottom-8"
      )}
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp group-hover:hidden" />
      <MessageCircle className="relative h-6 w-6" fill="currentColor" strokeWidth={0} />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-40 sm:inline">
        ¿Hablamos?
      </span>
    </a>
  );
}
