# What is kuul

**kuul is a Java-native, self-hosted, auditable Agent OS for the enterprise — a single foundation for all your agents.** It is itself a Spring Boot application, packaged as one JAR. Many business agents run on it and share models, tools, memory, channels and governance.

::: warning Project status
kuul is at an early stage: the design documents are complete, the Maven project skeleton is in place, and 1.0 is under development. This site describes the 1.0 design target; anything marked <Badge type="info" text="design target" /> is not available yet.
:::

## Teams do just two things

- **Write a Profile**: agents are configured, not coded. One YAML file defines one agent.
- **Bring Tools**: in any language, connected over [MCP](https://modelcontextprotocol.io/).

Where messages come from, how models are called, how identity is managed, how actions are audited and how context carries over — kuul takes care of it. Agents can also be triggered over HTTP by alerts, CI/CD or schedulers and run on their own.

## Agent OS vs. agent runtime

**An Agent OS is not the same as an agent runtime.** A runtime is the execution core of a single agent. An Agent OS contains a runtime and adds multi-agent management, unified access, multi-tenancy and audit on top. Think of it this way: the runtime is a process; the Agent OS is the operating system.

A proper Agent OS provides five capabilities:

| Capability | Description |
|---|---|
| Agent configuration & lifecycle | Register, start, monitor and retire many agents. Agents are configured, not coded |
| Unified outbound channels | IM, email, web, HTTP API — shared by all agents |
| Unified inbound integration | LLMs, MCP tools, enterprise IT systems, knowledge bases — shared by all agents |
| Unified memory | Long-term memory across sessions, reusable Skills, knowledge shared across agents |
| Tool calling & sandbox | Tools are called via function calling and run in an isolated environment |

## Where kuul sits in the stack

![Where an Agent OS sits in the stack](/images/en/01-agentos-positioning.svg)

| Category | Examples | Relationship to kuul |
|---|---|---|
| Orchestration platforms | Dify, Coze | Complementary: they orchestrate and can run on top of kuul |
| Agent frameworks | Spring AI, LangChain4j | Reused: kuul's LLM layer is built on them |
| Cloud platforms | Bedrock AgentCore, Agentforce | Different quadrant: "managed enterprise" vs. kuul's "self-controlled enterprise" |
| Personal Agent OSes | OpenClaw, Hermes | Same category, different focus: kuul adopts their proven design and adds enterprise governance |

In one line: **frameworks give you code, orchestrators give you flows, kuul gives you the runtime itself.**

## Four keywords

| Keyword | Meaning |
|---|---|
| Fully yours | Apache 2.0, self-hosted, works with local models, data never leaves your boundary |
| Java-native | Just a Spring Boot app that reuses your existing middleware and operations stack |
| Auditable | Model calls, tool calls and data access all leave a structured trail |
| One foundation | Many agents share channels, models, memory, tools and governance |

## What kuul does not do

- Visual workflow orchestration (platforms like Dify can call kuul as a client);
- An agent programming framework;
- Models themselves;
- SaaS-first delivery;
- Self-evolution that is not subject to approval.

## Next

- [Why kuul](./why): why enterprises need a private, controllable agent foundation;
- [Core Concepts](./concepts): Profile, Provider, Session, Tool, Skill, Workspace;
- [Architecture](./architecture): the four layers and the tool pipeline.
