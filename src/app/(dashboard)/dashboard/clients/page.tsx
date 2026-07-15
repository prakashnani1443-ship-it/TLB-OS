import { AddClientButton } from "@/components/clients/add-client-button";
import { ClientsList } from "@/components/clients/clients-list";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted">Everyone TLB Studio works with.</p>
        </div>
        <AddClientButton />
      </div>
      <ClientsList />
    </div>
  );
}
