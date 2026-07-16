"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconCheck, IconFolder, IconPencil, IconUsers } from "@/components/ui/icons";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Task, ClientOption, ProjectOption } from "@/components/tasks/types";

interface TaskQuickActionsProps {
  task: Task;
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
}

export function TaskQuickActions({ task, clientOptions, projectOptions }: TaskQuickActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const isCompleted = task.status === "completed";

  async function handleMarkCompleted() {
    setIsCompleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tasks")
        .update({ status: "completed" })
        .eq("id", task.id);

      if (error) {
        console.error("Failed to mark task completed:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Task marked as completed.", "success");
      router.refresh();
    } catch (err) {
      console.error("Failed to mark task completed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={() => setEditOpen(true)}>
        <IconPencil className="h-4 w-4" />
        Edit Task
      </Button>
      <Button
        variant="secondary"
        onClick={handleMarkCompleted}
        disabled={isCompleted || isCompleting}
      >
        <IconCheck className="h-4 w-4" />
        {isCompleted ? "Completed" : isCompleting ? "Marking…" : "Mark as Completed"}
      </Button>
      {task.project_id && (
        <Link href={`/dashboard/projects/${task.project_id}`}>
          <Button variant="secondary">
            <IconFolder className="h-4 w-4" />
            View Project
          </Button>
        </Link>
      )}
      {task.client_id && (
        <Link href={`/dashboard/clients/${task.client_id}`}>
          <Button variant="secondary">
            <IconUsers className="h-4 w-4" />
            View Client
          </Button>
        </Link>
      )}
      <Link href="/dashboard/tasks">
        <Button variant="ghost">
          <IconArrowRight className="h-4 w-4 rotate-180" />
          Back to Tasks
        </Button>
      </Link>

      <TaskFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        task={task}
        clientOptions={clientOptions}
        projectOptions={projectOptions}
      />
    </div>
  );
}
