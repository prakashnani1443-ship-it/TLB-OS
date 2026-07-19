import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { IconFolder, IconInbox, IconUsers } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClientQuickActions } from "@/components/clients/client-quick-actions";
import { ProjectsList } from "@/components/projects/projects-list";
import { TasksList } from "@/components/tasks/tasks-list";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/components/projects/types";
import type { Task } from "@/components/tasks/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};

export default async function ClientDetailPage({
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
  // RLS means a client owned by someone else simply returns no row, which
  // we surface as Not Found (requirement 10) — never a leak.
  const [clientResult, projectsResult, tasksResult, allClientsResult, allProjectsResult] =
    await Promise.all([
      supabase
        .from("clients")
        .select("id, name, company, phone, email, address, notes, status, created_at")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("projects")
        .select("id, client_id, name, project_type, status, start_date, due_date, budget, notes, created_at")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("id, client_id, project_id, title, description, priority, status, due_date, created_at")
        .eq("client_id", id)
        .order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("clients").select("id, name").order("name", { ascending: true }),
      supabase.from("projects").select("id, name").order("name", { ascending: true }),
    ]);

  // A real DB/network error on the client lookup is distinct from "no
  // such client" — show an error state, not Not Found.
  if (clientResult.error) {
    console.error("Failed to load client:", clientResult.error);
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent>
            <EmptyState
              error
              icon={<IconUsers className="h-5 w-5" />}
              title="Couldn't load client"
              description="Something went wrong. Try refreshing the page."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const client = clientResult.data;
  if (!client) {
    notFound();
  }

  if (projectsResult.error) {
    console.error("Failed to load client projects:", projectsResult.error);
  }
  if (tasksResult.error) {
    console.error("Failed to load client tasks:", tasksResult.error);
  }

  const projects: Project[] = projectsResult.data ?? [];
  const tasks: Task[] = tasksResult.data ?? [];
  const clientOptions = allClientsResult.data ?? [];
  const projectOptions = allProjectsResult.data ?? [];

  const createdDate = new Date(client.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const summary = [
    { label: "Total Projects", value: projects.length, icon: IconFolder },
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "active").length,
      icon: IconFolder,
    },
    { label: "Total Tasks", value: tasks.length, icon: IconInbox },
    {
      label: "Pending Tasks",
      value: tasks.filter((t) => t.status === "pending").length,
      icon: IconInbox,
    },
    {
      label: "Completed Tasks",
      value: tasks.filter((t) => t.status === "completed").length,
      icon: IconInbox,
    },
  ];

  const details: { label: string; value: string | null }[] = [
    { label: "Company", value: client.company },
    { label: "Email", value: client.email },
    { label: "Phone", value: client.phone },
    { label: "Address", value: client.address },
    { label: "Notes", value: client.notes },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold text-foreground">{client.name}</h1>
          <StatusBadge status={client.status} label={statusLabels[client.status] ?? client.status} />
        </div>
        <p className="text-sm text-muted">Client since {createdDate}</p>
      </div>

      <ClientQuickActions
        client={client}
        clientOptions={clientOptions}
        projectOptions={projectOptions}
      />

      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
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
            icon={<stat.icon className="h-5 w-5" />}
            tone={index % 2 === 0 ? "teal" : "violet"}
          />
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">Projects</h2>
        <ProjectsList
          projects={projects}
          clientOptions={clientOptions}
          error={Boolean(projectsResult.error)}
        />
      </section>

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
