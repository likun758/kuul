# 架构概览

**kuul 是一个 Spring Boot 单体应用，打包成一个可执行 JAR。** 它自己实现 ReAct 循环作为引擎，Spring AI 只用来做协议适配，Tool Policy 和审计从第一天就内建在 Tool 执行管线里。

![kuul 技术架构](/images/09-tech-architecture.svg)

## 四层结构

| 层 | 组件 | 职责 |
|---|---|---|
| 接入层 | Channel、Web Service | 消息进出。两个入口最后都调用 `AgentService.process` |
| 引擎层 | `ReActLoop`、`PromptBuilder`、`ToolExecutor` | Agent 的大脑。自己不干具体的活，负责调度能力层 |
| 能力层 | Provider、Memory、Tool、Governance | 推理、上下文和执行能力；Governance 横切每一次模型调用和工具调用 |
| 基础层 | Profile、上下文加载、配置、持久化 | 工程地基 |

两条架构原则：

1. **收敛**：所有能力都在一个进程、一套存储里。LLM 和 MCP Server 在应用边界之外，kuul 不绑定任何一家。
2. **解耦**：引擎和能力、能力和外部之间都只通过接口交互。新增 Channel、Provider 或 Tool 时只在边缘加实现，不改引擎。

## 关键技术决策

| # | 决策 | 选择 | 理由 |
|---|---|---|---|
| D1 | Agent 引擎 | 自己实现 ReAct 循环 | 核心可控，循环行为可以定制 |
| D2 | Spring AI 的边界 | 只做 Provider 协议转换和 `@Tool` Schema 生成，**关闭内部工具执行** | 否则 Tool 会被执行两次，还会绕过 kuul 的策略和审计 |
| D3 | 版本线 | Spring Boot 4 + Spring AI 2.x | 跟主线走；国产模型基本都兼容 OpenAI 协议 |
| D4 | 执行模型 | 同步阻塞 + 虚拟线程 | 代码直观，单机能扛住几千个并发 IO 等待 |
| D5 | Tool 抽象 | 统一的 `KuulTool` 接口 | 引擎不需要知道 Tool 从哪来，治理逻辑只写一处 |
| D6 | 治理 | Policy 校验和审计是执行管线的固定步骤 | 每次调用都必然经过，不靠调用方自觉 |
| D7 | 沙箱 | 应用层白名单并加固，不用 SecurityManager | SecurityManager 从 JDK 24 起永久禁用 |
| D8 | 持久化 | SQLite + JDBC + Flyway；长期记忆用 `MEMORY.md` | 单文件、零运维 |
| D9 | 进程形态 | 单进程 fat JAR；CLI 命令分轻、重两类 | 装好就跑；轻命令不启动 Spring，启动快 |

## 技术栈

| 层面 | 选型 |
|---|---|
| 运行时 | JDK 21+（推荐 25 LTS），虚拟线程 |
| 应用框架 | Spring Boot 4.0.x |
| LLM 接入 | Spring AI 2.x（OpenAI 兼容协议） |
| MCP | 官方 MCP Java SDK（Client 端），stdio 与 Streamable HTTP |
| HTTP 服务 | Spring MVC + 虚拟线程 |
| 命令行 | Picocli |
| 持久化 | SQLite + Spring JDBC（`JdbcClient`）+ Flyway |
| 日志 | SLF4J + Logback，JSON 输出，`trace_id` 放在 MDC |
| 测试 | JUnit 5、WireMock、脚本化的模拟 Provider |

## 工程结构

![Maven 多模块结构](/images/11-module-structure.svg)

| 模块 | 职责 |
|---|---|
| `kuul-core` | 引擎、领域模型，以及 `KuulTool`、`ProviderService`、`AuditSink` 等接口。**不依赖 Spring AI** |
| `kuul-provider` | `ProviderRegistry`、Spring AI 适配、`llm_calls` 记录 |
| `kuul-memory` | `MemoryService`、`LongTermMemory`、`MemoryTools` |
| `kuul-tool` | 内置 Tool、`ToolRegistry`、MCP Client、`SandboxChecker` |
| `kuul-governance` | `PolicyGuard`、`AuditService`、`Redactor`、`ConfigLoader` |
| `kuul-storage` | SQLite、Flyway、各类 Store |
| `kuul-web` | Controller、`ApiKeyFilter`、异常处理 |
| `kuul-channel` | 终端交互 Channel |
| `kuul-cli` | Picocli 入口 |
| `kuul-boot` | 组装所有模块，打包成 fat JAR |

## 性能目标

| 指标 | 目标 | 怎么达到 |
|---|---|---|
| 并发 | 单节点 ≥ 10 个 Agent、≥ 100 个并发 Session | 每个请求一个虚拟线程，等待 LLM 时让出系统线程 |
| Session 创建 | P99 < 200 ms | SQLite WAL + 单写线程 |
| 内部转发开销 | < 50 ms（不含 LLM 耗时） | 热路径上只有一次 SQLite 读、一次 `MEMORY.md` 读 |
| 部署 | 新手 30 分钟内完成单节点部署 | 单 JAR、零外部依赖 |
