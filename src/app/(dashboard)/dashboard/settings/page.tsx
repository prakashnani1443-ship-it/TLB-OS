import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconSettings } from "@/components/ui/icons";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getUser } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await getUser();
  const email = user?.email ?? "";
  const initials = email.slice(0, 2).toUpperCase() || "U";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const emailVerified = Boolean(user?.email_confirmed_at);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">Account and workspace preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground"
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{email}</p>
              <p className="mt-0.5 text-xs text-muted">
                {emailVerified ? "Email verified" : "Email not verified"}
                {memberSince ? ` · Member since ${memberSince}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <SignOutButton variant="secondary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <EmptyState
            icon={<IconSettings className="h-5 w-5" />}
            title="Preferences coming soon"
            description="Workspace and notification preferences will live here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
