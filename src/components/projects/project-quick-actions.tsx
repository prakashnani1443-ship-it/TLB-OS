"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconPencil, IconPlus, IconUsers } from "@/components/ui/icons";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import type { Project, ClientOption } from "@/components/projects/types";
import type { ProjectOption } from "@/components/tasks/types";

interface ProjectQuickActionsProps {
  project: Project;
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
}

export function ProjectQuickActions({
  project,
  clientOptions,
  projectOptions,
}: ProjectQuickActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={() => setEditOpen(true)}>
        <IconPencil className="h-4 w-4" />
        Edit Project
      </Button>
      <Button variant="secondary" onClick={() => setTaskOpen(true)}>
        <IconPlus className="h-4 w-4" />
        Add Task
      </Button>
      {project.client_id && (
        <Link href={`/dashboard/clients/${project.client_id}`}>
          <Button variant="secondary">
            <IconUsers className="h-4 w-4" />
            View Client
          </Button>
        </Link>
      )}
      <Link href="/dashboard/projects">
        <Button variant="ghost">
          <IconArrowRight className="h-4 w-4 rotate-180" />
          Back to Projects
        </Button>
      </Link>

      <ProjectFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        project={project}
        clientOptions={clientOptions}
      />
      <TaskFormDialog
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        mode="create"
        clientOptions={clientOptions}
        projectOptions={projectOptions}
        defaultClientId={project.client_id ?? undefined}
        defaultProjectId={project.id}
      />
    </div>
  );
}
