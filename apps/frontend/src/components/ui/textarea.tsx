"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm md:text-base font-medium outline-none transition",
          "placeholder:text-zinc-400",
          "focus-visible:ring-2 focus-visible:ring-amaranth-500/60 focus-visible:border-amaranth-300",
          "dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:placeholder:text-zinc-500",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

