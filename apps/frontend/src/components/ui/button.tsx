"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amaranth-500/60";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-amaranth-600 text-white shadow-lg shadow-amaranth-500/25 hover:bg-amaranth-700",
  secondary:
    "bg-white/70 text-zinc-900 border border-white/40 shadow-sm hover:bg-white dark:bg-zinc-900/60 dark:text-zinc-50 dark:border-white/10",
  outline:
    "bg-transparent text-zinc-900 border border-zinc-200 hover:border-amaranth-400 hover:bg-amaranth-50 dark:text-zinc-50 dark:border-zinc-800 dark:hover:bg-amaranth-900/15",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-amaranth-50 dark:text-zinc-200 dark:hover:bg-amaranth-900/15",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm md:text-base",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variantClass[variant], sizeClass[size], className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

