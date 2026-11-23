# Architecture Overview

**kuul is a single Spring Boot application, packaged as one executable JAR.** It runs its own ReAct loop as the engine, uses Spring AI only for protocol adaptation, and builds tool policy and audit into the tool pipeline from day one.

![kuul architecture](/images/en/09-tech-architecture.svg)

## Four layers

| Layer | Components | Responsibility |
|---|---|---|
| Access | Channel, Web Service | Messages in and out. Both entry points end up in `AgentService.process` |
| Engine | `ReActLoop`, `PromptBuilder`, `ToolExecutor` | The agent's brain. Does no work itself; orchestrates the capability layer |
| Capabilities | Provider, Memory, Tool, Governance | Reasoning, context and execution; governance cuts across every model and tool call |
| Foundation | Profiles, context loading, configuration, persistence | Engineering groundwork |

Two architectural principles:

1. **Converge**: every capability lives in one process with one store. LLMs and MCP servers are outside the application boundary, and kuul is tied to none of them.
2. **Decouple**: the engine talks to capabilities, and capabilities talk to the outside, only through interfaces. A new channel, provider or tool is an implementation at the edge; the engine doesn't change.

## Key technical decisions

| # | Decision | Choice | Why |
|---|---|---|---|
| D1 | Agent engine | Our own ReAct loop | A controllable core whose behavior we can tune |
| D2 | Spring AI boundary | Provider protocol conversion and `@Tool` schema generation only; **internal tool execution off** | Otherwise tools run twice and bypass kuul's policy and audit |
| D3 | Version line | Spring Boot 4 + Spring AI 2.x | Follow the mainline; most Chinese models speak the OpenAI protocol |
| D4 | Execution model | Synchronous blocking + virtual threads | Straightforward code; thousands of concurrent I/O waits on one node |
| D5 | Tool abstraction | One `KuulTool` interface | The engine doesn't care where a tool comes from; governance is written once |
| D6 | Governance | Policy checks and audit are fixed pipeline steps | Every call goes through them; nothing relies on callers opting in |
| D7 | Sandbox | Hardened application-level allowlists, no SecurityManager | SecurityManager is permanently disabled since JDK 24 |
| D8 | Persistence | SQLite + JDBC + Flyway; long-term memory in `MEMORY.md` | One file, zero ops |
| D9 | Process model | Single-process fat JAR; light and heavy CLI commands | Install and run; light commands start fast without Spring |

## Tech stack

| Area | Choice |
|---|---|
| Runtime | JDK 21+ (25 LTS recommended), virtual threads |
| Framework | Spring Boot 4.0.x |
| LLM access | Spring AI 2.x (OpenAI-compatible protocol) |
| MCP | Official MCP Java SDK (client), stdio and Streamable HTTP |
| HTTP | Spring MVC + virtual threads |
| CLI | Picocli |
| Persistence | SQLite + Spring JDBC (`JdbcClient`) + Flyway |
| Logging | SLF4J + Logback, JSON output, `trace_id` in MDC |
| Testing | JUnit 5, WireMock, scripted mock provider |

## Modules

![Maven modules](/images/en/11-module-structure.svg)

| Module | Responsibility |
|---|---|
| `kuul-core` | Engine, domain model, and interfaces such as `KuulTool`, `ProviderService`, `AuditSink`. **No Spring AI dependency** |
| `kuul-provider` | `ProviderRegistry`, Spring AI adapters, `llm_calls` records |
| `kuul-memory` | `MemoryService`, `LongTermMemory`, `MemoryTools` |
| `kuul-tool` | Built-in tools, `ToolRegistry`, MCP client, `SandboxChecker` |
| `kuul-governance` | `PolicyGuard`, `AuditService`, `Redactor`, `ConfigLoader` |
| `kuul-storage` | SQLite, Flyway, stores |
| `kuul-web` | Controllers, `ApiKeyFilter`, error handling |
| `kuul-channel` | Terminal channel |
| `kuul-cli` | Picocli entry point |
| `kuul-boot` | Assembles everything into the fat JAR |

## Performance targets

| Metric | Target | How |
|---|---|---|
| Concurrency | ≥ 10 agents and ≥ 100 concurrent sessions per node | One virtual thread per request; carrier threads are released while waiting on the LLM |
| Session creation | P99 < 200 ms | SQLite WAL + a single writer thread |
| Internal overhead | < 50 ms (excluding LLM time) | Only one SQLite read and one `MEMORY.md` read on the hot path |
| Deployment | A newcomer deploys a single node in 30 minutes | One JAR, no external dependencies |
