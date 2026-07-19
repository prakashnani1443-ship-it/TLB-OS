"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconFolder } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import { EditProjectButton } from "@/components/projects/edit-project-button";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import type { Project, ClientOption } from "@/components/projects/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const statusLabels: Record<string, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

type SortOrder = "newest" | "oldest" | "due_asc" | "due_desc" | "budget_high" | "budget_low";
type DueFilter = "all" | "overdue" | "due_soon" | "none";

const DEFAULTS = {
  search: "",
  status: "all",
  client: "all",
  due: "all" as DueFilter,
  sort: "newest" as SortOrder,
};

function compareNullable(a: number | null, b: number | null, ascending: boolean) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return ascending ? a - b : b - a;
}

interface ProjectsListProps {
  projects: Project[];
  clientOptions: ClientOption[];
  error?: boolean;
}

export function ProjectsList({ projects, clientOptions, error }: ProjectsListProps) {
  const [search, setSearch] = useState(DEFAULTS.search);
  const [statusFilter, setStatusFilter] = useState(DEFAULTS.status);
  const [clientFilter, setClientFilter] = useState(DEFAULTS.client);
  const [dueFilter, setDueFilter] = useState<DueFilter>(DEFAULTS.due);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULTS.sort);

  const clientNameById = useMemo(
    () => new Map(clientOptions.map((client) => [client.id, client.name])),
    [clientOptions],
  );

  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== DEFAULTS.status ||
    clientFilter !== DEFAULTS.client ||
    dueFilter !== DEFAULTS.due ||
    sortOrder !== DEFAULTS.sort;

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    const dueSoonCutoffDate = new Date();
    dueSoonCutoffDate.setDate(dueSoonCutoffDate.getDate() + 7);
    const sevenDaysFromNow = dueSoonCutoffDate.toISOString().slice(0, 10);

    let result = projects;

    if (query) {
      result = result.filter((project) => {
        const clientName = project.client_id ? clientNameById.get(project.client_id) : null;
        return [project.name, clientName, project.project_type, project.notes].some((field) =>
          field?.toLowerCase().includes(query),
        );
      });
    }
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }
    if (clientFilter !== "all") {
      result = result.filter((project) => project.client_id === clientFilter);
    }
    if (dueFilter === "overdue") {
      result = result.filter(
        (project) =>
          project.due_date && project.due_date < today && project.status !== "completed",
      );
    } else if (dueFilter === "due_soon") {
      result = result.filter(
        (project) =>
          project.due_date &&
          project.due_date >= today &&
          project.due_date <= sevenDaysFromNow &&
          project.status !== "completed",
      );
    } else if (dueFilter === "none") {
      result = result.filter((project) => !project.due_date);
    }

    return [...result].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "due_asc":
          return compareNullable(
            a.due_date ? new Date(a.due_date).getTime() : null,
            b.due_date ? new Date(b.due_date).getTime() : null,
            true,
          );
        case "due_desc":
          return compareNullable(
            a.due_date ? new Date(a.due_date).getTime() : null,
            b.due_date ? new Date(b.due_date).getTime() : null,
            false,
          );
        case "budget_high":
          return compareNullable(a.budget, b.budget, false);
        case "budget_low":
          return compareNullable(a.budget, b.budget, true);
        default:
          return 0;
      }
    });
  }, [projects, search, statusFilter, clientFilter, dueFilter, sortOrder, clientNameById]);

  function clearFilters() {
    setSearch(DEFAULTS.search);
    setStatusFilter(DEFAULTS.status);
    setClientFilter(DEFAULTS.client);
    setDueFilter(DEFAULTS.due);
    setSortOrder(DEFAULTS.sort);
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            error
            icon={<IconFolder className="h-5 w-5" />}
            title="Couldn't load projects"
            description="Something went wrong fetching your projects. Try refreshing the page."
          />
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconFolder className="h-5 w-5" />}
            title="No projects yet"
            description="Add a project to start tracking it."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, client, type, or notes"
        aria-label="Search projects"
        className="w-full sm:max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-auto"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Select
          value={clientFilter}
          onChange={(event) => setClientFilter(event.target.value)}
          className="w-auto"
          aria-label="Filter by client"
        >
          <option value="all">All Clients</option>
          {clientOptions.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
        <Select
          value={dueFilter}
          onChange={(event) => setDueFilter(event.target.value as DueFilter)}
          className="w-auto"
          aria-label="Filter by due date"
        >
          <option value="all">All Due Dates</option>
          <option value="overdue">Overdue</option>
          <option value="due_soon">Due Soon</option>
          <option value="none">No Due Date</option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          className="w-auto"
          aria-label="Sort projects"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="due_asc">Due Date: Ascending</option>
          <option value="due_desc">Due Date: Descending</option>
          <option value="budget_high">Budget: High to Low</option>
          <option value="budget_low">Budget: Low to High</option>
        </Select>
        <Button type="button" variant="ghost" onClick={clearFilters} disabled={!isFiltered}>
          Clear Filters
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconFolder className="h-5 w-5" />}
              title="No projects match your filters"
              description="Try a different search term, status, or client."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {filteredProjects.map((project) => {
                const clientName = project.client_id
                  ? clientNameById.get(project.client_id)
                  : null;
                const dueDate = project.due_date
                  ? new Date(project.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : null;

                return (
                  <li
                    key={project.id}
                    className="relative flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
                  >
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="absolute inset-0"
                      aria-label={`View ${project.name}`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {project.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {[clientName, project.project_type, dueDate && `Due ${dueDate}`]
                          .filter(Boolean)
                          .join(" · ") || "No additional details"}
                      </p>
                    </div>
                    <div className="relative z-10 flex shrink-0 items-center gap-3">
                      {project.budget !== null && (
                        <span className="text-sm text-muted">
                          {currencyFormatter.format(project.budget)}
                        </span>
                      )}
                      <StatusBadge
                        status={project.status}
                        label={statusLabels[project.status] ?? project.status}
                      />
                      <EditProjectButton project={project} clientOptions={clientOptions} />
                      <DeleteProjectButton project={project} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
