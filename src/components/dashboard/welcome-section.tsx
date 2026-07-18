interface WelcomeSectionProps {
  name: string;
}

export function WelcomeSection({ name }: WelcomeSectionProps) {
  return (
    <div className="border-b border-border pb-6">
      <p className="text-xs font-medium uppercase tracking-wide text-accent">Dashboard</p>
      <h1 className="font-heading mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
        Welcome back, {name}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Here&apos;s what&apos;s happening across TLB Studio today.
      </p>
    </div>
  );
}
