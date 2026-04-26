"use client";

import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Plus, Package, LayoutGrid, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { socket } from '@/lib/socket';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Electronics',
    stock: '10'
  });

  // Role Protection
  if (!user || user.role !== 'seller') {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-zinc-500 font-bold">Access Denied. Redirecting...</p>
      </div>
    );
  }

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products/mine');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load products');
      setProducts(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/seller');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load orders');
      setOrders(data || []);
    } catch (err: any) {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!showAddForm) {
      loadProducts();
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddForm]);

  // Real-time order updates via socket
  useEffect(() => {
    if (!user || user.role !== 'seller') return;

    // Listen for new orders and order updates
    const handleNotification = (data: any) => {
      console.log('Seller notification:', data);
      loadOrders(); // Refresh orders list
    };

    const handleOrderUpdate = (data: any) => {
      console.log('Order update:', data);
      loadOrders(); // Refresh orders list
    };

    socket.on('notification', handleNotification);
    socket.on('order_update', handleOrderUpdate);

    return () => {
      socket.off('notification', handleNotification);
      socket.off('order_update', handleOrderUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const stats = useMemo(() => {
    const liveCount = products.filter((p) => (p.status || 'active') === 'active').length;
    const categories = new Set(products.map((p) => p.category).filter(Boolean)).size;
    return { liveCount, categories };
  }, [products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Product added successfully!');
        setShowAddForm(false);
        setFormData({ name: '', price: '', description: '', image: '', category: 'Electronics', stock: '10' });
        await loadProducts();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to delete product');
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Seller Dashboard</h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">Create and manage your products.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {!showAddForm ? (
            <Button variant="outline" onClick={() => { loadProducts(); loadOrders(); }}>
                <RefreshCw size={18} />
                Refresh
              </Button>
            ) : null}
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'View Inventory' : <><Plus size={20} /> Add Product</>}
            </Button>
          </div>
        </div>

        {showAddForm ? (
          <Card className="max-w-2xl mx-auto p-7 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black mb-6">Create New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    type="text"
                    required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Classic Watch"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="9999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell users about this luxury item..."
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  type="text"
                  value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="h-11 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 text-sm md:text-base font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-amaranth-500/60 focus-visible:border-amaranth-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50"
                  >
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Home Lux</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2 h-12 font-black">
                Publish Product
              </Button>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 rounded-[1.75rem] flex items-center gap-4">
                <div className="p-3 bg-amaranth-100 dark:bg-amaranth-900/30 text-amaranth-600 rounded-2xl">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase">Live Products</p>
                  <p className="text-2xl font-black">{stats.liveCount}</p>
                </div>
              </Card>
              <Card className="p-6 rounded-[1.75rem] flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase">Categories</p>
                  <p className="text-2xl font-black">{stats.categories}</p>
                </div>
              </Card>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="px-6 sm:px-8 py-5 border-b border-white/25 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black">Your Products</h2>
                <Button className="sm:hidden" onClick={() => setShowAddForm(true)} size="sm">
                  <Plus size={18} />
                  Add
                </Button>
              </div>

              <div className="p-6 sm:p-8">
                {loadingProducts ? (
                  <p className="text-sm text-zinc-500">Loading products…</p>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-black text-zinc-900 dark:text-white">No products yet</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Add your first product to start selling.
                    </p>
                    <Button className="mt-6" onClick={() => setShowAddForm(true)}>
                      <Plus size={18} />
                      Add product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-4 rounded-3xl border border-white/25 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-4"
                      >
                        <div className="min-w-0">
                          <p className="font-black text-zinc-900 dark:text-white truncate">
                            {p.name}
                          </p>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                            {p.category || 'General'} • ₹{Number(p.price || 0).toFixed(2)} • Stock {Number(p.stock || 0)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-6 sm:px-8 py-5 border-b border-white/25 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black">Recent Orders</h2>
                <span className="text-xs text-zinc-500">Auto-updates via notifications</span>
              </div>
              <div className="p-6 sm:p-8">
                {loadingOrders ? (
                  <p className="text-sm text-zinc-500">Loading orders…</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="font-black text-zinc-900 dark:text-white">No orders yet</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      When a customer purchases your products, you’ll see it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 10).map((o) => (
                      <div
                        key={o.orderId || o.id}
                        className="flex items-center justify-between gap-4 rounded-3xl border border-white/25 dark:border-white/10 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-4"
                      >
                        <div className="min-w-0">
                          <p className="font-black text-zinc-900 dark:text-white truncate">
                            {o.buyerName || 'Customer'}
                          </p>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                            Status: <span className="font-bold text-zinc-900 dark:text-white">{o.status}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const res = await fetch(`/api/orders/seller/${o.orderId || o.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'shipped' }),
                              });
                              if (res.ok) {
                                toast.success('Marked as shipped');
                                loadOrders();
                              } else {
                                const data = await res.json().catch(() => ({}));
                                toast.error(data?.message || 'Failed to update');
                              }
                            }}
                          >
                            Mark shipped
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
