import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  /** Set when the value couldn't be loaded — shows a fallback instead of a stale/fake number. */
  error?: boolean;
}

export function StatCard({ label, value, hint, icon, error }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          {icon}
        </div>
      </div>
      <p className="font-heading mt-3 text-2xl font-semibold text-foreground">
        {error ? "—" : value}
      </p>
      {error ? (
        <p className="mt-1 text-xs text-danger">Couldn&apos;t load</p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </Card>
  );
}
