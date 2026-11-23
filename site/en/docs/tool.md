# Tool System

Tools are how agents reach the real world beyond the model. kuul wraps tools from every source into one `KuulTool` type, so the engine doesn't care where a tool comes from and governance is written exactly once.

## The KuulTool abstraction

```text
KuulTool   { name, description, inputSchema (JSON Schema), risk (LOW | HIGH),
             execute(input, ToolContext) → ToolResult }
ToolResult { ok, content, error, retryable }
```

`ToolRegistry` is the global tool pool. The tools a Profile can see are the **intersection** of that pool and the Profile's policy.

## Built-in tools

| Tool | Constraints | Risk |
|---|---|---|
| `read_file` / `list_dir` | Path allowlist | LOW |
| `write_file` | Path allowlist, file size limit | **HIGH** |
| `shell` | Command allowlist, timeout, output limit | **HIGH** |
| `http_get` | Domain allowlist | LOW |
| `http_post` | Domain allowlist | **HIGH** |
| `save_memory` / `recall_memory` | — | LOW |

High-risk tools must be listed one by one in the Profile; they can't be granted by wildcard.

## Three ways to extend

![Three ways to add plugin tools](/images/en/08-tool-extension.svg)

Prefer the earlier option whenever it works:

| Option | How | Good for |
|---|---|---|
| **No code** | `skills/<name>/SKILL.md` + an existing MCP server | Combining tools the community already built |
| **Low code** | Your own MCP server (any language); kuul connects as an MCP client | Internal systems |
| **Full code** | A Spring bean annotated with `@Tool`, JAR dropped into `.kuul/plugins/` | Reusing existing Java services directly, with the best performance |

## MCP

`McpClientService` reads `.kuul/mcp_servers.yaml`, connects to each server, calls `tools/list` and wraps every tool as a `KuulTool`:

```yaml
github:
  transport: stdio
  command: npx
  args: [-y, "@modelcontextprotocol/server-github"]
  env:
    GITHUB_TOKEN: ${GITHUB_TOKEN}
crm:
  transport: http
  url: https://crm.internal/mcp
  headers:
    Authorization: "Bearer ${CRM_TOKEN}"
```

- stdio and Streamable HTTP are supported, based on the MCP 2026-07-28 specification;
- Tool names are namespaced as `<server>.<tool>` (e.g. `github.list_pull_requests`) to avoid clashes; a Profile can grant a whole group with `github.*`;
- If a server is unavailable, it is flagged in the logs and reconnected in the background with backoff. Startup isn't blocked; that server's tools are simply not registered yet.

## SKILL.md

A Skill is prompt input, injected into the system prompt by the context loader — **it is not a tool**. Its frontmatter follows the Agent Skills standard (`name`, `description`):

```markdown
---
name: daily-pr-digest
description: Summarize yesterday's merged PRs and post them to the team channel
---

1. Use github.list_pull_requests to fetch PRs merged yesterday;
2. Group them by module with a one-line summary each;
3. Post the digest to #dev-daily with slack.post_message.
```

Every tool a Skill uses must still be granted explicitly in the Profile.

## Sandbox hardening

Allowlists live in the `sandbox` section of `kuul.yaml` as a global ceiling; a Profile can only **narrow them, never widen them**.

| Type | Checks |
|---|---|
| Files | Normalize the path, resolve symlinks with `toRealPath`, and require the result to stay inside an allowed root — no escaping via `../` or symlinks; per-file size limit |
| Shell | **No `bash -c`**: run via `ProcessBuilder` with an argument array; the first argument must be on the command allowlist; reject metacharacters such as `;` `\|` `&` `$(` and redirects; timeout and a 64 KB output limit |
| HTTP | http / https only; hostnames matched against a wildcard allowlist; **redirects followed manually** and re-checked at every hop; response size limit |

::: warning An application-level allowlist is not real isolation
The 1.0 sandbox is a hardened application-level allowlist and is not suitable for highly sensitive production use. A container sandbox (rootless containers, resource quotas, network policy, read-only root filesystem) arrives in P0.
:::
