import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconUsers } from "@/components/ui/icons";
import { EditClientButton } from "@/components/clients/edit-client-button";
import { createClient } from "@/lib/supabase/server";

export async function ClientsList() {
  const supabase = await createClient();
  // RLS scopes this to the signed-in user's own rows.
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, company, phone, email, address, notes, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load clients:", error);
    return (
      <Card>
        <CardContent>
          <EmptyState
            error
            icon={<IconUsers className="h-5 w-5" />}
            title="Couldn't load clients"
            description="Something went wrong fetching your clients. Try refreshing the page."
          />
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconUsers className="h-5 w-5" />}
            title="No clients yet"
            description="Add a client to start tracking their projects."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {clients.map((client) => (
            <li key={client.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{client.name}</p>
                <p className="truncate text-xs text-muted">
                  {[client.company, client.email, client.phone].filter(Boolean).join(" · ") ||
                    "No additional details"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
                  {client.status}
                </span>
                <EditClientButton client={client} />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
