import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconFolder, IconPlus, IconSettings, IconUsers } from "@/components/ui/icons";

const actions = [
  { label: "New Project", href: "/dashboard/projects", icon: IconPlus },
  { label: "Add Client", href: "/dashboard/clients", icon: IconUsers },
  { label: "Browse Projects", href: "/dashboard/projects", icon: IconFolder },
  { label: "Settings", href: "/dashboard/settings", icon: IconSettings },
] as const;

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="hover-lift flex flex-col items-start gap-2.5 rounded-lg border border-border p-4 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-hover"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <action.icon className="h-4 w-4" />
              </span>
              {action.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
