import { type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-20 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted",
        className,
      )}
      {...props}
    />
  );
}
