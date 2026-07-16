"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconPencil, IconPlus } from "@/components/ui/icons";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import type { Client } from "@/components/clients/types";

interface ClientQuickActionsProps {
  client: Client;
  clientOptions: { id: string; name: string }[];
  projectOptions: { id: string; name: string }[];
}

export function ClientQuickActions({
  client,
  clientOptions,
  projectOptions,
}: ClientQuickActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={() => setEditOpen(true)}>
        <IconPencil className="h-4 w-4" />
        Edit Client
      </Button>
      <Button variant="secondary" onClick={() => setProjectOpen(true)}>
        <IconPlus className="h-4 w-4" />
        Add Project
      </Button>
      <Button variant="secondary" onClick={() => setTaskOpen(true)}>
        <IconPlus className="h-4 w-4" />
        Add Task
      </Button>
      <Link href="/dashboard/clients">
        <Button variant="ghost">
          <IconArrowRight className="h-4 w-4 rotate-180" />
          Back to Clients
        </Button>
      </Link>

      <ClientFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        client={client}
      />
      <ProjectFormDialog
        open={projectOpen}
        onClose={() => setProjectOpen(false)}
        mode="create"
        clientOptions={clientOptions}
        defaultClientId={client.id}
      />
      <TaskFormDialog
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        mode="create"
        clientOptions={clientOptions}
        projectOptions={projectOptions}
        defaultClientId={client.id}
      />
    </div>
  );
}
