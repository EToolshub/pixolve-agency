import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Carrito", href: "/carrito" },
  { label: "Tus datos", href: "/checkout" },
  { label: "Briefing", href: "/checkout/brief" },
  { label: "Pago", href: "/checkout/pago" },
];

/** Indicador de progreso del checkout. `current` es el índice (0-3) del paso activo. */
export function CheckoutSteps({ current }: { current: number }) {
  return (
    <nav aria-label="Progreso de la compra" className="no-print">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const content = (
            <>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done && "bg-brand-500 text-ink-950",
                  active && "bg-brand-500/15 text-brand-300 ring-2 ring-brand-500",
                  !done && !active && "bg-white/5 text-subtle ring-1 ring-white/10"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  active ? "text-heading" : done ? "text-body-strong" : "text-subtle"
                )}
              >
                {step.label}
              </span>
            </>
          );
          return (
            <li key={step.label} className={cn("flex items-center", index < steps.length - 1 && "flex-1")}>
              {done ? (
                <Link href={step.href} className="-m-1.5 flex items-center gap-2.5 rounded-full p-1.5 hover:opacity-80">
                  {content}
                </Link>
              ) : (
                <span className="flex items-center gap-2.5" aria-current={active ? "step" : undefined}>
                  {content}
                </span>
              )}
              {index < steps.length - 1 && (
                <span className="mx-3 h-px flex-1 overflow-hidden rounded bg-white/10">
                  <span
                    className={cn(
                      "block h-full bg-brand-500 transition-all duration-700",
                      done ? "w-full" : "w-0"
                    )}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-muted sm:hidden">
        Paso {current + 1} de {steps.length}: <span className="text-body-strong">{steps[current]?.label}</span>
      </p>
    </nav>
  );
}
