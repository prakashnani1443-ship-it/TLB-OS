export const siteConfig = {
  name: "TLB-OS",
  description: "AI Operating System for TLB Studio",
} as const;

export const dashboardNav = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Projects", href: "/dashboard/projects", icon: "folder" },
  { label: "Clients", href: "/dashboard/clients", icon: "users" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
] as const;

export type DashboardNavItem = (typeof dashboardNav)[number];
