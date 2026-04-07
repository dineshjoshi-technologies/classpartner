export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantColors: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-secondary",
  warning: "bg-accent",
  error: "bg-error",
};

const sizeHeights: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = "primary",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-body-sm font-medium text-text-primary">{label}</span>}
          {showPercentage && (
            <span className="text-caption text-text-secondary ml-2">{clampedPercentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-border rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className={`h-full ${variantColors[variant]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
