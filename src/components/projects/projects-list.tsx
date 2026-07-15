import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconFolder } from "@/components/ui/icons";
import { EditProjectButton } from "@/components/projects/edit-project-button";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import type { Project, ClientOption } from "@/components/projects/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const statusLabels: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface ProjectsListProps {
  projects: Project[];
  clientOptions: ClientOption[];
  error?: boolean;
}

export function ProjectsList({ projects, clientOptions, error }: ProjectsListProps) {
  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            error
            icon={<IconFolder className="h-5 w-5" />}
            title="Couldn't load projects"
            description="Something went wrong fetching your projects. Try refreshing the page."
          />
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconFolder className="h-5 w-5" />}
            title="No projects yet"
            description="Add a project to start tracking it."
          />
        </CardContent>
      </Card>
    );
  }

  const clientNameById = new Map(clientOptions.map((client) => [client.id, client.name]));

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {projects.map((project) => {
            const clientName = project.client_id ? clientNameById.get(project.client_id) : null;
            const dueDate = project.due_date
              ? new Date(project.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <li key={project.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
                  <p className="truncate text-xs text-muted">
                    {[clientName, project.project_type, dueDate && `Due ${dueDate}`]
                      .filter(Boolean)
                      .join(" · ") || "No additional details"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {project.budget !== null && (
                    <span className="text-sm text-muted">
                      {currencyFormatter.format(project.budget)}
                    </span>
                  )}
                  <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
                    {statusLabels[project.status] ?? project.status}
                  </span>
                  <EditProjectButton project={project} clientOptions={clientOptions} />
                  <DeleteProjectButton project={project} />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
