"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { portfolioItems, type PortfolioItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const categories: ("Todos" | PortfolioItem["category"])[] = ["Todos", "Branding", "UI/UX", "Redes Sociales"];

export function PortfolioGrid() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("Todos");
  const visible = filter === "Todos" ? portfolioItems : portfolioItems.filter((item) => item.category === filter);

  return (
    <>
      <div role="group" aria-label="Filtrar proyectos por categoría" className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => {
          const selected = filter === category;
          const count =
            category === "Todos" ? portfolioItems.length : portfolioItems.filter((i) => i.category === category).length;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(category)}
              className={cn(
                "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                selected ? "text-ink-950" : "text-body ring-1 ring-white/10 hover:text-white hover:ring-white/25"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="portfolio-filter-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-brand-500"
                />
              )}
              <span className="relative">
                {category} <span className={selected ? "text-ink-950/60" : "text-subtle"}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item) => (
            <motion.div
              key={item.behanceUrl}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <PortfolioCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
