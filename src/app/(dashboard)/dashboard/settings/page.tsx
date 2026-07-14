import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconSettings } from "@/components/ui/icons";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">Account and workspace preferences.</p>
      </div>
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconSettings className="h-5 w-5" />}
            title="Settings coming soon"
            description="Account and workspace preferences will live here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
