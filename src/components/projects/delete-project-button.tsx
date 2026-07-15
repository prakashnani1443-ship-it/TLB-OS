"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash } from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/components/projects/types";

export function DeleteProjectButton({ project }: { project: Project }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("projects").delete().eq("id", project.id);

      if (error) {
        console.error("Failed to delete project:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Project deleted successfully.", "success");
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete project:", err);
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
        aria-label={`Delete ${project.name}`}
        className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
      >
        <IconTrash className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Delete project"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-foreground">{project.name}</strong>? This
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
