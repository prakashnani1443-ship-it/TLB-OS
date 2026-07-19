import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { IconFolder, IconInbox } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProjectQuickActions } from "@/components/projects/project-quick-actions";
import { TasksList } from "@/components/tasks/tasks-list";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/components/tasks/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const statusLabels: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // A malformed id can't match any row and would make Postgres throw on
  // the uuid cast — treat it as a clean Not Found instead of an error.
  if (!UUID_RE.test(id)) {
    notFound();
  }

  const supabase = await createClient();

  // Everything is RLS-scoped to the signed-in user. `.eq("id", id)` plus
  // RLS means a project owned by someone else simply returns no row,
  // surfaced as Not Found — never a leak.
  const [projectResult, tasksResult, clientsResult, allProjectsResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, client_id, name, project_type, status, start_date, due_date, budget, notes, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("tasks")
      .select("id, client_id, project_id, title, description, priority, status, due_date, created_at")
      .eq("project_id", id)
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase.from("clients").select("id, name").order("name", { ascending: true }),
    supabase.from("projects").select("id, name").order("name", { ascending: true }),
  ]);

  // A real DB/network error on the project lookup is distinct from "no
  // such project" — show an error state, not Not Found.
  if (projectResult.error) {
    console.error("Failed to load project:", projectResult.error);
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent>
            <EmptyState
              error
              icon={<IconFolder className="h-5 w-5" />}
              title="Couldn't load project"
              description="Something went wrong. Try refreshing the page."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = projectResult.data;
  if (!project) {
    notFound();
  }

  if (tasksResult.error) {
    console.error("Failed to load project tasks:", tasksResult.error);
  }

  const tasks: Task[] = tasksResult.data ?? [];
  const clientOptions = clientsResult.data ?? [];
  const projectOptions = allProjectsResult.data ?? [];
  const clientName = project.client_id
    ? (clientOptions.find((c) => c.id === project.client_id)?.name ?? null)
    : null;

  const createdDate = formatDate(project.created_at)!;
  const today = new Date().toISOString().slice(0, 10);

  const summary = [
    { label: "Total Tasks", value: tasks.length },
    { label: "Pending Tasks", value: tasks.filter((t) => t.status === "pending").length },
    { label: "In Progress Tasks", value: tasks.filter((t) => t.status === "in_progress").length },
    { label: "Completed Tasks", value: tasks.filter((t) => t.status === "completed").length },
    {
      label: "Overdue Tasks",
      value: tasks.filter((t) => t.due_date && t.due_date < today && t.status !== "completed")
        .length,
    },
  ];

  const details: { label: string; value: string | null }[] = [
    { label: "Client", value: clientName },
    { label: "Project Type", value: project.project_type },
    { label: "Start Date", value: formatDate(project.start_date) },
    { label: "Due Date", value: formatDate(project.due_date) },
    { label: "Budget", value: project.budget !== null ? currencyFormatter.format(project.budget) : null },
    { label: "Notes", value: project.notes },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold text-foreground">{project.name}</h1>
          <StatusBadge
            status={project.status}
            label={statusLabels[project.status] ?? project.status}
          />
        </div>
        <p className="text-sm text-muted">Created {createdDate}</p>
      </div>

      <ProjectQuickActions
        project={project}
        clientOptions={clientOptions}
        projectOptions={projectOptions}
      />

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-xs text-muted">{detail.label}</dt>
                <dd className="mt-0.5 text-sm text-foreground">
                  {detail.value || <span className="text-muted">—</span>}
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-xs text-muted">Created</dt>
              <dd className="mt-0.5 text-sm text-foreground">{createdDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {summary.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={String(stat.value)}
            icon={<IconInbox className="h-5 w-5" />}
            tone={index % 2 === 0 ? "teal" : "violet"}
          />
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Tasks</h2>
        <TasksList
          tasks={tasks}
          clientOptions={clientOptions}
          projectOptions={projectOptions}
          error={Boolean(tasksResult.error)}
        />
      </section>
    </div>
  );
}
