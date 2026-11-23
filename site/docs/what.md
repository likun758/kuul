# kuul 是什么

**kuul 是一个 Java 原生、私有部署、可审计的企业级 Agent OS（Agent 统一底座）。** 它本身就是一个 Spring Boot 应用，打包成单个 JAR；多个业务 Agent 跑在它上面，共享模型、工具、记忆、渠道和治理能力。

::: warning 项目状态
kuul 处于早期阶段：设计文档已完成，Maven 工程骨架已搭好，1.0 的功能正在开发中。本站描述的是 1.0 的设计目标，标注 <Badge type="info" text="设计目标" /> 的内容尚不可用。
:::

## 业务方只做两件事

- **配 Profile**：Agent 是配置出来的，一份 YAML 定义一个 Agent，不需要写代码；
- **写 Tool**：任何语言，通过 [MCP](https://modelcontextprotocol.io/) 接入。

消息从哪来、模型怎么调、身份怎么管、审计怎么落、上下文怎么续，都由 kuul 负责。Agent 也可以由告警、CI/CD、定时任务等通过 HTTP 触发，自主运行。

## Agent OS 与 Agent runtime

**Agent OS 和 agent runtime 不是一回事。** runtime 是单个 Agent 的执行内核；Agent OS 包含 runtime，并在它之上加上多 Agent 管理、统一接入、多租户和审计。打个比方：runtime 是进程，Agent OS 是操作系统。

一个合格的 Agent OS 要具备五项能力：

| 能力 | 说明 |
|---|---|
| Agent 配置与生命周期 | 注册、启动、监控、销毁多个 Agent。Agent 是配置出来的 |
| 统一对外渠道 | IM、邮件、Web、HTTP API，所有 Agent 共用 |
| 统一对内接入 | LLM、MCP 工具、企业 IT 系统、知识库，所有 Agent 共用 |
| 统一记忆 | 跨会话的长期记忆、可复用的 Skill、跨 Agent 的知识沉淀 |
| 工具调用与沙箱 | 通过 Function Calling 调用 Tool，Tool 在隔离环境中执行 |

## kuul 在技术栈中的位置

![Agent OS 在技术栈中的位置](/images/01-agentos-positioning.svg)

| 类别 | 代表 | 与 kuul 的关系 |
|---|---|---|
| 编排平台 | Dify、Coze | 互补：它们做编排，可以跑在 kuul 之上 |
| Agent 框架 | Spring AI、LangChain4j | 复用：kuul 的 LLM 接入层直接用它们 |
| 云托管平台 | Bedrock AgentCore、Agentforce | 不同象限：云平台是“托管的企业级”，kuul 是“自主掌控的企业级” |
| 个人 Agent OS | OpenClaw、Hermes | 同类、不同定位：kuul 借鉴已验证的设计，补上企业治理 |

一句话：**框架给的是代码，编排平台给的是流程，kuul 给的是运行时本身。**

## 四个关键词

| 关键词 | 含义 |
|---|---|
| 完全掌控 | Apache 2.0 开源，私有部署，可接本地模型，数据不出边界 |
| Java 原生 | 就是一个 Spring Boot 应用，复用企业现有的中间件和运维体系 |
| 私有可审计 | 模型调用、工具调用、数据访问全部结构化留痕 |
| 统一底座 | 多个 Agent 共享渠道、模型、记忆、工具和治理能力 |

## 不做什么

- 可视化 workflow 编排（Dify 一类平台可以作为客户端调用 kuul）；
- Agent 编程框架；
- 模型本身；
- SaaS 优先形态；
- 不受审批约束的自我进化。

## 下一步

- [为什么需要 kuul](./why)：企业为什么需要一个私有可控的 Agent 底座；
- [核心概念](./concepts)：Profile、Provider、Session、Tool、Skill、Workspace；
- [架构概览](./architecture)：四层结构与 Tool 执行管线。
