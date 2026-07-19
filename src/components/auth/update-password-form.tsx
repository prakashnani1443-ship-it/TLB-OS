"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

type Phase = "verifying" | "ready" | "invalid";

export function UpdatePasswordForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [phase, setPhase] = useState<Phase>("verifying");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function verifyRecoverySession() {
      const supabase = createClient();
      // Supabase's password-recovery link can land here either as a PKCE
      // `?code=` (needs exchanging) or with the session already established
      // from the URL hash (detectSessionInUrl, on by default) — try both.
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Failed to verify reset link:", error);
          setPhase("invalid");
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setPhase(session ? "ready" : "invalid");
    }

    verifyRecoverySession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      showToast("Passwords don't match.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error("Failed to update password:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Password updated successfully.", "success");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Failed to update password:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (phase === "verifying") {
    return (
      <div className="w-full max-w-sm p-6 text-center text-sm text-muted">
        Verifying your reset link…
      </div>
    );
  }

  if (phase === "invalid") {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4 p-6 text-center">
        <div className="space-y-1">
          <h1 className="font-heading text-xl font-semibold">Link expired</h1>
          <p className="text-sm text-muted">
            This password reset link is invalid or has expired. Request a new one below.
          </p>
        </div>
        <Link href="/forgot-password" className="text-sm text-accent hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 p-6">
      <h1 className="font-heading text-xl font-semibold">Set a new password</h1>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        autoComplete="new-password"
        minLength={6}
        required
      />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm new password"
        autoComplete="new-password"
        minLength={6}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
