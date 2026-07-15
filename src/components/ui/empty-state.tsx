import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  /** Set when this is standing in for a failed fetch, not genuinely-empty data. */
  error?: boolean;
}

export function EmptyState({ icon, title, description, action, error }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          error ? "bg-danger/10 text-danger" : "bg-surface-hover text-muted",
        )}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className={cn("text-sm", error ? "text-danger" : "text-muted")}>{description}</p>
      </div>
      {action}
    </div>
  );
}
