import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { IconFolder } from "@/components/ui/icons";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconFolder className="h-5 w-5" />}
            title="Project not found"
            description="This project doesn't exist, or you don't have access to it."
            action={
              <Link href="/dashboard/projects">
                <Button variant="secondary">Back to Projects</Button>
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
