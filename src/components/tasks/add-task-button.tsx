"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import type { ClientOption, ProjectOption } from "@/components/tasks/types";

interface AddTaskButtonProps {
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
}

export function AddTaskButton({ clientOptions, projectOptions }: AddTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="h-4 w-4" />
        New Task
      </Button>
      <TaskFormDialog
        open={open}
        onClose={() => setOpen(false)}
        mode="create"
        clientOptions={clientOptions}
        projectOptions={projectOptions}
      />
    </>
  );
}
