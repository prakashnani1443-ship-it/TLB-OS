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
import type { Client } from "@/components/clients/types";

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  /** Required when mode === "edit" — pre-fills the form and identifies the row to update. */
  client?: Client;
}

export function ClientFormDialog({ open, onClose, mode, client }: ClientFormDialogProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      showToast("Client name is required.", "error");
      return;
    }

    const payload = {
      name,
      company: String(formData.get("company") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      ...(isEdit ? { status: String(formData.get("status") ?? "active") } : {}),
    };

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } =
        isEdit && client
          ? await supabase.from("clients").update(payload).eq("id", client.id)
          : await supabase.from("clients").insert(payload);

      if (error) {
        console.error(`Failed to ${isEdit ? "update" : "add"} client:`, error);
        showToast(error.message, "error");
        return;
      }

      showToast(isEdit ? "Client updated successfully." : "Client added successfully.", "success");
      onClose();
      // Re-runs the (Server Component) clients list with fresh data.
      router.refresh();
    } catch (err) {
      console.error(`Failed to ${isEdit ? "update" : "add"} client:`, err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Edit Client" : "New Client"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-name" className="text-sm font-medium text-foreground">
            Client Name
          </label>
          <Input
            id="client-name"
            name="name"
            placeholder="Jane Doe"
            required
            defaultValue={client?.name}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-company" className="text-sm font-medium text-foreground">
            Company Name
          </label>
          <Input
            id="client-company"
            name="company"
            placeholder="Acme Inc."
            defaultValue={client?.company ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-phone" className="text-sm font-medium text-foreground">
            Phone Number
          </label>
          <Input
            id="client-phone"
            name="phone"
            type="tel"
            placeholder="+1 555 000 0000"
            defaultValue={client?.phone ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="client-email"
            name="email"
            type="email"
            placeholder="jane@acme.com"
            defaultValue={client?.email ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-address" className="text-sm font-medium text-foreground">
            Address
          </label>
          <Textarea
            id="client-address"
            name="address"
            placeholder="123 Main St, City, Country"
            rows={2}
            defaultValue={client?.address ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-notes" className="text-sm font-medium text-foreground">
            Notes
          </label>
          <Textarea
            id="client-notes"
            name="notes"
            placeholder="Anything worth remembering…"
            rows={3}
            defaultValue={client?.notes ?? ""}
          />
        </div>

        {isEdit && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="client-status" className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select id="client-status" name="status" defaultValue={client?.status ?? "active"}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : isEdit ? "Save Changes" : "Save Client"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
