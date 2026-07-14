import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <form className="flex w-full max-w-sm flex-col gap-4 p-6">
        <h1 className="text-xl font-semibold">Log in to TLB-OS</h1>
        <Input type="email" placeholder="Email" autoComplete="email" />
        <Input type="password" placeholder="Password" autoComplete="current-password" />
        <Button type="submit">Log in</Button>
      </form>
    </div>
  );
}
