import { AddTaskButton } from "@/components/tasks/add-task-button";
import { TasksList } from "@/components/tasks/tasks-list";
import { createClient } from "@/lib/supabase/server";

export default async function TasksPage() {
  const supabase = await createClient();

  // All three RLS-scoped to the signed-in user. Fetched together since
  // the Client/Project selects on the Add/Edit form need the full
  // option lists too — one round trip instead of three per render.
  const [tasksResult, clientsResult, projectsResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, client_id, project_id, title, description, priority, status, due_date, created_at")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase.from("clients").select("id, name").order("name", { ascending: true }),
    supabase.from("projects").select("id, name").order("name", { ascending: true }),
  ]);

  if (tasksResult.error) {
    console.error("Failed to load tasks:", tasksResult.error);
  }
  if (clientsResult.error) {
    console.error("Failed to load clients for task form:", clientsResult.error);
  }
  if (projectsResult.error) {
    console.error("Failed to load projects for task form:", projectsResult.error);
  }

  const clientOptions = clientsResult.data ?? [];
  const projectOptions = projectsResult.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="mt-1 text-sm text-muted">Everything on TLB Studio&apos;s plate.</p>
        </div>
        <AddTaskButton clientOptions={clientOptions} projectOptions={projectOptions} />
      </div>
      <TasksList
        tasks={tasksResult.data ?? []}
        clientOptions={clientOptions}
        projectOptions={projectOptions}
        error={Boolean(tasksResult.error)}
      />
    </div>
  );
}
