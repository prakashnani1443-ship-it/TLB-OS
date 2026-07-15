"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  IconClose,
  IconFolder,
  IconHome,
  IconInbox,
  IconSettings,
  IconUsers,
} from "@/components/ui/icons";

const iconMap = {
  home: IconHome,
  folder: IconFolder,
  users: IconUsers,
  inbox: IconInbox,
  settings: IconSettings,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile/tablet backdrop — closes the drawer on outside click */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-surface transition-transform duration-200 ease-out",
          "lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            {siteConfig.name}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-muted hover:bg-surface-hover lg:hidden"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2" aria-label="Dashboard navigation">
          {dashboardNav.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-surface-hover",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
