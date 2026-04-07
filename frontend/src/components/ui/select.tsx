import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  children?: ReactNode;
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  options = [],
  children,
  placeholder,
  className = "",
  id,
  ...props
}: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-text-primary font-medium text-body-sm mb-1.5">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer ${error ? "border-error focus:ring-error/30 focus:border-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-caption text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-caption text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
}
