"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      serviceSlug,
      serviceName,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      billing: pkg.billing,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <Button
      onClick={handleAdd}
      variant={variant}
      fullWidth
      icon={added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
    >
      {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
    </Button>
  );
}
