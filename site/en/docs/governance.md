# Governance Baseline

kuul puts **governance first**: tool policy, audit logs, API authentication and external secrets are not deferred to later phases — they are in 1.0.

## The tool pipeline

Every tool call goes through the same pipeline. Governance is a fixed step in it, not something callers opt into:

```text
a. Validate arguments (JSON Schema)
b. PolicyGuard: is the tool granted in this Profile? Not declared → denied
c. SandboxChecker: path / command / domain allowlists
d. Execute (timeouts, resource limits)
e. Audit: write tool_invocations + an AuditEvent
f. Wrap the result in delimiters and return it to the LLM
```

A denied call returns the reason to the LLM and is audited as `policy_denied`.

## Tool policy

| Item | Rule |
|---|---|
| Deny by default | The Profile's `tools` list is the allowlist; anything not declared is denied |
| Namespace wildcards | Wildcards like `github.*` are supported |
| High-risk tools | `shell`, `write_file`, `http_post` can't be granted by wildcard; they must be listed individually |
| Narrowing resources | A Profile's `policy` section can only narrow the global sandbox allowlists |

Deny rules and argument-level constraints come in later phases.

## Audit

`AuditService` receives `AuditEvent`s and hands them to an `AuditSink`. In 1.0 that is `JsonlAuditSink`, appending daily to `logs/audit/audit-YYYY-MM-DD.jsonl`.

| Field | Meaning |
|---|---|
| `trace_id` · `timestamp` | Links everything in one request; when it happened |
| `actor` | The OS user for CLI calls; the API key ID for API calls |
| `tenant_id` | Always `default` in 1.0; reserved for multi-tenancy |
| `profile` · `action` · `target` | Which agent, did what, to what |
| `summary` · `outcome` | Redacted argument summary; result status |

`action` is one of `llm_call`, `tool_call`, `policy_denied`, `api_access`.

Audit data lives in two places: the JSONL file is an append-only audit trail, while the `tool_invocations` and `llm_calls` tables are queryable records. They are linked by `trace_id`.

```bash
kuul audit tail    # show recent audit entries
```

## Redaction

`Redactor` redacts before anything is written: fields such as `api_key`, `token` and `password` are masked, and long arguments are truncated.

## API authentication

Every endpoint except `/health` requires an API key:

- Header `Authorization: Bearer <key>`;
- Keys are read from the `KUUL_API_KEYS` environment variable and compared in constant time;
- Later phases replace this with a Spring Security filter chain for SSO / RBAC.

## Secrets

- Secrets are injected only through environment variables or a separate secrets file, referenced in config as `${ENV}` placeholders;
- `ConfigLoader` validates them at load time and reports "file + field path + variable name" when one is missing;
- **A Profile containing a plain-text secret is rejected outright.**

## Extension points reserved for later

| Capability | Where it plugs in |
|---|---|
| Multi-tenancy | `sessions` and `AuditEvent` already carry `tenant_id` |
| SSO / RBAC | Replace `ApiKeyFilter` with a Spring Security filter chain |
| Human approval | Insert an `ApprovalGate` between steps b and d so high-risk tools are approved before they run |
| Container sandbox | Add a `ToolRunner` interface to move execution from in-process to containers |
| SIEM / tamper evidence | Add `AuditSink` implementations; hash-chain the JSONL |
