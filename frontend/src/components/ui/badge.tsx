import type { ReactNode, HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "info" | "warning" | "error";
  children: ReactNode;
}

export function Badge({
  variant = "info",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    success: "bg-secondary/10 text-secondary",
    info: "bg-primary/10 text-primary",
    warning: "bg-accent/10 text-accent",
    error: "bg-error/10 text-error",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-caption font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
