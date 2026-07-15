"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import type { ClientOption } from "@/components/projects/types";

export function AddProjectButton({ clientOptions }: { clientOptions: ClientOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="h-4 w-4" />
        New Project
      </Button>
      <ProjectFormDialog
        open={open}
        onClose={() => setOpen(false)}
        mode="create"
        clientOptions={clientOptions}
      />
    </>
  );
}
