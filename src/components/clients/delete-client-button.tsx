"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash } from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/components/clients/types";

export function DeleteClientButton({ client }: { client: Client }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("clients").delete().eq("id", client.id);

      if (error) {
        console.error("Failed to delete client:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Client deleted successfully.", "success");
      setOpen(false);
      // Re-runs the (Server Component) clients list with fresh data. The
      // dashboard's client count lives on a different route, but that
      // route is dynamically rendered (it reads cookies via the Supabase
      // server client), so it isn't cached — it'll be correct the next
      // time it's visited without any extra invalidation needed.
      router.refresh();
    } catch (err) {
      console.error("Failed to delete client:", err);
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
        aria-label={`Delete ${client.name}`}
        className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
      >
        <IconTrash className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Delete client"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-foreground">{client.name}</strong>? This
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
