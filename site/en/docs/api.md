# REST API

<Badge type="info" text="design target" /> The REST API is the single integration surface for business systems. In 1.0 it responds synchronously and offers 10 endpoints, all under the `/api/v1` prefix.

## Endpoints

| Group | Method & path | Description |
|---|---|---|
| Sessions | `POST /sessions` | Create a session |
| | `POST /sessions/{id}/messages` | Send a message in a session; runs the full ReAct loop |
| | `GET /sessions/{id}` | Get a session and its history (latest 100 messages at most) |
| | `DELETE /sessions/{id}` | Archive a session |
| Invoke | `POST /agents/{name}/invoke` | Stateless one-shot call for short tasks |
| Query | `GET /profiles` | Loaded Profiles |
| | `GET /memory` | Long-term memory |
| | `GET /tools` | Registered tools |
| System | `GET /health` | Health check (no auth) |
| | `GET /info` | Version, number of Profiles, MCP server connection status |

## Integration patterns

- **One-shot**: `POST /agents/{name}/invoke` for stateless short tasks;
- **Multi-turn**: `POST /sessions` once, then `POST /sessions/{id}/messages` repeatedly to keep context;
- **Event-driven**: alerts, CI/CD and schedulers trigger agents over HTTP;
- Any language that can send HTTP requests can integrate.

## Authentication

```http
Authorization: Bearer <api-key>
```

Keys are read from the `KUUL_API_KEYS` environment variable and compared in constant time. Every endpoint except `/health` requires a key, and every access is audited as `api_access`.

## Errors

All errors share one shape:

```json
{
  "code": "SESSION_BUSY",
  "message": "Session is processing another message",
  "traceId": "7f3a2c...",
  "timestamp": "2026-11-23T10:00:00Z"
}
```

| Status | Meaning |
|---|---|
| 400 | Invalid parameters |
| 401 | Not authenticated |
| 404 | Resource not found |
| 409 | Session busy (one message at a time per session) |
| 500 | Internal error |
| 503 | Provider failure; or `/health` found a dependency down |
| 504 | Timeout (an agent call runs at most 60 seconds) |

## Limits

| Item | Rule |
|---|---|
| Message size | 32 KB max |
| Session history | Latest 100 messages at most |
| Timeout | 60 seconds per agent call |
| CORS | Off by default; enable in configuration when needed |
| `/health` | Checks the database and every provider; result cached for 30 seconds |

Later phases add create/update/delete for Profiles and Memory, call history, webhooks, OpenAPI docs and SSE streaming.
