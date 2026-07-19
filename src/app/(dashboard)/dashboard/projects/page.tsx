import { AddProjectButton } from "@/components/projects/add-project-button";
import { ProjectsList } from "@/components/projects/projects-list";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();

  // Both are RLS-scoped to the signed-in user. Fetched together here
  // (rather than inside ProjectsList) since the Client select on the
  // Add/Edit form also needs clientOptions — one query instead of two.
  const [projectsResult, clientsResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, client_id, name, project_type, status, start_date, due_date, budget, notes, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name").order("name", { ascending: true }),
  ]);

  if (projectsResult.error) {
    console.error("Failed to load projects:", projectsResult.error);
  }
  if (clientsResult.error) {
    console.error("Failed to load clients for project form:", clientsResult.error);
  }

  const clientOptions = clientsResult.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted">All TLB Studio projects in one place.</p>
        </div>
        <AddProjectButton clientOptions={clientOptions} />
      </div>
      <ProjectsList
        projects={projectsResult.data ?? []}
        clientOptions={clientOptions}
        error={Boolean(projectsResult.error)}
      />
    </div>
  );
}
