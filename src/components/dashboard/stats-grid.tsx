import { StatCard } from "@/components/dashboard/stat-card";
import { IconFolder, IconInbox, IconUpload, IconUsers } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";

async function getClientCount() {
  const supabase = await createClient();
  // RLS scopes this to the signed-in user's own rows — no manual
  // .eq("user_id", ...) filter needed.
  const { count, error } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Failed to load client count:", error);
    return { count: null, error: true as const };
  }

  return { count: count ?? 0, error: false as const };
}

// Active Projects / Tasks Due / Storage Used stay static placeholders —
// those modules aren't built yet. Only Clients is wired to real data.
export async function StatsGrid() {
  const { count, error } = await getClientCount();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Active Projects"
        value="4"
        hint="Across all clients"
        icon={<IconFolder className="h-5 w-5" />}
      />
      <StatCard
        label="Clients"
        value={String(count ?? 0)}
        hint="Total clients"
        icon={<IconUsers className="h-5 w-5" />}
        error={error}
      />
      <StatCard
        label="Tasks Due"
        value="7"
        hint="Next 7 days"
        icon={<IconInbox className="h-5 w-5" />}
      />
      <StatCard
        label="Storage Used"
        value="2.1 GB"
        hint="of 10 GB"
        icon={<IconUpload className="h-5 w-5" />}
      />
    </div>
  );
}
