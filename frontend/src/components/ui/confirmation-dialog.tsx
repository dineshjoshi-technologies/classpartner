import { Modal } from "./modal";
import { Button } from "./button";
import type { ReactNode } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  loading?: boolean;
  children?: ReactNode;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  children,
}: ConfirmationDialogProps) {
  const btnClass = variant === "danger" ? "bg-error hover:bg-red-600 text-white" : variant === "warning" ? "bg-accent hover:bg-amber-600 text-white" : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-body-sm text-gray-600 mb-4">{message}</p>
      {children}
      <div className="flex gap-3 pt-2">
        <Button
          className={`flex-1 ${btnClass}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmLabel}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}
