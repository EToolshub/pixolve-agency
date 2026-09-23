"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import type { ServicePackage } from "@/lib/types";

export function AddToCartButton({
  serviceSlug,
  serviceName,
  pkg,
  variant = "primary",
}: {
  serviceSlug: string;
  serviceName: string;
  pkg: ServicePackage;
  variant?: "primary" | "secondary";
}) {
  const { addItem, hasPackage, openCart, isHydrated } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isHydrated && hasPackage(pkg.id);

  function handleClick() {
    if (inCart) {
      openCart();
      return;
    }
    addItem({
      serviceSlug,
      serviceName,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      billing: pkg.billing,
    });
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
      openCart();
    }, 550);
  }

  const label = justAdded ? "¡Agregado!" : inCart ? "En tu carrito · Ver" : "Agregar al carrito";

  return (
    <Button
      onClick={handleClick}
      variant={inCart && !justAdded ? "secondary" : variant}
      fullWidth
      aria-live="polite"
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={justAdded || inCart ? "check" : "plus"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {justAdded || inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      }
    >
      {label}
    </Button>
  );
}
