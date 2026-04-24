"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  sellerId?: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "nex_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isHydrated]);

  const itemCount = useMemo(() => items.reduce((a, b) => a + (b.qty || 0), 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, b) => a + (b.price || 0) * (b.qty || 0), 0), [items]);

  const addItem: CartContextType["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, qty: Math.min(99, p.qty + qty) } : p,
        );
      }
      return [...prev, { ...item, qty: Math.min(99, qty) }];
    });
    toast.success("Added to cart");
  };

  const removeItem: CartContextType["removeItem"] = (productId) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const setQty: CartContextType["setQty"] = (productId, qty) => {
    const q = Math.max(1, Math.min(99, qty));
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, qty: q } : p)));
  };

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addItem, removeItem, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

