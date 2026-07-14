// Shape for TLB-OS's own future MCP integration (the app acting as an
// MCP client/host to orchestrate external tools for AI-OS features).
// This is separate from `next-devtools-mcp` (see .mcp.json), which is
// dev-tooling only and exposes the Next.js dev server to coding agents.
//
// No runtime implementation yet — add it here once a first real
// integration is needed, using @modelcontextprotocol/sdk.

export interface McpServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface McpToolCall {
  server: string;
  tool: string;
  input: Record<string, unknown>;
}
