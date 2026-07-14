import { StatCard } from "@/components/dashboard/stat-card";
import { IconFolder, IconInbox, IconUpload, IconUsers } from "@/components/ui/icons";

// Static placeholder values for this UI milestone — no backend query yet.
const stats = [
  { label: "Active Projects", value: "4", hint: "Across all clients", icon: IconFolder },
  { label: "Clients", value: "12", hint: "3 onboarded this month", icon: IconUsers },
  { label: "Tasks Due", value: "7", hint: "Next 7 days", icon: IconInbox },
  { label: "Storage Used", value: "2.1 GB", hint: "of 10 GB", icon: IconUpload },
] as const;

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          hint={stat.hint}
          icon={<stat.icon className="h-5 w-5" />}
        />
      ))}
    </div>
  );
}
