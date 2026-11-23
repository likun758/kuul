# Why kuul

## The demand is real; control is the hard part

- More than half of enterprises already run multi-step agents, and 80% report measurable returns (Anthropic, *2026 State of AI Agents*);
- Gartner predicts that more than 40% of agentic AI projects will be cancelled by 2027;
- The top three blockers are **integration (46%), data quality (42%) and change management (39%)**;
- Tool-poisoning attacks succeed up to 72.8% of the time (MCPTox), and "shadow agents" deployed by employees sit outside IT governance.

::: tip Bottom line
None of these problems is solved by a stronger model. They are solved by a steadier, more controllable foundation.
:::

## Four rules of regulated enterprises

Banks, government, telecom, energy and healthcare require that:

1. Data stays inside the enterprise;
2. Systems are fully auditable;
3. New components pass security and compliance review;
4. The tech stack matches what they already run.

Regulation keeps tightening: China's guidance on intelligent agents requires three levels of decision authority, making human approval, tiered permissions and action records mandatory; the EU AI Act's transparency obligations apply from August 2026.

Existing options don't fit these enterprises:

| Option | Problem |
|---|---|
| SaaS / cloud-hosted | Data leaves the enterprise; ecosystem lock-in |
| OpenClaw / Hermes as-is | Security incident history, permissive defaults, mismatched stack |
| Build it on a framework | Every team reinvents permissions, audit and isolation, each in its own way |

What enterprises need is **one shared foundation**: model access and quotas, identity and permissions, tool governance and audit should all be unified. It is the same logic that took us from hand-rolled thread pools to application servers, and then to Kubernetes.

## The gap left by open-source Agent OSes

OpenClaw (Node.js) and Hermes Agent (Python) defined what a personal Agent OS looks like, but both started with individuals and small teams. Together they leave five gaps:

1. No complete enterprise governance: multi-tenant RBAC, SSO, audit, compliance evidence;
2. Security is bolted on rather than built in: no skill signing, permission declarations, least privilege or credential custody;
3. Every company has to adapt its own ERP, CRM and CMDB integrations;
4. Mostly single-node, without clustering or high availability;
5. Nothing for the Java ecosystem.

## Java: frameworks yes, foundation no

62% of enterprises already build AI features in Java. Spring AI, LangChain4j and AgentScope Java have matured the "write an agent" layer, but the "run agents" layer is almost empty.

| Lever | Why it matters |
|---|---|
| Standard deployment | kuul is just a Spring Boot app; IT has nothing new to learn |
| Reused LLM access | Built directly on Spring AI |
| Reused ops tooling | Nacos, Sentinel, SkyWalking, Arthas, Prometheus |
| Cheap integration | Tools can call existing Java services directly, with no cross-language glue |
| Security & compliance ready | Spring Security, OIDC, Vault, plus existing code review and SBOM processes |

## Security: the opposite of OpenClaw

| Aspect | OpenClaw | kuul |
|---|---|---|
| Skill source | Open marketplace, trusted by default | Registered, reviewed and signed before use |
| Permissions | Broad by default | Least privilege, granted on demand |
| Isolation | Optional, via external hardening | Mandatory sandbox |
| Credentials | Often in plain-text config | Environment variables / secret files, KMS / Vault later |
| Injection & exfiltration | Left to the model | Tool output isolation, egress limits, approval for high-risk actions |
| Audit | Conversation logs only | End-to-end structured audit, SIEM-ready |

## Design principles

1. **Governance first**: identity, permissions, audit and isolation are kernel capabilities from day one.
2. **Least privilege by default**: capabilities must be granted explicitly; everything else is denied.
3. **Audit everything**: key actions go into a structured audit log.
4. **Deterministic kernel**: model output is untrusted input; high-risk actions go through a policy engine and human approval.
5. **Open standards**: SKILL.md, MCP, A2A, OpenTelemetry GenAI.
6. **Java-native, Spring-friendly**: a standard Spring Boot project that fits existing toolchains.
7. **Solid on a single node, without blocking the path to scale.**

> Vision: become the de facto Agent OS layer for the Java ecosystem — what Tomcat is to web apps — so every enterprise can run agents inside its own boundary, the way it runs services.
