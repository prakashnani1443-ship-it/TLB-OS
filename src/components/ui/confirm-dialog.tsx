"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  disabled?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  disabled,
  destructive,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={disabled ? () => {} : onClose} title={title}>
      <p className="text-sm text-muted">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={disabled}>
          Cancel
        </Button>
        <Button
          type="button"
          variant={destructive ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={disabled}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
