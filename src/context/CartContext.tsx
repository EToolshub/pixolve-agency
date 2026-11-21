"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";
import { services } from "@/data/services";

/** Sincroniza los ítems guardados con el catálogo actual (precios y nombres oficiales). */
function reconcileWithCatalog(saved: CartItem[]): CartItem[] {
  return saved.flatMap((item) => {
    const service = services.find((s) => s.slug === item.serviceSlug);
    const pkg = service?.packages.find((p) => p.id === item.packageId);
    if (!service || !pkg) return [];
    return [{ ...item, serviceName: service.name, packageName: pkg.name, price: pkg.price, billing: pkg.billing }];
  });
}

const STORAGE_KEY = "pixolve-cart";

type CartContextValue = {
  items: CartItem[];
  /** Devuelve `false` si ese paquete ya estaba en el carrito. */
  addItem: (item: Omit<CartItem, "cartItemId">) => boolean;
  removeItem: (cartItemId: string) => void;
  restoreItem: (item: CartItem, index: number) => void;
  clearCart: () => void;
  hasPackage: (packageId: string) => boolean;
  totalUnico: number;
  totalMensual: number;
  count: number;
  isHydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Hidratamos desde localStorage tras el montaje (no existe en el servidor),
    // por lo que un set-state inicial aquí es intencional y seguro.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(reconcileWithCatalog(JSON.parse(raw)));
      }
    } catch {
      // localStorage no disponible o datos corruptos: seguimos con carrito vacío
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignoramos errores de almacenamiento (modo privado, cuota excedida, etc.)
    }
  }, [items, isHydrated]);

  const hasPackage = useCallback(
    (packageId: string) => items.some((item) => item.packageId === packageId),
    [items]
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "cartItemId">) => {
      if (items.some((existing) => existing.packageId === item.packageId)) {
        return false;
      }
      setItems((prev) => [...prev, { ...item, cartItemId: `${item.packageId}-${Date.now()}` }]);
      return true;
    },
    [items]
  );

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const restoreItem = useCallback((item: CartItem, index: number) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.cartItemId === item.cartItemId)) return prev;
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, item);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalUnico = useMemo(
    () =>
      items
        .filter((item) => item.billing === "unico")
        .reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const totalMensual = useMemo(
    () =>
      items
        .filter((item) => item.billing === "mensual")
        .reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      restoreItem,
      clearCart,
      hasPackage,
      totalUnico,
      totalMensual,
      count: items.length,
      isHydrated,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addItem,
      removeItem,
      restoreItem,
      clearCart,
      hasPackage,
      totalUnico,
      totalMensual,
      isHydrated,
      isOpen,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}
