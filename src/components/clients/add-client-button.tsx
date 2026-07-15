"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";

export function AddClientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="h-4 w-4" />
        New Client
      </Button>
      <ClientFormDialog open={open} onClose={() => setOpen(false)} mode="create" />
    </>
  );
}
