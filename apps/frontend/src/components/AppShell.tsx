"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: ShoppingBag },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Dashboard', path: user?.role === 'seller' ? '/dashboard/admin' : '/dashboard/customer', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const mobileNavItems = [...navItems];
  if (!user) {
    mobileNavItems.push({ name: 'Log In', path: '/login', icon: User });
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Header */}
      <header className="header-glass px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-xl font-black tracking-tight bg-linear-to-r from-amaranth-700 to-amaranth-500 bg-clip-text text-transparent shrink-0">
          NexCommerce
        </Link>
        
        <div className="flex items-center gap-2 md:gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`text-sm font-bold transition-colors ${
                  pathname === item.path ? 'text-amaranth-700' : 'text-zinc-500 hover:text-amaranth-600'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {item.name}
                  {item.path === '/cart' && itemCount > 0 ? (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-amaranth-600 text-white text-[11px] leading-5 text-center font-black">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>

          <div className="h-4 w-[1px] bg-zinc-200 hidden md:block" />

          <div className="flex items-center gap-1.5 md:gap-3">
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="text-zinc-500 hover:text-red-600 hover:bg-red-50 px-2 md:px-4"
              >
                <LogOut size={18} className="md:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-zinc-600 px-2 md:px-4 text-[12px] md:text-sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-8 md:h-9 px-3 md:px-5 text-[11px] md:text-sm shadow-amaranth-500/10">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-slide-up-soft">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 nav-glass pb-safe px-2 py-3 z-50 flex justify-around items-center">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className="relative flex flex-col items-center gap-1 group min-w-[60px]"
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-amaranth-100 text-amaranth-700' : 'text-zinc-400'
              }`}>
                <div className="relative">
                  <item.icon size={20} />
                  {item.path === '/cart' && itemCount > 0 ? (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-amaranth-600 text-white text-[9px] leading-4 text-center font-black">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  ) : null}
                </div>
              </div>
              <span className={`text-[9px] font-bold ${isActive ? 'text-amaranth-700' : 'text-zinc-500'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-3 w-1 h-1 bg-amaranth-600 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AppShell;
