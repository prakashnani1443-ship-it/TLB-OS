import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <form className="flex w-full max-w-sm flex-col gap-4 p-6">
        <h1 className="text-xl font-semibold">Create your TLB-OS account</h1>
        <Input type="email" placeholder="Email" autoComplete="email" />
        <Input type="password" placeholder="Password" autoComplete="new-password" />
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}
