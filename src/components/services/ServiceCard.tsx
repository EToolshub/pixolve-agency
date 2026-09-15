import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { iconMap } from "@/lib/icon-map";
import { formatCurrency } from "@/lib/utils";
import { getStartingPrice } from "@/data/services";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = iconMap[service.icon];
  const startingPrice = getStartingPrice(service);
  const startingBilling = service.packages.find(
    (pkg) => pkg.price === startingPrice
  )?.billing;

  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group relative flex flex-col rounded-2xl border border-default bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/10"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400">
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <h3 className="mt-5 text-lg font-bold text-heading">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
        {service.shortDescription}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-subtle pt-4">
        <span className="text-sm text-muted">
          Desde{" "}
          <span className="font-bold text-heading">
            {formatCurrency(startingPrice)}
          </span>
          {startingBilling === "mensual" ? "/mes" : ""}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-blue-600">
          Ver más
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
