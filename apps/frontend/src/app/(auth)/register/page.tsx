"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, UserPlus, Mail, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'customer' as 'seller' | 'customer'
  });
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
    } catch (err) {
      // toast handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 sm:p-6 bg-slate-50 dark:bg-zinc-950 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -right-20 w-96 h-96 bg-amaranth-400/20 rounded-full blur-[100px] animate-blob-drift" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-amaranth-600/10 rounded-full blur-[100px] animate-blob-drift" style={{ animationDelay: '1.5s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="p-7 sm:p-9 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amaranth-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amaranth-500/40 mb-6">
              <UserPlus className="text-white" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Create Account</h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-base">Shop or sell with NexCommerce</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  startAdornment={<User size={18} />}
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe123"
                  startAdornment={<Mail size={18} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                startAdornment={<Lock size={18} />}
              />
            </div>

            <div className="space-y-2">
              <Label>I want to...</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'customer'})}
                  className={`py-3 sm:py-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all text-sm sm:text-base ${
                    formData.role === 'customer' 
                    ? 'border-amaranth-600 bg-amaranth-50 dark:bg-amaranth-900/20 text-amaranth-600' 
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
                  }`}
                >
                  <ShoppingCart size={18} /> Shop
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'seller'})}
                  className={`py-3 sm:py-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all text-sm sm:text-base ${
                    formData.role === 'seller' 
                    ? 'border-amaranth-600 bg-amaranth-50 dark:bg-amaranth-900/20 text-amaranth-600' 
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
                  }`}
                >
                  <ShieldCheck size={18} /> Sell
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full h-12 font-black group mt-4"
            >
              {isLoading ? 'Creating Account...' : 'Join Now'}
              {!isLoading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
            </Button>
          </form>

          <div className="mt-8 text-center text-zinc-500">
            <p className="text-sm font-medium">
              Already a member? {' '}
              <Link href="/login" className="text-amaranth-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
