"use client";

import { useState } from "react";
import { IconPencil } from "@/components/ui/icons";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import type { Project, ClientOption } from "@/components/projects/types";

interface EditProjectButtonProps {
  project: Project;
  clientOptions: ClientOption[];
}

export function EditProjectButton({ project, clientOptions }: EditProjectButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${project.name}`}
        className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
      >
        <IconPencil className="h-4 w-4" />
      </button>
      <ProjectFormDialog
        open={open}
        onClose={() => setOpen(false)}
        mode="edit"
        project={project}
        clientOptions={clientOptions}
      />
    </>
  );
}
