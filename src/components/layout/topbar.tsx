import { UserMenu } from "@/components/auth/user-menu";
import { IconMenu } from "@/components/ui/icons";

interface TopbarProps {
  onMenuClick: () => void;
  userEmail: string;
}

export function Topbar({ onMenuClick, userEmail }: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        aria-controls="dashboard-sidebar"
        className="rounded-md p-1.5 text-muted hover:bg-surface-hover lg:hidden"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <UserMenu email={userEmail} />
    </header>
  );
}
