# ReAct Loop

The ReAct loop is kuul's engine: the LLM decides whether to call a tool → execute → observe the result → continue, until it gives a final answer. The core loop is written in-house rather than taken from a framework's agent abstraction.

![ReAct loop and tool pipeline](/images/en/10-react-loop.svg)

## Engine components

| Component | Responsibility |
|---|---|
| `AgentService` | Single entry point. Takes `AgentRequest(profile, sessionId, message)`, returns `AgentResponse(content, iterations, toolCalls, traceId, stopReason)` |
| `ReActLoop` | The core loop: iteration count, deadline checks, message accumulation |
| `PromptBuilder` | Builds the system part, then adds the last N turns of history and the tools available to this Profile |
| `ToolExecutor` | Runs each tool call through the six-step pipeline; every exception becomes a `ToolResult` and never escapes the loop |

## Loop steps

1. Append the user message to the session;
2. Build the prompt;
3. Call the LLM;
4. No `tool_calls`? Return the final answer;
5. Otherwise run each call through the tool pipeline and feed results back as tool messages;
6. Go back to step 2.

Every prompt has five parts: the system prompt, bootstrap files, `MEMORY.md`, conversation history and the available tools.

## Stop conditions

| Condition | Default |
|---|---|
| Final answer given | — |
| `max_iterations` reached | 10, overridable per Profile |
| Overall deadline exceeded | 60 seconds |
| Provider failure | — |

The reason is recorded in `stopReason`.

## Key design points

- **Sequential execution**: multiple tool calls in one response run in order.
- **Retries**: failed tools with the `retryable` flag are retried with exponential backoff, up to 3 times; the failure reason is passed back to the LLM.
- **Full history**: the assistant's `tool_calls` and the matching tool results are all stored in the session, so a call chain can be replayed and audited.
- **Context window**: keep the system part plus the last `max_history_turns` turns (default 20); older turns are dropped. Summarization comes later.
- **One message at a time**: a session processes one message at a time; concurrent requests get 409.
- **Untrusted tool output**: tool results are wrapped in fixed delimiters before being fed back, so instructions hidden in tool output aren't treated as system instructions.
- **Traceable**: every LLM and tool call writes a structured log entry, linked by `trace_id`.

## Session lifecycle

- Every message of an active session is persisted immediately and restored from SQLite after a restart;
- A background job marks sessions idle longer than `session.idle_timeout` (default 30 minutes) as archived; archived sessions can still be queried.

## Not in 1.0

Parallel tool calls, sub-agent delegation and streaming output are in the later phases of the [roadmap](./roadmap).
