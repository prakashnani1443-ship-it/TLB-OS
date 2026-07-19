"use client";

import dynamic from "next/dynamic";

// ssr: false only works from a Client Component (Next.js docs) — this
// tiny wrapper exists solely to satisfy that boundary. three.js never
// touches the server bundle or any other page.
const HeroScene = dynamic(
  () => import("@/components/landing/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false },
);

export function HeroVisual() {
  return (
    <div className="relative z-10">
      <HeroScene />
    </div>
  );
}
