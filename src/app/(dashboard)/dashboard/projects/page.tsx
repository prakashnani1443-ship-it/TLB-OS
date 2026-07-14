import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconFolder } from "@/components/ui/icons";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted">All TLB Studio projects in one place.</p>
      </div>
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconFolder className="h-5 w-5" />}
            title="No projects yet"
            description="Create your first project to see it listed here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
