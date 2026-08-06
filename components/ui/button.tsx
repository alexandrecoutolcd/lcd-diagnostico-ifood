"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-hover active:translate-y-px",
        ghost: "border border-border text-body hover:border-border-strong hover:text-heading bg-transparent",
        accent: "bg-accent-pos text-white hover:bg-accent-pos-hover",
        dark: "bg-white text-brand border border-white hover:bg-gray-100",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
