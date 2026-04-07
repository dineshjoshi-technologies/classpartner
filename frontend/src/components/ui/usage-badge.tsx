import Link from "next/link";

interface UsageBadgeProps {
  used: number;
  limit: number;
  onUpgradeHref?: string;
  showUpgradeCta?: boolean;
  className?: string;
}

export function UsageBadge({
  used,
  limit,
  onUpgradeHref = "/dashboard/upgrade",
  showUpgradeCta = true,
  className = "",
}: UsageBadgeProps) {
  const remaining = Math.max(0, limit - used);
  const isCritical = remaining === 0;
  const isLow = remaining > 0 && remaining <= 1;

  const color = isCritical
    ? "text-error"
    : isLow
      ? "text-accent"
      : "text-secondary";

  const bgColor = isCritical
    ? "bg-error/10 border-error/30"
    : isLow
      ? "bg-accent/10 border-accent/30"
      : "bg-secondary/10 border-secondary/30";

  const dotColor = isCritical
    ? "bg-error"
    : isLow
      ? "bg-accent"
      : "bg-secondary";

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${bgColor} ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
        <span className="text-caption font-medium">
          <span className={color}>{remaining}</span>
          <span className="text-text-secondary"> of {limit} remaining</span>
        </span>
      </div>
      {showUpgradeCta && remaining <= 1 && (
        <Link
          href={onUpgradeHref}
          className="text-caption font-medium text-primary hover:underline ml-auto"
        >
          Upgrade &rarr;
        </Link>
      )}
    </div>
  );
}
