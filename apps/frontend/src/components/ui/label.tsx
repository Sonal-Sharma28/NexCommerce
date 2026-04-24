"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "ml-1 text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

