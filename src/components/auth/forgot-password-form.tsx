"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCheck } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error("Password reset request failed:", error);
        showToast(error.message, "error");
        return;
      }

      // Always show the same success state regardless of whether the email
      // is registered — avoids leaking which addresses have accounts.
      setSent(true);
    } catch (err) {
      console.error("Password reset request failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-4 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <IconCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
          </p>
        </div>
        <Link href="/login" className="text-sm text-accent hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>
      <Input type="email" name="email" placeholder="Email" autoComplete="email" required />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
      <Link href="/login" className="text-center text-sm text-muted hover:text-accent">
        Back to log in
      </Link>
    </form>
  );
}
