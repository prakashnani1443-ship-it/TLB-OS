import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">TLB-OS</h1>
      <p className="max-w-md text-muted">
        The AI Operating System for TLB Studio.
      </p>
      <div className="flex gap-3">
        <Link href="/login">
          <Button variant="primary">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button variant="secondary">Sign up</Button>
        </Link>
      </div>
    </div>
  );
}
