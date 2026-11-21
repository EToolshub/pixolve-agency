"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/** Barra inferior fija en móvil con el precio de entrada y acceso a los paquetes. */
export function MobileBuyBar({
  serviceName,
  price,
  monthly,
}: {
  serviceName: string;
  price: number;
  monthly: boolean;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [packagesVisible, setPackagesVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > 520);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const packages = document.getElementById("paquetes");
    let observer: IntersectionObserver | undefined;
    if (packages) {
      observer = new IntersectionObserver(
        ([entry]) => setPackagesVisible(Boolean(entry?.isIntersecting)),
        { threshold: 0.05 }
      );
      observer.observe(packages);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !packagesVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-brand-500/20 bg-ink-900/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_36px_-12px_rgb(0_0_0/0.85)] backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{serviceName}</p>
              <p className="font-display text-lg font-bold text-heading">
                Desde {formatCurrency(price)}
                {monthly && <span className="text-sm font-medium text-muted">/mes</span>}
              </p>
            </div>
            <a
              href="#paquetes"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-ink-950 shadow-[0_8px_24px_-8px_rgb(241_90_35/0.75)] transition-transform active:scale-95"
            >
              Ver paquetes
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
