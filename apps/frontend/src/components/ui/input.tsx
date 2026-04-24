"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  startAdornment?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, startAdornment, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        {startAdornment ? (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {startAdornment}
          </div>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "h-11 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 text-sm md:text-base font-medium outline-none transition",
            "placeholder:text-zinc-400",
            "focus-visible:ring-2 focus-visible:ring-amaranth-500/60 focus-visible:border-amaranth-300",
            "dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:placeholder:text-zinc-500",
            startAdornment ? "pl-12" : "",
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

