import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
