# Roadmap

![kuul roadmap](/images/en/05-evolution-roadmap.svg)

The direction: **single node → distributed foundation → distributed agent collaboration**. We make a single node solid first, because most enterprises start by getting one scenario running reliably; a single node is the easiest to adopt and to fit into existing operations and audit.

## Progress

- [x] Product research, requirements, extension analysis, technical design
- [x] Maven multi-module skeleton, CI
- [ ] US-1 LLM providers
- [ ] US-2 ReAct loop + governance skeleton
- [ ] US-3 Memory
- [ ] US-4 Tool system + full sandbox
- [ ] US-5 Web Service + wrap-up
- [ ] 1.0 release

Order: **US-1 → US-2 → (US-3 ∥ US-4) → US-5**.

## 1.0 Core <Badge type="tip" text="in progress" />

Runtime kernel + governance baseline: agents run, and many agents run side by side.

- Five capabilities: LLM providers, ReAct loop, Memory, Tool system, Web Service;
- Governance baseline: tool policy, audit log, API authentication, external secrets;
- Single-JAR deployment with CLI and REST API entry points.

1.0 is enough for an enterprise pilot, but not for highly sensitive production.

![Three waves of extensions](/images/en/14-extension-waves.svg)

## P0 Production-ready <Badge type="warning" text="planned" />

Without these, kuul can't pass an enterprise security review.

| Feature | Done when |
|---|---|
| SSO + RBAC + tenants | Log in with the corporate IdP (Keycloak / Entra ID / Okta); unauthorized access returns 403 and is audited; tenants can't see each other's data |
| Human approval | Tools can be set to one of three decision levels; calls that need approval wait until approved |
| Enterprise IM channels | WeCom, Feishu and DingTalk send and receive text, cards and approval callbacks |
| Tamper-evident audit + SIEM | Tampering with any record is detectable; push via Syslog / HTTP |
| Container sandbox | Shell and file tools run in rootless containers |

## P1 Operate at scale <Badge type="warning" text="planned" />

Once it's live, make it pleasant, cheap and stable: Skill signing and versioning, KMS / Vault, injection and exfiltration defenses, provider failover · streaming · quotas and rate limits, semantic memory and summarization, Web Service completion and scheduled jobs, admin console · observability · K8s, Slack / email / embeddable web channels, and a three-level organization model.

::: warning Hard gate
No community Skill imports until Skill signing is done — so we don't repeat the malicious-skill problems of ClawHub.
:::

## P2 Extend <Badge type="info" text="vision" />

Externalized state → clustered HA, episodic memory and turning experience into Skills (with approval), sub-agents · parallel tools · resumable long tasks, adaptive model routing, kuul as an MCP server · A2A exploration, enterprise system connectors, GraalVM Native Image, hot configuration reload.

## Foundations for going distributed

Scaling out and high availability later depend on **stateless instances with externalized state**:

| State | Moves to |
|---|---|
| Sessions | Redis |
| Long-term memory, Skills | PostgreSQL / pgvector |
| Audit, large files | Object storage, shipped to SIEM |
| Configuration, tenants | Config center + database |

## Community

Not scheduled; moves forward when someone contributes: a Skills marketplace (built on Skill signing), SDKs in more languages, a visual Profile editor, a K8s operator, a voice channel, documentation, and more.
