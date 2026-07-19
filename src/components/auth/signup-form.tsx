"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
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
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("Sign up failed:", error);
        showToast(error.message, "error");
        return;
      }

      if (data.session) {
        // Email confirmation is off for this project — session exists already.
        showToast("Account created — welcome to TLB-OS.", "success");
        router.push("/dashboard");
        router.refresh();
      } else {
        // Email confirmation is required — no session until they click the link.
        showToast("Check your email to confirm your account.", "success");
        router.push("/login");
      }
    } catch (err) {
      console.error("Sign up failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 p-6">
      <h1 className="font-heading text-xl font-semibold">Create your TLB-OS account</h1>
      <Input type="email" name="email" placeholder="Email" autoComplete="email" required />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="new-password"
        minLength={6}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Sign up"}
      </Button>
    </form>
  );
}
