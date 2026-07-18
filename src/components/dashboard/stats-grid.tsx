import { StatCard } from "@/components/dashboard/stat-card";
import { IconFolder, IconInbox, IconUpload, IconUsers } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";

async function getCount(table: "clients" | "projects") {
  const supabase = await createClient();
  // RLS scopes this to the signed-in user's own rows — no manual
  // .eq("user_id", ...) filter needed.
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });

  if (error) {
    console.error(`Failed to load ${table} count:`, error);
    return { count: null, error: true as const };
  }

  return { count: count ?? 0, error: false as const };
}

// "Due" = not completed and due within the next 7 days — this also
// naturally includes anything already overdue (due_date in the past
// still satisfies <= 7-days-from-now).
async function getTasksDueCount() {
  const supabase = await createClient();
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .neq("status", "completed")
    .not("due_date", "is", null)
    .lte("due_date", sevenDaysFromNow);

  if (error) {
    console.error("Failed to load tasks due count:", error);
    return { count: null, error: true as const };
  }

  return { count: count ?? 0, error: false as const };
}

// Storage Used stays a static placeholder — that's a hosting/infra
// concern, not a module with its own table.
export async function StatsGrid() {
  const [clients, projects, tasksDue] = await Promise.all([
    getCount("clients"),
    getCount("projects"),
    getTasksDueCount(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Projects"
        value={String(projects.count ?? 0)}
        hint="Across all clients"
        icon={<IconFolder className="h-5 w-5" />}
        error={projects.error}
        tone="teal"
      />
      <StatCard
        label="Clients"
        value={String(clients.count ?? 0)}
        hint="Total clients"
        icon={<IconUsers className="h-5 w-5" />}
        error={clients.error}
        tone="violet"
      />
      <StatCard
        label="Tasks Due"
        value={String(tasksDue.count ?? 0)}
        hint="Next 7 days"
        icon={<IconInbox className="h-5 w-5" />}
        error={tasksDue.error}
        tone="teal"
      />
      <StatCard
        label="Storage Used"
        value="2.1 GB"
        hint="of 10 GB"
        icon={<IconUpload className="h-5 w-5" />}
        tone="violet"
      />
    </div>
  );
}
