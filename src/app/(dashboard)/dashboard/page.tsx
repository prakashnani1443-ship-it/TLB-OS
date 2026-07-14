import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { getUser } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await getUser();

  // Real data (the authenticated user's own email), not a placeholder —
  // falls back only if email is somehow missing from the session.
  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection name={name} />
      <StatsGrid />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentProjects />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
