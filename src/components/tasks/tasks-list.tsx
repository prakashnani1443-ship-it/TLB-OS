"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { IconInbox } from "@/components/ui/icons";
import { EditTaskButton } from "@/components/tasks/edit-task-button";
import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { cn } from "@/lib/utils";
import type { Task, ClientOption, ProjectOption } from "@/components/tasks/types";

const priorityLabels: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };
const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

interface TasksListProps {
  tasks: Task[];
  clientOptions: ClientOption[];
  projectOptions: ProjectOption[];
  error?: boolean;
}

export function TasksList({ tasks, clientOptions, projectOptions, error }: TasksListProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const clientNameById = useMemo(
    () => new Map(clientOptions.map((client) => [client.id, client.name])),
    [clientOptions],
  );
  const projectNameById = useMemo(
    () => new Map(projectOptions.map((project) => [project.id, project.name])),
    [projectOptions],
  );

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    return true;
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
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
      </div>

      {error ? (
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
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<IconInbox className="h-5 w-5" />}
              title={tasks.length === 0 ? "No tasks yet" : "No tasks match these filters"}
              description={
                tasks.length === 0
                  ? "Add a task to start tracking it."
                  : "Try a different status or priority."
              }
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
