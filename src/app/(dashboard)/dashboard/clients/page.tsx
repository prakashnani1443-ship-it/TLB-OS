import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconUsers } from "@/components/ui/icons";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clients</h1>
        <p className="mt-1 text-sm text-muted">Everyone TLB Studio works with.</p>
      </div>
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconUsers className="h-5 w-5" />}
            title="No clients yet"
            description="Add a client to start tracking their projects."
          />
        </CardContent>
      </Card>
    </div>
  );
}
