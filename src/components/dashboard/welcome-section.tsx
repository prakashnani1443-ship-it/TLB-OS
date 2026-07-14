interface WelcomeSectionProps {
  name: string;
}

export function WelcomeSection({ name }: WelcomeSectionProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Welcome back, {name}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Here&apos;s what&apos;s happening across TLB Studio today.
      </p>
    </div>
  );
}
