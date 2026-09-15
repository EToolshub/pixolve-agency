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

const STORAGE_KEY = "pixolve-cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalUnico: number;
  totalMensual: number;
  count: number;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hidratamos desde localStorage tras el montaje (no existe en el servidor),
    // por lo que un set-state inicial aquí es intencional y seguro.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(raw));
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

  const addItem = useCallback((item: Omit<CartItem, "cartItemId">) => {
    setItems((prev) => [
      ...prev,
      { ...item, cartItemId: `${item.packageId}-${Date.now()}` },
    ]);
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

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

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clearCart,
    totalUnico,
    totalMensual,
    count: items.length,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}
