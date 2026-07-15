"use client";

import { useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconLogOut } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "children">;

export function SignOutButton({ disabled, ...props }: SignOutButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out failed:", error);
        showToast(error.message, "error");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut || disabled} {...props}>
      <IconLogOut className="h-4 w-4" />
      {isSigningOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
