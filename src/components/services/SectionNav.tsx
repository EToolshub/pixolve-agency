"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Navegación interna fija de la página de servicio; resalta la sección visible. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="no-print sticky top-[5.25rem] z-30 flex justify-center px-3">
      <nav
        aria-label="Secciones del servicio"
        className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-ink-900/85 p-1 shadow-xl backdrop-blur-xl [scrollbar-width:none]"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "relative whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              active === section.id ? "text-ink-950" : "text-body hover:text-white"
            )}
          >
            {active === section.id && (
              <motion.span
                layoutId="section-nav-pill"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                className="absolute inset-0 rounded-full bg-brand-500"
              />
            )}
            <span className="relative">{section.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
