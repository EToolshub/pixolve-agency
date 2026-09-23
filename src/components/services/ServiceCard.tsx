import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Service } from "@/lib/types";
import { iconMap } from "@/lib/icon-map";
import { cn, formatCurrency } from "@/lib/utils";
import { getStartingPackage } from "@/data/services";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function ServiceCard({
  service,
  featured,
  className,
}: {
  service: Service;
  /** Variante grande del bento: muestra también los puntos clave. */
  featured?: boolean;
  className?: string;
}) {
  const Icon = iconMap[service.icon];
  const starting = getStartingPackage(service);

  return (
    <SpotlightCard className={cn("group h-full hover:-translate-y-1", className)}>
      <Link
        href={`/servicios/${service.slug}`}
        className="relative flex h-full flex-col p-7 sm:p-8"
        aria-label={`${service.name}: ver paquetes y precios`}
      >
        <div className="flex items-start justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/25 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-ink-950">
            {Icon && <Icon className="h-6 w-6" />}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-body transition-all duration-300 group-hover:-rotate-45 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-ink-950">
            <ArrowUpRight className="h-4 w-4 rotate-45" />
          </span>
        </div>

        <span className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
          {service.category}
        </span>
        <h3 className={cn("mt-2 font-bold text-heading", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          {service.name}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-body">{service.shortDescription}</p>

        {featured && (
          <ul className="mt-5 space-y-2">
            {service.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2.5 text-sm text-body-strong">
                <Check className="h-4 w-4 shrink-0 text-brand-400" />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <p className="text-sm text-muted">
            Desde
            <span className="block font-display text-2xl font-bold text-heading">
              {formatCurrency(starting.price)}
              {starting.billing === "mensual" && <span className="text-sm font-medium text-muted">/mes</span>}
            </span>
          </p>
          <span className="text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
            Ver paquetes
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
