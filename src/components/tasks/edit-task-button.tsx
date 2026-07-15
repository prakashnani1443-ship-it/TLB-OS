"use client";

import { useState } from "react";
import { IconPencil } from "@/components/ui/icons";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import type { Task, ClientOption, ProjectOption } from "@/components/tasks/types";

interface EditTaskButtonProps {
  task: Task;
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
}

export function EditTaskButton({ task, clientOptions, projectOptions }: EditTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${task.title}`}
        className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
      >
        <IconPencil className="h-4 w-4" />
      </button>
      <TaskFormDialog
        open={open}
        onClose={() => setOpen(false)}
        mode="edit"
        task={task}
        clientOptions={clientOptions}
        projectOptions={projectOptions}
      />
    </>
  );
}
