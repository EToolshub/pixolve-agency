import Link from "next/link";
import { BadgeCheck, Lock, MessageCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: Lock,
    title: "Conexión cifrada (HTTPS)",
    description: "Tus datos viajan protegidos. Nunca pedimos datos de tarjeta.",
  },
  {
    icon: BadgeCheck,
    title: "Pago verificado por personas",
    description: "Validamos tu comprobante en menos de 24 h hábiles.",
  },
  {
    icon: RotateCcw,
    title: "Política de reembolso clara",
    description: "Condiciones por escrito antes de empezar.",
    href: "/reembolsos",
  },
  {
    icon: MessageCircle,
    title: "Soporte humano por WhatsApp",
    description: "Antes, durante y después de tu compra.",
  },
];

export function TrustList({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn("space-y-3.5", className)}>
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
            <item.icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-heading">
              {item.href ? (
                <Link href={item.href} target="_blank" className="underline-offset-4 hover:underline">
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </p>
            {!compact && <p className="text-xs leading-relaxed text-muted">{item.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
