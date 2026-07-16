"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconInbox } from "@/components/ui/icons";
import { EditTaskButton } from "@/components/tasks/edit-task-button";
import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { cn } from "@/lib/utils";
import type { Task, ClientOption, ProjectOption } from "@/components/tasks/types";

const priorityLabels: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };
const priorityRank: Record<string, number> = { low: 1, medium: 2, high: 3 };
const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

type SortOrder = "newest" | "oldest" | "due_asc" | "due_desc" | "priority_high" | "priority_low";
type DueFilter = "all" | "overdue" | "today" | "due_soon" | "none";

const DEFAULTS = {
  search: "",
  status: "all",
  priority: "all",
  client: "all",
  project: "all",
  due: "all" as DueFilter,
  sort: "newest" as SortOrder,
};

function compareNullable(a: number | null, b: number | null, ascending: boolean) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return ascending ? a - b : b - a;
}

interface TasksListProps {
  tasks: Task[];
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
  error?: boolean;
}

export function TasksList({ tasks, clientOptions, projectOptions, error }: TasksListProps) {
  const [search, setSearch] = useState(DEFAULTS.search);
  const [statusFilter, setStatusFilter] = useState(DEFAULTS.status);
  const [priorityFilter, setPriorityFilter] = useState(DEFAULTS.priority);
  const [clientFilter, setClientFilter] = useState(DEFAULTS.client);
  const [projectFilter, setProjectFilter] = useState(DEFAULTS.project);
  const [dueFilter, setDueFilter] = useState<DueFilter>(DEFAULTS.due);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULTS.sort);

  const clientNameById = useMemo(
    () => new Map(clientOptions.map((client) => [client.id, client.name])),
    [clientOptions],
  );
  const projectNameById = useMemo(
    () => new Map(projectOptions.map((project) => [project.id, project.name])),
    [projectOptions],
  );

  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== DEFAULTS.status ||
    priorityFilter !== DEFAULTS.priority ||
    clientFilter !== DEFAULTS.client ||
    projectFilter !== DEFAULTS.project ||
    dueFilter !== DEFAULTS.due ||
    sortOrder !== DEFAULTS.sort;

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    const dueSoonCutoffDate = new Date();
    dueSoonCutoffDate.setDate(dueSoonCutoffDate.getDate() + 7);
    const sevenDaysFromNow = dueSoonCutoffDate.toISOString().slice(0, 10);

    let result = tasks;

    if (query) {
      result = result.filter((task) => {
        const clientName = task.client_id ? clientNameById.get(task.client_id) : null;
        const projectName = task.project_id ? projectNameById.get(task.project_id) : null;
        return [task.title, task.description, clientName, projectName].some((field) =>
          field?.toLowerCase().includes(query),
        );
      });
    }
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }
    if (clientFilter !== "all") {
      result = result.filter((task) => task.client_id === clientFilter);
    }
    if (projectFilter !== "all") {
      result = result.filter((task) => task.project_id === projectFilter);
    }
    if (dueFilter === "overdue") {
      result = result.filter(
        (task) => task.due_date && task.due_date < today && task.status !== "completed",
      );
    } else if (dueFilter === "today") {
      result = result.filter(
        (task) => task.due_date === today && task.status !== "completed",
      );
    } else if (dueFilter === "due_soon") {
      result = result.filter(
        (task) =>
          task.due_date &&
          task.due_date > today &&
          task.due_date <= sevenDaysFromNow &&
          task.status !== "completed",
      );
    } else if (dueFilter === "none") {
      result = result.filter((task) => !task.due_date);
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
        case "priority_high":
          return (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0);
        case "priority_low":
          return (priorityRank[a.priority] ?? 0) - (priorityRank[b.priority] ?? 0);
        default:
          return 0;
      }
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    clientFilter,
    projectFilter,
    dueFilter,
    sortOrder,
    clientNameById,
    projectNameById,
  ]);

  function clearFilters() {
    setSearch(DEFAULTS.search);
    setStatusFilter(DEFAULTS.status);
    setPriorityFilter(DEFAULTS.priority);
    setClientFilter(DEFAULTS.client);
    setProjectFilter(DEFAULTS.project);
    setDueFilter(DEFAULTS.due);
    setSortOrder(DEFAULTS.sort);
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            error
            icon={<IconInbox className="h-5 w-5" />}
            title="Couldn't load tasks"
            description="Something went wrong fetching your tasks. Try refreshing the page."
          />
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={<IconInbox className="h-5 w-5" />}
            title="No tasks yet"
            description="Add a task to start tracking it."
          />
        </CardContent>
      </Card>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by title, description, client, or project"
        aria-label="Search tasks"
        className="w-full sm:max-w-xs"
      />
      <div className="flex flex-wrap gap-3">
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="w-auto"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
        <Select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="w-auto"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
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
          value={projectFilter}
          onChange={(event) => setProjectFilter(event.target.value)}
          className="w-auto"
          aria-label="Filter by project"
        >
          <option value="all">All Projects</option>
          {projectOptions.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
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
          <option value="today">Due Today</option>
          <option value="due_soon">Due Soon</option>
          <option value="none">No Due Date</option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          className="w-auto"
          aria-label="Sort tasks"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="due_asc">Due Date: Ascending</option>
          <option value="due_desc">Due Date: Descending</option>
          <option value="priority_high">Priority: High to Low</option>
          <option value="priority_low">Priority: Low to High</option>
        </Select>
        <Button type="button" variant="ghost" onClick={clearFilters} disabled={!isFiltered}>
          Clear Filters
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconInbox className="h-5 w-5" />}
              title="No tasks match your filters"
              description="Try a different search term, status, or priority."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {filteredTasks.map((task) => {
                const clientName = task.client_id ? clientNameById.get(task.client_id) : null;
                const projectName = task.project_id ? projectNameById.get(task.project_id) : null;
                const isOverdue =
                  Boolean(task.due_date) && task.due_date! < today && task.status !== "completed";
                const dueDateFormatted = task.due_date
                  ? new Date(task.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : null;

                return (
                  <li
                    key={task.id}
                    className="relative flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-hover"
                  >
                    <Link
                      href={`/dashboard/tasks/${task.id}`}
                      className="absolute inset-0"
                      aria-label={`View ${task.title}`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                      <p className="truncate text-xs text-muted">
                        {[clientName, projectName].filter(Boolean).join(" · ") ||
                          "No additional details"}
                      </p>
                    </div>
                    <div className="relative z-10 flex shrink-0 items-center gap-3">
                      {dueDateFormatted && (
                        <span
                          className={cn(
                            "text-xs",
                            isOverdue ? "font-semibold text-danger" : "text-muted",
                          )}
                        >
                          {isOverdue ? `Overdue · ${dueDateFormatted}` : dueDateFormatted}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          task.priority === "high" ? "text-danger" : "text-muted",
                        )}
                      >
                        {priorityLabels[task.priority] ?? task.priority}
                      </span>
                      <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
                        {statusLabels[task.status] ?? task.status}
                      </span>
                      <EditTaskButton
                        task={task}
                        clientOptions={clientOptions}
                        projectOptions={projectOptions}
                      />
                      <DeleteTaskButton task={task} />
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
