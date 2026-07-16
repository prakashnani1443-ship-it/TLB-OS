"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Task, ClientOption, ProjectOption } from "@/components/tasks/types";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  /** Required when mode === "edit" — identifies the row to update. */
  task?: Task;
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
  /** Pre-selects a client in create mode (e.g. "Add task for this client"). */
  defaultClientId?: string;
  /** Pre-selects a project in create mode (e.g. "Add task for this project"). */
  defaultProjectId?: string;
}

export function TaskFormDialog({
  open,
  onClose,
  mode,
  task,
  clientOptions,
  projectOptions,
  defaultClientId,
  defaultProjectId,
}: TaskFormDialogProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      showToast("Task title is required.", "error");
      return;
    }

    const clientId = String(formData.get("client_id") ?? "");
    const projectId = String(formData.get("project_id") ?? "");
    const dueDate = String(formData.get("due_date") ?? "");

    const payload = {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      client_id: clientId || null,
      project_id: projectId || null,
      priority: String(formData.get("priority") ?? "medium"),
      status: String(formData.get("status") ?? "pending"),
      due_date: dueDate || null,
    };

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } =
        isEdit && task
          ? await supabase.from("tasks").update(payload).eq("id", task.id)
          : await supabase.from("tasks").insert(payload);

      if (error) {
        console.error(`Failed to ${isEdit ? "update" : "add"} task:`, error);
        showToast(error.message, "error");
        return;
      }

      showToast(isEdit ? "Task updated successfully." : "Task added successfully.", "success");
      onClose();
      // Re-runs the (Server Component) tasks list with fresh data.
      router.refresh();
    } catch (err) {
      console.error(`Failed to ${isEdit ? "update" : "add"} task:`, err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Edit Task" : "New Task"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-title" className="text-sm font-medium text-foreground">
            Task Title
          </label>
          <Input
            id="task-title"
            name="title"
            placeholder="Send project proposal"
            required
            defaultValue={task?.title}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            id="task-description"
            name="description"
            placeholder="Anything worth remembering…"
            rows={3}
            defaultValue={task?.description ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-client" className="text-sm font-medium text-foreground">
            Client
          </label>
          <Select
            id="task-client"
            name="client_id"
            defaultValue={task?.client_id ?? defaultClientId ?? ""}
          >
            <option value="">No client</option>
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-project" className="text-sm font-medium text-foreground">
            Project
          </label>
          <Select
            id="task-project"
            name="project_id"
            defaultValue={task?.project_id ?? defaultProjectId ?? ""}
          >
            <option value="">No project</option>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-priority" className="text-sm font-medium text-foreground">
              Priority
            </label>
            <Select id="task-priority" name="priority" defaultValue={task?.priority ?? "medium"}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-status" className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select id="task-status" name="status" defaultValue={task?.status ?? "pending"}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-due-date" className="text-sm font-medium text-foreground">
            Due Date
          </label>
          <Input
            id="task-due-date"
            name="due_date"
            type="date"
            defaultValue={task?.due_date ?? ""}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : isEdit ? "Save Changes" : "Save Task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
