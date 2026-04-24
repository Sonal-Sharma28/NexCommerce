"use client";

import React from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Package, Heart, CreditCard, ChevronRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { socket } from '@/lib/socket';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>('');

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch("/api/orders/me");
      const data = await res.json();
      
      console.log('API Response:', { status: res.status, data });
      
      if (!res.ok) {
        throw new Error(data?.message || `API Error: ${res.status}`);
      }
      
      if (Array.isArray(data)) {
        console.log('Orders loaded:', data.length);
        setOrders(data);
      } else {
        console.warn('Expected array, got:', data);
        setOrders([]);
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      console.log('User logged in, fetching orders...', user.uid);
      fetchOrders();
    }
  }, [user, fetchOrders]);

  // Real-time order updates via socket
  React.useEffect(() => {
    if (!user) return;

    const handleOrderUpdate = (data: any) => {
      console.log('Customer order update:', data);
      fetchOrders();
    };

    const handleNotification = (data: any) => {
      console.log('Customer notification:', data);
      fetchOrders();
    };

    socket.on('order_update', handleOrderUpdate);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('order_update', handleOrderUpdate);
      socket.off('notification', handleNotification);
    };
  }, [user, fetchOrders]);

  const stats = [
    { label: 'Total Orders', value: String(orders.length), icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed', value: String(orders.filter(o => o.status === 'delivered' || o.status === 'paid').length), icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending', value: String(orders.filter(o => o.status !== 'delivered' && o.status !== 'paid' && o.status !== 'cancelled').length), icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <Card className="p-7 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amaranth-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-blob-drift" />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2">
              Hello, {user?.name || 'Shopper'}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-sm">
              Welcome back. Track orders, download invoices, and manage your profile.
            </p>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-6 rounded-[1.75rem] border border-white/25 dark:border-white/10 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase">{stat.label}</p>
                  <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{stat.value}</p>
                </div>
              </div>
              <ChevronRight className="text-zinc-300" size={20} />
            </motion.div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <Card className="overflow-hidden p-0">
          <div className="px-6 sm:px-8 py-5 border-b border-white/25 dark:border-white/10 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-black">Recent Orders</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchOrders()}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Link href="/dashboard/customer/orders">
                <Button variant="ghost" size="sm" className="text-amaranth-700">
                  View all
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                Error: {error}
              </div>
            )}
            {loading ? (
              <p className="text-zinc-500 py-4">Loading orders...</p>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="text-zinc-300" size={40} />
                </div>
                <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">No orders yet</h3>
                <p className="text-zinc-500 text-sm max-w-[200px]">Start your premium shopping journey today.</p>
                <Button
                  onClick={() => window.location.href = '/products'}
                  className="mt-6"
                >
                  Go to Shop
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-white/5 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/60 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-amaranth-100 text-amaranth-600 dark:bg-amaranth-900/30">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900 dark:text-white">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-xs text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            o.status === 'delivered' || o.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                            {o.status}
                        </span>
                        <ChevronRight className="text-zinc-300" size={18} />
                    </div>
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
