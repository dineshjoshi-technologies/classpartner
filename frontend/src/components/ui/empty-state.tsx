import type { ReactNode } from "react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-text-secondary">
          {icon}
        </div>
      )}
      <h3 className="text-h3 text-text-primary mb-2">{title}</h3>
      <p className="text-body-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button>{actionLabel}</Button>
        </a>
      )}
      {actionLabel && onActionClick && (
        <Button onClick={onActionClick}>{actionLabel}</Button>
      )}
    </div>
  );
}
