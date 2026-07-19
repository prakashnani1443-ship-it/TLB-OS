import Link from "next/link";
import { Syne } from "next/font/google";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/landing/hero-visual";

// Hero title only — dashboard headings stay on Space Grotesk.
const syne = Syne({ subsets: ["latin"], weight: "800" });

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden bg-[#0B0F14] px-6 py-20 text-center">
      {/* Ambient teal/violet glow — decorative, matches the hero gem's palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 20%, rgba(0,194,209,0.16), transparent 70%), radial-gradient(50% 40% at 70% 70%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      <HeroVisual />

      <div className="relative z-10 space-y-3">
        <h1
          className={`${syne.className} bg-gradient-to-r from-accent to-white bg-clip-text text-4xl font-extrabold tracking-wide text-transparent sm:text-5xl`}
        >
          TLB-OS
        </h1>
        <p className="mx-auto max-w-md text-white/60">
          The AI Operating System for TLB Studio.
        </p>
      </div>

      <div className="relative z-10 flex gap-3">
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
