import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconInbox } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { TaskQuickActions } from "@/components/tasks/task-quick-actions";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const priorityLabels: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };
const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function TaskDetailPage({
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
  // RLS means a task owned by someone else simply returns no row,
  // surfaced as Not Found — never a leak.
  const [taskResult, clientsResult, projectsResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, client_id, project_id, title, description, priority, status, due_date, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("clients").select("id, name").order("name", { ascending: true }),
    supabase.from("projects").select("id, name").order("name", { ascending: true }),
  ]);

  // A real DB/network error on the task lookup is distinct from "no
  // such task" — show an error state, not Not Found.
  if (taskResult.error) {
    console.error("Failed to load task:", taskResult.error);
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent>
            <EmptyState
              error
              icon={<IconInbox className="h-5 w-5" />}
              title="Couldn't load task"
              description="Something went wrong. Try refreshing the page."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const task = taskResult.data;
  if (!task) {
    notFound();
  }

  const clientOptions = clientsResult.data ?? [];
  const projectOptions = projectsResult.data ?? [];
  const clientName = task.client_id
    ? (clientOptions.find((c) => c.id === task.client_id)?.name ?? null)
    : null;
  const projectName = task.project_id
    ? (projectOptions.find((p) => p.id === task.project_id)?.name ?? null)
    : null;

  const createdDate = formatDate(task.created_at)!;
  const dueDate = formatDate(task.due_date);
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = Boolean(task.due_date) && task.due_date! < today && task.status !== "completed";

  const details: { label: string; value: string | null }[] = [
    { label: "Client", value: clientName },
    { label: "Project", value: projectName },
    { label: "Priority", value: priorityLabels[task.priority] ?? task.priority },
    { label: "Description", value: task.description },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold text-foreground">{task.title}</h1>
          <StatusBadge status={task.status} label={statusLabels[task.status] ?? task.status} />
          {isOverdue && (
            <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
              Overdue
            </span>
          )}
        </div>
        <p className="text-sm text-muted">Created {createdDate}</p>
      </div>

      <TaskQuickActions task={task} clientOptions={clientOptions} projectOptions={projectOptions} />

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
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
              <dt className="text-xs text-muted">Due Date</dt>
              <dd
                className={
                  isOverdue
                    ? "mt-0.5 text-sm font-semibold text-danger"
                    : "mt-0.5 text-sm text-foreground"
                }
              >
                {dueDate ? (isOverdue ? `Overdue · ${dueDate}` : dueDate) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Created</dt>
              <dd className="mt-0.5 text-sm text-foreground">{createdDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
