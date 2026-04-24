"use client";

import React from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const { clear } = useCart();

  React.useEffect(() => {
    // Clear cart on success if not already cleared
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadInvoice = () => {
    if (!orderId) return;
    window.open(`/api/orders/${orderId}/invoice`, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="p-8 sm:p-12 text-center rounded-4xl border-white/20 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl shadow-2xl">
        <div className="mx-auto w-20 h-20 rounded-4xl bg-amaranth-100 dark:bg-amaranth-900/25 flex items-center justify-center text-amaranth-700 shadow-inner">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Order Confirmed!</h1>
        <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
          Thank you for your purchase. Your order is being processed for <b>Cash on Delivery</b>.
        </p>
        
        {orderId && (
          <div className="mt-6 p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order ID</p>
            <p className="text-sm font-black text-zinc-900 dark:text-white mt-1">{orderId}</p>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
              onClick={downloadInvoice} 
              variant="outline" 
              className="h-12 px-8 rounded-2xl font-black border-amaranth-200 hover:bg-amaranth-50 dark:border-amaranth-900/40 dark:hover:bg-amaranth-950/20"
              disabled={!orderId}
          >
            <Download size={18} />
            Download Invoice
          </Button>

          <Button onClick={() => (window.location.href = "/products")} className="h-12 px-8 rounded-2xl font-black shadow-lg shadow-amaranth-500/20">
            Continue shopping
            <ArrowRight size={18} />
          </Button>
        </div>

        <button 
          onClick={() => (window.location.href = "/dashboard/customer")}
          className="mt-8 text-sm font-bold text-zinc-500 hover:text-amaranth-600 transition-colors"
        >
          Go to your Dashboard
        </button>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <AppShell>
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </AppShell>
  );
}

