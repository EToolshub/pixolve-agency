"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/data/services";
import type { ServiceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: ("Todos" | ServiceCategory)[] = ["Todos", "Diseño", "Marketing", "Desarrollo"];

/** Catálogo de servicios con filtro por categoría. */
export function ServicesExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const visible = filter === "Todos" ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <div role="group" aria-label="Filtrar servicios por categoría" className="flex flex-wrap justify-center gap-2">
        {filters.map((option) => {
          const count = option === "Todos" ? services.length : services.filter((s) => s.category === option).length;
          const selected = filter === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(option)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                selected ? "text-ink-950" : "text-body ring-1 ring-white/10 hover:text-white hover:ring-white/25"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="services-filter-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-brand-500"
                />
              )}
              <span className="relative">
                {option} <span className={selected ? "text-ink-950/60" : "text-subtle"}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((service) => (
            <motion.div
              key={service.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ServiceCard service={service} featured />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
