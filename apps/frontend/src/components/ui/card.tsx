"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "glass" | "solid";
};

export function Card({ className, variant = "glass", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-4xl",
        variant === "glass"
          ? "bg-white/70 backdrop-blur-2xl border border-white/25 shadow-xl"
          : "bg-white border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800",
        "dark:bg-zinc-900/70 dark:border-white/10",
        className,
      )}
      {...props}
    />
  );
}

