import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  header,
  footer,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={`card ${paddingStyles[padding]} ${className}`} {...props}>
      {header && <div className="mb-4">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-border">{footer}</div>}
    </div>
  );
}
