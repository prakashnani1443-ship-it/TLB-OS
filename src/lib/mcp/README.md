# lib/mcp — future MCP integration

Reserved for TLB-OS's own MCP client/host layer — the app calling out to
MCP servers (e.g. a knowledge base, a scheduling tool, a CRM) as part of
its AI-agent features.

This is **not implemented yet** by design. `types.ts` defines the shape
config will take; `index.ts` is the entrypoint to build against.

Not to be confused with `.mcp.json` at the project root, which configures
`next-devtools-mcp` — a dev-only tool that lets coding agents (like Claude
Code) introspect the running Next.js dev server. That's unrelated to
anything TLB-OS serves to its own users.

## When implementing

1. `npm install @modelcontextprotocol/sdk`
2. Build a client in `client.ts` that reads `McpServerConfig[]` (from DB
   or env) and opens sessions per server.
3. Expose a typed `callTool(call: McpToolCall)` used by Server Actions /
   Route Handlers — never call MCP servers directly from Client Components.
