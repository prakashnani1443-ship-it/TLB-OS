import { AddClientButton } from "@/components/clients/add-client-button";
import { ClientsList } from "@/components/clients/clients-list";
import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const supabase = await createClient();
  // RLS scopes this to the signed-in user's own rows. Fetched once here
  // (not inside ClientsList) so search/filter/sort can run client-side
  // over the already-fetched rows, same pattern as TasksList.
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, company, phone, email, address, notes, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load clients:", error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted">Everyone TLB Studio works with.</p>
        </div>
        <AddClientButton />
      </div>
      <ClientsList clients={clients ?? []} error={Boolean(error)} />
    </div>
  );
}
