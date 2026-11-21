import { Check, Clock, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/services/AddToCartButton";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { ServicePackage } from "@/lib/types";

export function PackageCard({
  pkg,
  serviceSlug,
  serviceName,
}: {
  pkg: ServicePackage;
  serviceSlug: string;
  serviceName: string;
}) {
  return (
    <div className={cn("relative h-full", pkg.highlighted && "mt-3 md:mt-0 lg:-my-4")}>
      {pkg.highlighted && (
        <div
          aria-hidden
          className="absolute -inset-px rounded-[1.6rem] bg-gradient-to-b from-brand-400 via-brand-500/45 to-brand-500/10"
        />
      )}
      <SpotlightCard
        className={cn(
          "relative flex h-full flex-col p-6 sm:p-8",
          pkg.highlighted
            ? "rounded-[1.55rem] border-transparent bg-gradient-to-b from-brand-500/[0.08] via-ink-900 to-ink-900"
            : "hover:-translate-y-1"
        )}
      >
        {pkg.highlighted && (
          <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-500 px-3.5 py-1 text-xs font-bold text-ink-950 shadow-[0_8px_24px_-6px_rgb(241_90_35/0.7)]">
            <Star className="h-3 w-3" fill="currentColor" />
            Más elegido
          </span>
        )}

        <h3 className="text-xl font-bold text-heading">{pkg.name}</h3>
        <p className="mt-1.5 min-h-10 text-sm text-body">{pkg.tagline}</p>

        <div className="mt-6 flex items-baseline gap-1.5">
          <span className="font-display text-5xl font-extrabold tracking-tight text-heading">
            {formatCurrency(pkg.price)}
          </span>
          <span className="text-sm font-medium text-muted">
            {pkg.billing === "mensual" ? "USD/mes" : "USD · pago único"}
          </span>
        </div>
        {pkg.deliveryTime ? (
          <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-body-strong ring-1 ring-white/10">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            Entrega: {pkg.deliveryTime}
          </p>
        ) : (
          <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-body-strong ring-1 ring-white/10">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            Suscripción mensual · cancela cuando quieras
          </p>
        )}

        <div className="my-7 h-px bg-gradient-to-r from-white/10 via-white/10 to-transparent" />

        <ul className="flex-1 space-y-3.5">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-body-strong">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <AddToCartButton
            serviceSlug={serviceSlug}
            serviceName={serviceName}
            pkg={pkg}
            variant={pkg.highlighted ? "primary" : "secondary"}
          />
        </div>
      </SpotlightCard>
    </div>
  );
}
