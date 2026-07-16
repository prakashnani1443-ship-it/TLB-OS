import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { IconInbox } from "@/components/ui/icons";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconInbox className="h-5 w-5" />}
            title="Task not found"
            description="This task doesn't exist, or you don't have access to it."
            action={
              <Link href="/dashboard/tasks">
                <Button variant="secondary">Back to Tasks</Button>
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
