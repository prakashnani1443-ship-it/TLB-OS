"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("Log in failed:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Welcome back.", "success");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Log in failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 p-6">
      <h1 className="font-heading text-xl font-semibold">Log in to TLB-OS</h1>
      <Input type="email" name="email" placeholder="Email" autoComplete="email" required />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
