"use client";

import React from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    { name: 'Fast Delivery', icon: Zap, desc: 'Premium shipping for elite members.' },
    { name: 'Secure Payments', icon: ShieldCheck, desc: 'Encrypted Firestore security.' },
    { name: 'Global Reach', icon: Globe, desc: 'Luxury items from around the world.' },
  ];

  return (
    <AppShell>
      <div className="space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <section className="relative pt-12 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-amaranth-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amaranth-500/40 mb-8"
          >
            <ShoppingBag className="text-white" size={40} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white mb-5"
          >
            Nex<span className="text-amaranth-700">Commerce</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed"
          >
            A modern marketplace PWA in a warm, subtle yellow theme—fast, responsive, and built for real commerce.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10"
          >
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto group">
                Start Shopping
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Become a Seller
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 pb-8 sm:pb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/25 dark:border-white/10 p-6 sm:p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-amaranth-50 dark:bg-amaranth-900/30 text-amaranth-700 rounded-xl flex items-center justify-center mb-5">
                <feature.icon size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-2">{feature.name}</h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Global Blob Decoration */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-amaranth-500/6 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
      </div>
    </AppShell>
  );
}
