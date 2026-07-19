import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconArrowRight, IconFolder } from "@/components/ui/icons";

export interface Project {
  id: string;
  name: string;
  client: string;
  updatedAt: string;
}

interface RecentProjectsProps {
  // No real data source is wired up yet, so this defaults to empty and
  // renders the empty state — see dashboard/page.tsx.
  projects?: Project[];
}

export function RecentProjects({ projects = [] }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle>Recent Projects</CardTitle>
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
        >
          View all
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <EmptyState
            icon={<IconFolder className="h-5 w-5" />}
            title="No projects yet"
            description="Projects you create will show up here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-surface-hover">
                  <div>
                    <p className="text-sm font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted">{project.client}</p>
                  </div>
                  <span className="text-xs text-muted">{project.updatedAt}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
