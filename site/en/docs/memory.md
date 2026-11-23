# Memory

`MemoryService` is the **single facade** for memory. The engine calls just one method, `context(session)`, to get both conversation history and long-term memory.

## Layers

| Layer | 1.0 | Later |
|---|---|---|
| Session memory | Sessions are persisted; early turns are truncated when the context window is exceeded | Summarization |
| Long-term memory | One `MEMORY.md`, injected every turn; keyword search via `save_memory` / `recall_memory` | Automatic extraction, vector search |
| Episodic memory | — | Decisions and outcomes recorded during tasks |

## Long-term memory: one MEMORY.md

`LongTermMemory` works on `.kuul/memory/MEMORY.md` with four methods:

| Method | Behavior |
|---|---|
| `append` | Adds a date heading automatically; takes a file lock |
| `load` | Keeps only the most recent content beyond 4,000 characters |
| `recall(query, mode)` | `keyword` mode only in 1.0; the interface already reserves `semantic` |
| `truncateIfNeeded` | Keeps the file size in check |

The file is a Markdown list with a date heading per entry. There's no enforced structure; the LLM interprets it.

## Memory is a tool too

`save_memory` and `recall_memory` are registered as built-in tools and go through the same pipeline as any other tool: they must be granted in the Profile and they are audited. **The LLM decides when to remember.**

```text
# First conversation
you   From now on, send the daily report as a table, every Friday at 5 pm
llm   → save_memory {"content": "Daily report as a table, sent Fridays at 17:00"}

# Second conversation (possibly after a restart)
MEMORY.md is injected into the system prompt → the LLM uses the preference directly
```

## No caching

`MEMORY.md` is re-read on every turn, so anything written by `save_memory` is visible on the very next turn. The file is a few KB and takes about 1–2 ms to read. An in-memory cache with file-change invalidation comes later.

## USER.md vs. MEMORY.md

| File | Written by | kuul's access | Role |
|---|---|---|---|
| `USER.md` | You, by hand | Read-only | Initial settings |
| `MEMORY.md` | The agent | Read-write | What the agent has learned |

## Why no vector database in 1.0

Mainstream vector stores (Qdrant, Milvus, pgvector, …) all need a separate process, which conflicts with "one process, install and run". Keyword search is enough for the shortest path. Later phases will choose between pgvector (most mature, needs PostgreSQL) and a pure-Java embedded index such as JVector (keeps a single process); the `recall(mode)` interface stays the same.
