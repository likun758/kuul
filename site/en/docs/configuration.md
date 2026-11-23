# Configuration & Profile

<Badge type="info" text="design target" /> The formats below come from the technical design and may change slightly before 1.0.

## kuul.yaml

Instance-level configuration: providers, sandbox allowlists, server port.

```yaml
providers:
  deepseek:
    type: openai-compatible
    base_url: https://api.deepseek.com
    api_key: ${DEEPSEEK_API_KEY}
    model: deepseek-chat

sandbox:              # global ceiling; Profiles can only narrow it
  file:
    allowed_paths: [./workspace]
  shell:
    allowed_commands: [kubectl, git, ls, cat]
  http:
    allowed_domains: ["*.github.com", api.weather.example]

server:
  port: 8080
```

## Profile

One Profile is one agent, stored at `.kuul/profiles/<name>.yaml`:

```yaml
name: ops-assistant
identity:
  agent_name: Ops Assistant
  prompt_file: SOUL.md
provider:
  name: deepseek
  temperature: 0.2
tools: [read_file, http_get, shell, save_memory, recall_memory, github.*]
skills: [daily-pr-digest]
policy:
  file:
    allowed_paths: [./workspace]
  shell:
    allowed_commands: [kubectl, git]
bootstrap: [AGENTS.md, SOUL.md, USER.md]
settings:
  max_iterations: 10
  max_history_turns: 20
```

| Field | Content |
|---|---|
| `name` | Profile name, i.e. the agent name |
| `identity` | Name, description, persona prompt (or a reference to `SOUL.md`) |
| `provider` | Provider name, model, parameters; `fallback` is reserved |
| `tools` | Available tools — the grant list. Supports `github.*`; high-risk tools must be listed individually |
| `skills` | Skills to use |
| `policy` | Resource allowlists; can only narrow `sandbox` in `kuul.yaml` |
| `channels` | Bound channels |
| `bootstrap` | Bootstrap files to inject |
| `settings` | Overrides for `max_iterations` and `max_history_turns` |

Profiles are validated against a JSON Schema at load time, and referenced providers, tools and bootstrap files must exist. Invalid configuration is reported with its field path; a Profile that fails validation doesn't block startup, but it isn't registered.

## mcp_servers.yaml

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

## Environment variables

| Variable | Purpose |
|---|---|
| `KUUL_API_KEYS` | Keys for the REST API |
| `DEEPSEEK_API_KEY`, `MOONSHOT_API_KEY`, … | Model secrets referenced as `${...}` in config |

## Defaults

| Item | Default |
|---|---|
| `max_iterations` | 10 |
| `max_history_turns` | 20 |
| Agent call timeout | 60 seconds |
| `session.idle_timeout` | 30 minutes |
| Max message size | 32 KB |
| Shell output limit | 64 KB |
| HTTP port | 8080 |
