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
import type { Project, ClientOption } from "@/components/projects/types";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  /** Required when mode === "edit" — identifies the row to update. */
  project?: Project;
  clientOptions: ClientOption[];
  /** Pre-selects a client in create mode (e.g. "Add project for this client"). */
  defaultClientId?: string;
}

export function ProjectFormDialog({
  open,
  onClose,
  mode,
  project,
  clientOptions,
  defaultClientId,
}: ProjectFormDialogProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      showToast("Project name is required.", "error");
      return;
    }

    const clientId = String(formData.get("client_id") ?? "");
    const startDate = String(formData.get("start_date") ?? "");
    const dueDate = String(formData.get("due_date") ?? "");
    const budgetRaw = String(formData.get("budget") ?? "");

    const payload = {
      name,
      client_id: clientId || null,
      project_type: String(formData.get("project_type") ?? "").trim() || null,
      status: String(formData.get("status") ?? "active"),
      start_date: startDate || null,
      due_date: dueDate || null,
      budget: budgetRaw ? Number(budgetRaw) : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    };

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } =
        isEdit && project
          ? await supabase.from("projects").update(payload).eq("id", project.id)
          : await supabase.from("projects").insert(payload);

      if (error) {
        console.error(`Failed to ${isEdit ? "update" : "add"} project:`, error);
        showToast(error.message, "error");
        return;
      }

      showToast(isEdit ? "Project updated successfully." : "Project added successfully.", "success");
      onClose();
      // Re-runs the (Server Component) projects list with fresh data.
      router.refresh();
    } catch (err) {
      console.error(`Failed to ${isEdit ? "update" : "add"} project:`, err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Edit Project" : "New Project"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-name" className="text-sm font-medium text-foreground">
            Project Name
          </label>
          <Input
            id="project-name"
            name="name"
            placeholder="Website Redesign"
            required
            defaultValue={project?.name}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-client" className="text-sm font-medium text-foreground">
            Client
          </label>
          <Select
            id="project-client"
            name="client_id"
            defaultValue={project?.client_id ?? defaultClientId ?? ""}
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
          <label htmlFor="project-type" className="text-sm font-medium text-foreground">
            Project Type
          </label>
          <Input
            id="project-type"
            name="project_type"
            placeholder="Web Design"
            defaultValue={project?.project_type ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <Select id="project-status" name="status" defaultValue={project?.status ?? "active"}>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="project-start-date" className="text-sm font-medium text-foreground">
              Start Date
            </label>
            <Input
              id="project-start-date"
              name="start_date"
              type="date"
              defaultValue={project?.start_date ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="project-due-date" className="text-sm font-medium text-foreground">
              Due Date
            </label>
            <Input
              id="project-due-date"
              name="due_date"
              type="date"
              defaultValue={project?.due_date ?? ""}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-budget" className="text-sm font-medium text-foreground">
            Budget
          </label>
          <Input
            id="project-budget"
            name="budget"
            type="number"
            step="0.01"
            min="0"
            placeholder="5000"
            defaultValue={project?.budget ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-notes" className="text-sm font-medium text-foreground">
            Notes
          </label>
          <Textarea
            id="project-notes"
            name="notes"
            placeholder="Anything worth remembering…"
            rows={3}
            defaultValue={project?.notes ?? ""}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : isEdit ? "Save Changes" : "Save Project"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
