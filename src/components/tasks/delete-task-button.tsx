"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash } from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/components/tasks/types";

export function DeleteTaskButton({ task }: { task: Task }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);

      if (error) {
        console.error("Failed to delete task:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Task deleted successfully.", "success");
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete task:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${task.title}`}
        className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
      >
        <IconTrash className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Delete task"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-foreground">{task.title}</strong>? This
            can&apos;t be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting…" : "Delete"}
        disabled={isDeleting}
        destructive
      />
    </>
  );
}
