"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (err) {
      // toast handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 sm:p-6 bg-slate-50 dark:bg-zinc-950 overflow-hidden">
      {/* Premium Background Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-amaranth-400/20 rounded-full blur-[100px] animate-blob-drift" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-amaranth-600/10 rounded-full blur-[100px] animate-blob-drift" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-7 sm:p-9">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-amaranth-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amaranth-500/40 mb-6">
              <ShoppingBag className="text-white" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Welcome Back</h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-base">Continue your shopping journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                startAdornment={<User size={18} />}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                startAdornment={<Lock size={18} />}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 font-black group"
            >
              {isLoading ? 'Processing...' : 'Sign In'}
              {!isLoading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
            </Button>
          </form>

          <div className="mt-8 text-center text-zinc-500">
            <p className="text-sm">
              Don't have an account? {' '}
              <Link href="/register" className="text-amaranth-600 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
