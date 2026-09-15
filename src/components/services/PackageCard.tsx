import { Check, Star } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/services/AddToCartButton";
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
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1",
        pkg.highlighted
          ? "border-blue-600 bg-card shadow-xl shadow-blue-600/15 ring-2 ring-blue-600"
          : "border-default bg-card shadow-sm"
      )}
    >
      {pkg.highlighted && (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
          <Star className="h-3 w-3" fill="white" />
          Más popular
        </span>
      )}

      <h3 className="text-lg font-bold text-heading">{pkg.name}</h3>
      <p className="mt-1 text-sm text-muted">{pkg.tagline}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-heading">
          {formatCurrency(pkg.price)}
        </span>
        {pkg.billing === "mensual" && (
          <span className="text-sm font-medium text-muted">/mes</span>
        )}
      </div>
      {pkg.deliveryTime && (
        <p className="mt-1 text-xs font-medium text-subtle">
          Entrega: {pkg.deliveryTime}
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-body">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <AddToCartButton
          serviceSlug={serviceSlug}
          serviceName={serviceName}
          pkg={pkg}
          variant={pkg.highlighted ? "primary" : "secondary"}
        />
      </div>
    </div>
  );
}
