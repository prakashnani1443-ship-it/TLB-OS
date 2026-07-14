import type { NextConfig } from "next";

// Baseline hardening headers. Deliberately does NOT include a
// Content-Security-Policy here — a strict CSP needs nonce-based script
// handling wired through proxy.ts and thorough testing to avoid breaking
// Next.js's own hydration/dev tooling; that's tracked as a follow-up
// rather than risked as a quick fix.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Stop leaking the framework fingerprint via X-Powered-By.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
