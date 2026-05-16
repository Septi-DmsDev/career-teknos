import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand text-white shadow-[0_10px_24px_rgba(23,55,87,0.18)] hover:bg-brand-strong focus-visible:outline-brand",
  secondary:
    "border border-line bg-white/90 text-slate-900 shadow-sm hover:border-brand/30 hover:bg-paper hover:text-brand",
  ghost: "text-slate-700 hover:bg-white/70 hover:text-slate-950",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonStyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

type LinkButtonProps = ButtonStyleProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: Omit<ButtonStyleProps, "children">) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant,
  size,
  className,
  children,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
