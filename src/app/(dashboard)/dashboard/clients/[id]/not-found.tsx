import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { IconUsers } from "@/components/ui/icons";

export default function ClientNotFound() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconUsers className="h-5 w-5" />}
            title="Client not found"
            description="This client doesn't exist, or you don't have access to it."
            action={
              <Link href="/dashboard/clients">
                <Button variant="secondary">Back to Clients</Button>
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
