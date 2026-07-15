"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { IconPlus } from "@/components/ui/icons";

export function AddClientButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    };

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("clients").insert(payload);

      if (error) {
        console.error("Failed to add client:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Client added successfully.", "success");
      setOpen(false);
      // Re-runs the (Server Component) clients list with fresh data.
      router.refresh();
    } catch (err) {
      console.error("Failed to add client:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="h-4 w-4" />
        New Client
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} title="New Client">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="client-name" className="text-sm font-medium text-foreground">
              Client Name
            </label>
            <Input id="client-name" name="name" placeholder="Jane Doe" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="client-company" className="text-sm font-medium text-foreground">
              Company Name
            </label>
            <Input id="client-company" name="company" placeholder="Acme Inc." />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="client-phone" className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <Input id="client-phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="client-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input id="client-email" name="email" type="email" placeholder="jane@acme.com" />
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
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save Client"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
