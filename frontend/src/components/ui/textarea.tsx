import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-text-primary font-medium text-body-sm mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y ${error ? "border-error focus:ring-error/30 focus:border-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
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
