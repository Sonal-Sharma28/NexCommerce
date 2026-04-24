"use client";

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/products');
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error: ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected array of products, but received:', data);
          setProducts([]);
          throw new Error('Invalid data format received from server');
        }
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter(p => {
    const name = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const query = (searchTerm || '').toLowerCase();
    return name.includes(query) || cat.includes(query);
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative h-56 sm:h-64 rounded-4xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-r from-amaranth-600 to-amaranth-400 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12 text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">Today’s Deals</h1>
            <p className="text-white/85 max-w-md font-medium text-sm sm:text-base">
              Browse products from trusted sellers. Add to cart and checkout with Stripe.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={<Search size={18} />}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto" size="md">
            <Filter size={18} />
            Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-pulse">
              <div className="relative">
                <Loader2 className="animate-spin text-amaranth-600" size={48} />
                <div className="absolute inset-0 blur-xl bg-amaranth-400/20 rounded-full" />
              </div>
              <p className="text-zinc-500 font-bold tracking-tight">Curating your collection...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-4xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20">
              <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-6 group">
                <Filter className="group-hover:rotate-12 transition-transform" size={32} />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Connection Issues</h2>
              <p className="text-zinc-500 max-w-sm mx-auto mb-8 font-medium">{error}</p>
              <Button onClick={() => window.location.reload()} className="h-12 px-8 font-black shadow-lg shadow-amaranth-500/20">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                    <Search size={40} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-900 dark:text-white">No products found</p>
                    <p className="text-zinc-500 font-medium">Try adjusting your search or filters.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
