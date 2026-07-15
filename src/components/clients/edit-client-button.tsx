"use client";

import { useState } from "react";
import { IconPencil } from "@/components/ui/icons";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import type { Client } from "@/components/clients/types";

export function EditClientButton({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${client.name}`}
        className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
      >
        <IconPencil className="h-4 w-4" />
      </button>
      <ClientFormDialog open={open} onClose={() => setOpen(false)} mode="edit" client={client} />
    </>
  );
}
