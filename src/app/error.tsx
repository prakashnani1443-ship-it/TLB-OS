"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@/components/ui/icons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <IconAlertTriangle className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-muted">
          An unexpected error occurred. You can try again, or head back to your dashboard.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button type="button" variant="secondary">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
