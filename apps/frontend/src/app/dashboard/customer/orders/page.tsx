"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { PackageOpen, RefreshCw } from "lucide-react";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load orders");
      setOrders(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Your orders</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Track status and download invoices.</p>
          </div>
          <Button variant="outline" onClick={load}>
            <RefreshCw size={18} />
            Refresh
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 sm:p-8">
            {loading ? (
              <p className="text-sm text-zinc-500">Loading orders…</p>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-14 h-14 rounded-4xl bg-amaranth-100 dark:bg-amaranth-900/25 flex items-center justify-center text-amaranth-700">
                  <PackageOpen size={26} />
                </div>
                <p className="mt-4 font-black text-zinc-900 dark:text-white">No orders yet</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Place your first order from the shop.</p>
                <Button className="mt-6" onClick={() => (window.location.href = "/products")}>
                  Browse products
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-4 rounded-3xl border border-white/25 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-black text-zinc-900 dark:text-white truncate">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        Status: <span className="font-bold text-zinc-900 dark:text-white">{o.status}</span>
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/api/orders/${o.id}/invoice`, "_blank")}
                      disabled={o.status !== "paid" && o.status !== "delivered" && o.status !== "shipped"}
                    >
                      Download invoice
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

