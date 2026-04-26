"use client";

import React, { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, setQty, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const formattedSubtotal = useMemo(() => subtotal.toFixed(2), [subtotal]);

  const checkout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Order placement failed");
      
      // Clear cart on success
      clear();
      
      // Redirect to success page with orderId
      window.location.href = `/checkout/success?order_id=${data.orderId}`;
    } catch (err: any) {
      toast.error(err.message || "Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Cart</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{itemCount} item(s)</p>
          </div>
          {items.length ? (
            <Button
              variant="outline"
              onClick={clear}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
            >
              <Trash2 size={18} />
              Clear
            </Button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-3xl bg-amaranth-100 dark:bg-amaranth-900/25 flex items-center justify-center text-amaranth-700">
              <ShoppingCart size={26} />
            </div>
            <p className="mt-4 font-black text-zinc-900 dark:text-white">Your cart is empty</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Browse products and add them to your cart.</p>
            <Button className="mt-6" onClick={() => (window.location.href = "/products")}>
              Shop now
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((i) => (
                <Card key={i.productId} className="p-4 sm:p-5 rounded-4xl">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-amaranth-100 shrink-0">
                      {i.image ? (
                        <Image src={i.image} alt={i.name} fill className="object-cover" />
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-black text-zinc-900 dark:text-white truncate">{i.name}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">₹{Number(i.price).toFixed(2)}</p>

                      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                        <div className="inline-flex items-center gap-2 rounded-3xl border border-white/25 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setQty(i.productId, Math.max(1, i.qty - 1))}
                          >
                            <Minus size={16} />
                          </Button>
                          <Input
                            value={String(i.qty)}
                            inputMode="numeric"
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (Number.isFinite(v)) setQty(i.productId, v);
                            }}
                            className="w-16"
                          />
                          <Button variant="ghost" size="sm" onClick={() => setQty(i.productId, i.qty + 1)}>
                            <Plus size={16} />
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(i.productId)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
                        >
                          <Trash2 size={16} />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 rounded-4xl h-fit">
              <p className="font-black text-zinc-900 dark:text-white">Order summary</p>
              <div className="mt-4 flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
                <span>Subtotal</span>
                <span className="font-black text-zinc-900 dark:text-white">₹{formattedSubtotal}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Free delivery for COD orders.</p>
              <Button className="mt-6 w-full h-12 font-black" onClick={checkout} disabled={loading}>
                <CheckCircle size={18} />
                {loading ? "Placing Order…" : "Place Order (COD)"}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
};

