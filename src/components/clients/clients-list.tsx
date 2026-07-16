"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconUsers } from "@/components/ui/icons";
import { EditClientButton } from "@/components/clients/edit-client-button";
import { DeleteClientButton } from "@/components/clients/delete-client-button";
import type { Client } from "@/components/clients/types";

interface ClientsListProps {
  clients: Client[];
  error?: boolean;
}

const DEFAULTS = { search: "", status: "all", sort: "newest" as const };

export function ClientsList({ clients, error }: ClientsListProps) {
  const [search, setSearch] = useState(DEFAULTS.search);
  const [statusFilter, setStatusFilter] = useState(DEFAULTS.status);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">(DEFAULTS.sort);

  const isFiltered =
    search.trim() !== "" || statusFilter !== DEFAULTS.status || sortOrder !== DEFAULTS.sort;

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = clients;
    if (query) {
      result = result.filter((client) =>
        [client.name, client.company, client.email, client.phone].some((field) =>
          field?.toLowerCase().includes(query),
        ),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((client) => client.status === statusFilter);
    }

    return [...result].sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
  }, [clients, search, statusFilter, sortOrder]);

  function clearFilters() {
    setSearch(DEFAULTS.search);
    setStatusFilter(DEFAULTS.status);
    setSortOrder(DEFAULTS.sort);
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            error
            icon={<IconUsers className="h-5 w-5" />}
            title="Couldn't load clients"
            description="Something went wrong fetching your clients. Try refreshing the page."
          />
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconUsers className="h-5 w-5" />}
            title="No clients yet"
            description="Add a client to start tracking their projects."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, company, email, or phone"
          aria-label="Search clients"
          className="w-full sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-auto"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
          className="w-auto"
          aria-label="Sort by created date"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
        <Button type="button" variant="ghost" onClick={clearFilters} disabled={!isFiltered}>
          Clear Filters
        </Button>
      </div>

      {filteredClients.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconUsers className="h-5 w-5" />}
              title="No clients match your filters"
              description="Try a different search term or status."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {filteredClients.map((client) => (
                <li
                  key={client.id}
                  className="relative flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
                >
                  {/* Stretched link covers the whole row; the action buttons
                      below sit at z-10 so they keep their own clicks. Avoids
                      nesting <button> inside <a> (invalid HTML). */}
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="absolute inset-0"
                    aria-label={`View ${client.name}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{client.name}</p>
                    <p className="truncate text-xs text-muted">
                      {[client.company, client.email, client.phone].filter(Boolean).join(" · ") ||
                        "No additional details"}
                    </p>
                  </div>
                  <div className="relative z-10 flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
                      {client.status}
                    </span>
                    <EditClientButton client={client} />
                    <DeleteClientButton client={client} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
