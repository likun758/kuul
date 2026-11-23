# Core Concepts

| Concept | Definition |
|---|---|
| **Profile** | The complete YAML configuration of one agent; one Profile is one agent |
| **Provider** | A unified LLM abstraction; agents don't know which vendor is behind it |
| **ReAct loop** | The LLM decides whether to call a tool → execute → observe → continue, until it gives a final answer |
| **Tool** | Built-in tools plus plugin tools (SKILL.md + MCP, your own MCP server, `@Tool` beans) |
| **Skill** | An instruction template written as `SKILL.md`, following the open Agent Skills standard and compatible with OpenClaw / Hermes |
| **Session** | A conversation context, keyed by channel + user + Profile |
| **Channel** | A message entry point such as the CLI or IM. HTTP access belongs to the Web Service |
| **Workspace** | The instance directory `.kuul/`, holding profiles, skills, memory, plugins, data, logs and bootstrap files |

## Profile: agents are configured

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
```

The `tools` list is the agent's grant list: **any tool not listed is denied**. See [Configuration & Profile](./configuration) for all fields.

## A Skill is not a Tool

A Skill is prompt input: a piece of Markdown describing how to get something done with which tools. The context loader injects it into the system prompt; it is never called as a tool. Any tool a Skill uses must still be granted explicitly in the Profile.

## Bootstrap files

These Markdown files in the workspace are injected into every prompt:

| File | Written by | Purpose |
|---|---|---|
| `SOUL.md` | You | The agent's identity and persona; the default identity prompt |
| `AGENTS.md` | You | Behavioral rules and conventions |
| `USER.md` | You (read-only to kuul) | Initial user settings and preferences |
| `MEMORY.md` | The agent | Long-term memory — what the agent has learned |

Injection order: identity (`SOUL.md`) → `AGENTS.md` → `USER.md` → Skills → `MEMORY.md` → conversation history. Identity and rules come first, then preferences and skills; the most volatile part, long-term memory, sits last, right next to the conversation.

## Workspace layout

```text
.kuul/
├── kuul.yaml            # providers, sandbox, server port
├── mcp_servers.yaml     # external MCP servers
├── AGENTS.md  SOUL.md  USER.md
├── profiles/            # one YAML per agent
├── skills/<name>/SKILL.md
├── memory/MEMORY.md     # long-term memory
├── plugins/             # JARs with @Tool beans
├── data/kuul.db         # SQLite
└── logs/{app,audit}/    # application and audit logs
```

Profiles, bootstrap files, Skills, `MEMORY.md` and MCP configuration are all plain files: easy to edit, track in git and back up.
