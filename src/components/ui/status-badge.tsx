import { cn } from "@/lib/utils";

// Shared across Clients/Projects/Tasks — status keys overlap (active,
// completed, cancelled, pending, in_progress, on_hold, inactive,
// archived) so one tone map covers every entity.
const POSITIVE_STATUSES = new Set(["active", "in_progress", "completed"]);
const DANGER_STATUSES = new Set(["cancelled"]);

const toneClasses = {
  positive: "bg-accent/10 text-accent",
  neutral: "bg-surface-hover text-muted",
  danger: "bg-danger/10 text-danger",
};

interface StatusBadgeProps {
  status: string;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const tone = DANGER_STATUSES.has(status)
    ? "danger"
    : POSITIVE_STATUSES.has(status)
      ? "positive"
      : "neutral";

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", toneClasses[tone])}>
      {label}
    </span>
  );
}
