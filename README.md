# TLB-OS

The AI Operating System for TLB Studio — built on Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Supabase, with a project structure ready for future MCP integration.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19.2) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / Auth / DB | Supabase (`@supabase/ssr`) |
| Future AI tool integration | MCP (structure reserved, not implemented yet) |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `/`, `/login`, `/signup`, and `/api/health` work with no configuration. `/dashboard` requires a real Supabase project in `.env.local` (it calls `auth.getUser()` and redirects to `/login` if there's no session).

## 1. Folder structure

```
TLB-OS/
├── .env.example              # documented env vars, copy to .env.local
├── .mcp.json                 # Next.js DevTools MCP config (dev-tooling only)
├── proxy.ts                  # Next 16 "proxy" (formerly middleware) — refreshes Supabase session
├── next.config.ts
├── public/                   # static assets served as-is
├── supabase/
│   └── migrations/           # SQL migrations (via Supabase CLI, once linked)
└── src/
    ├── app/                          # App Router — routes only
    │   ├── layout.tsx               # root layout, fonts, metadata
    │   ├── page.tsx                 # marketing / landing route "/"
    │   ├── globals.css              # Tailwind entry + design tokens
    │   ├── (auth)/                  # route group — no auth guard, no /auth prefix
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   ├── (dashboard)/             # route group — auth-guarded via layout
    │   │   ├── layout.tsx           # redirects to /login if no session
    │   │   └── dashboard/page.tsx
    │   └── api/
    │       └── health/route.ts      # GET /api/health
    ├── components/
    │   ├── ui/                      # small, presentational, no business logic (Button, Input, Card…)
    │   └── layout/                  # structural pieces (Navbar, Sidebar, Shell…)
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts            # browser client (Client Components)
    │   │   ├── server.ts            # server client (Server Components, Route Handlers)
    │   │   └── proxy.ts             # session-refresh helper used by root proxy.ts
    │   ├── mcp/                     # reserved for future MCP client/host layer (not implemented)
    │   └── utils.ts                 # cn() and other framework-agnostic helpers
    ├── hooks/                       # shared React hooks (client-side only)
    ├── types/
    │   ├── database.ts              # generated Supabase types (regenerate via CLI)
    │   └── index.ts                 # app-level shared types
    └── config/
        └── site.ts                  # nav, site name, constants — no secrets
```

## 2. Purpose of each folder

- **`app/`** — routing only. Every file here maps to a URL or a layout. Business logic does not live here; pages import from `components/` and `lib/`.
- **`app/(auth)`, `app/(dashboard)`** — [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups): the parentheses organize routes and let each group have its own `layout.tsx` (e.g. an auth guard) without adding a URL segment.
- **`app/api/`** — Route Handlers for anything that isn't a page: webhooks, health checks, third-party callbacks.
- **`components/ui/`** — small, reusable, presentation-only pieces. No data fetching, no Supabase calls.
- **`components/layout/`** — structural chrome shared across pages (nav, shells, sidebars).
- **`lib/supabase/`** — the only place Supabase clients are constructed. Everything else imports `createClient` from here instead of calling `createBrowserClient`/`createServerClient` directly, so there's one place to change if config changes.
- **`lib/mcp/`** — reserved, not implemented. Keeps a clear seam for adding MCP-based AI tool integrations later without restructuring the app. See [`src/lib/mcp/README.md`](src/lib/mcp/README.md).
- **`hooks/`** — client-side React hooks only (anything using `useState`/`useEffect`).
- **`types/`** — shared TypeScript types, including the generated Supabase `Database` type.
- **`config/`** — non-secret constants (site name, nav items). Never put keys here — use env vars.
- **`supabase/migrations/`** — SQL schema history once you link a real Supabase project via the CLI.

## 3. Recommended architecture

**Data flow:** Server Components fetch data directly via `lib/supabase/server.ts`. Client Components that need interactivity call Route Handlers or Server Actions — they never read `SUPABASE_SERVICE_ROLE_KEY` or hold elevated credentials.

**Auth:** `proxy.ts` (Next 16's renamed `middleware.ts`) refreshes the Supabase session cookie on every request. The `(dashboard)` route group's `layout.tsx` does the actual gate — checks `auth.getUser()` and redirects unauthenticated users to `/login`. Add new authenticated sections as siblings under `(dashboard)` and they inherit the guard for free.

**Route groups over deep nesting:** use `(auth)`, `(dashboard)`, and future groups like `(marketing)` or `(admin)` to separate concerns by layout/access level rather than by feature — keeps the URL structure flat and readable.

**Modules, not a monolith:** as TLB-OS grows, each product area (e.g. "clients," "projects," "billing") should get its own subfolder under `(dashboard)/` for routes, plus a matching folder under `components/` if its UI doesn't belong in `ui/` or `layout/`. Shared logic goes in `lib/`; feature-specific logic stays colocated with the feature.

**MCP:** two separate surfaces, don't conflate them:
- `.mcp.json` — Next.js's built-in DevTools MCP (`next-devtools-mcp`), lets coding agents like Claude Code introspect the *running dev server* (errors, routes, logs). Dev-only, already wired up.
- `src/lib/mcp/` — reserved for TLB-OS *itself* acting as an MCP client to orchestrate external tools as part of its own AI-agent features. Intentionally unimplemented until a real use case exists.

## 4. Best practices

- **Server Components by default.** Only add `"use client"` where you need interactivity, state, or browser APIs.
- **One Supabase entrypoint.** Always import from `lib/supabase/*`, never instantiate `createBrowserClient`/`createServerClient` inline.
- **Never expose `SUPABASE_SERVICE_ROLE_KEY`** to the client — no `NEXT_PUBLIC_` prefix, only use it inside Route Handlers/Server Actions that need to bypass RLS.
- **Regenerate `types/database.ts`** from the live schema instead of hand-writing it: `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.
- **Keep `proxy.ts` thin.** It should only refresh sessions/redirect — real authorization logic belongs in layouts and Server Actions, since a matcher change can silently stop covering a route.
- **Type-check and lint before shipping:** `npm run typecheck && npm run lint` (both are already clean on this scaffold).
- **Don't put secrets in `config/`** — that folder is for non-secret constants only; use `.env.local` (gitignored) for anything sensitive.
- **Row Level Security first.** Once real tables exist in Supabase, enable RLS before writing any client-side queries.

## 5. Future scalability plan

- **Feature folders:** as `(dashboard)` grows, split into `(dashboard)/clients/`, `(dashboard)/projects/`, etc., each with its own nested layout if it needs section-specific nav.
- **Shared UI → design system:** once `components/ui/` exceeds a handful of primitives, consider extracting it to its own workspace package (`packages/ui`) if TLB-OS becomes a monorepo with multiple apps (e.g. a public site + the OS).
- **MCP activation:** implement `lib/mcp/client.ts` with `@modelcontextprotocol/sdk` when the first AI-agent-facing feature needs to call an external tool. `McpServerConfig`/`McpToolCall` types already exist in `lib/mcp/types.ts`.
- **Background jobs:** add a `src/jobs/` folder or use Supabase Edge Functions once TLB-OS needs scheduled/async work (e.g. digest emails, AI batch processing).
- **Multi-tenant readiness:** `types/index.ts` already models `AppRole`; when multiple orgs/clients are needed, add an `organization_id` to RLS policies and a `lib/supabase/` helper that scopes queries by tenant.
- **Testing:** add `vitest` + `@testing-library/react` for components, and Playwright for e2e once there's enough surface area to justify it — deliberately omitted from this initial scaffold to keep it minimal.
- **CI:** wire `npm run typecheck`, `npm run lint`, and `npm run build` into GitHub Actions (or equivalent) before the first deploy.

## Known environment note

`npm audit` reports a moderate advisory in a transitive `postcss` dependency bundled inside Next.js itself. The suggested `npm audit fix --force` would downgrade Next.js to an old canary release — don't run it. Wait for an upstream Next.js patch instead.
