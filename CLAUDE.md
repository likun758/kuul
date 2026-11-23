# CLAUDE.md

kuul 是 **Java 原生、私有部署、可审计的企业级 Agent OS**：一个 Spring Boot 单体应用，打包成单个 fat JAR。多个 Agent 跑在它上面，共享模型、工具、记忆、渠道和治理能力。业务方只做两件事：写 YAML Profile 配置 Agent，用 MCP 写 Tool。

## 当前状态

- 已有 Maven 多模块工程骨架（10 个模块，能编译、测试、打包），业务功能尚未实现。
- 下一步是准备阶段：用 Spec-Kit 生成 `.specify/memory/constitution.md`、`spec.md`、`plan.md`，然后按 User Story 实施。
- 项目宪章生成之后，以 `.specify/memory/constitution.md` 为准；下文「不可违反的原则」是它的摘要。

## 设计文档（docs/init/）

阅读顺序：产品调研 → 需求分析 → 扩展分析 → 技术方案 → AI 编程指南。

| 文档 | 回答什么 | 什么时候看 |
|---|---|---|
| [ProductResearch.md](docs/init/ProductResearch.md) | 为什么做、定位、边界 | 判断某个功能该不该做 |
| [RequirementAnalysis.md](docs/init/RequirementAnalysis.md) | 核心阶段做什么、验收标准（5 个 Demo） | 实现任何功能前 |
| [ExtensionAnalysis.md](docs/init/ExtensionAnalysis.md) | 核心阶段之后的 P0 / P1 / P2 | 判断某项是否属于扩展功能 |
| [TechnicalSolution.md](docs/init/TechnicalSolution.md) | 架构、模块、关键决策 D1–D9 | 写代码时的主要依据 |
| [AIProgrammingGuide.md](docs/init/AIProgrammingGuide.md) | User Story 拆解、宪章、审查清单 | 开工前、提交前 |

文档与代码冲突时，以技术方案为准；需要改设计时先改文档，不要让代码悄悄偏离文档。

## 范围

- **核心阶段只做**：五大能力（对接 LLM、ReAct 循环、Memory、Tool 体系、Web Service）加治理基线（Tool Policy、审计、API Key、密钥外置）。
- **核心阶段不做**：多租户、SSO/RBAC、人工审批、IM 渠道、流式输出、并行 Tool、子 Agent、Provider 容灾、向量检索、K8s。这些属于扩展阶段，只保留技术方案 §13.3 列出的扩展点，不要顺手实现。
- **永远不做**：可视化编排、Agent 编程框架、模型本身、SaaS 优先形态、不受审批约束的自我进化。

## 不可违反的原则

| # | 原则 |
|---|---|
| C1 | JDK 21+（推荐 25）、Spring Boot 4.0.x、Spring AI 2.x；Maven 10 个模块；单个 fat JAR |
| C2 | 范围只有五大能力 + 治理基线，扩展功能不进主体开发 |
| C3 | ReAct 循环自己实现；`kuul-core` 不依赖 Spring AI，Spring AI 只出现在 `kuul-provider` 和 `kuul-tool` |
| C4 | Spring AI 只用协议适配和 `@Tool` Schema 生成，**必须关闭内部工具执行**（`internalToolExecutionEnabled=false`） |
| C5 | 所有 Tool 调用都走 `ToolExecutor` 六步管线：默认拒绝、每次审计、不给任何 Tool 开捷径；密钥不落明文 |
| C6 | Provider 用「名称 → 实例」显式映射，由 `ProviderRegistry` 按配置用代码创建，禁止按 Bean 类型扫描 |
| C7 | 存储用 SQLite + `JdbcClient` + Flyway + `MEMORY.md`；不用 JPA、不用 `ddl-auto`、不引入向量库 |
| C8 | 每个 Story 先写测试，结束时有可演示的 Demo 和 E2E 测试 |

宪章不允许 AI 自行修改。觉得某条原则有问题时，停下来告诉用户，不要绕过它。

## 架构要点

10 个 Maven 模块：

| 模块 | 职责 |
|---|---|
| `kuul-core` | 引擎（`ReActLoop`、`PromptBuilder`、`ToolExecutor`、`ContextLoader`）、领域模型、`KuulTool` / `ProviderService` / `AuditSink` 等接口 |
| `kuul-provider` | `ProviderRegistry`、Spring AI 适配、`llm_calls` 记录 |
| `kuul-memory` | `MemoryService`（统一门面）、`LongTermMemory`、`MemoryTools` |
| `kuul-tool` | 内置 Tool、`ToolRegistry`、MCP Client、`SandboxChecker` |
| `kuul-governance` | `PolicyGuard`、`AuditService`、`Redactor`、`ConfigLoader` |
| `kuul-storage` | SQLite、Flyway、各类 Store |
| `kuul-web` | 6 个 Controller、`ApiKeyFilter`、`GlobalExceptionHandler` |
| `kuul-channel` | 终端交互 Channel |
| `kuul-cli` | Picocli 入口，13 个命令 |
| `kuul-boot` | 组装所有模块，打包 fat JAR |

容易放错位置的几件事：

- **SKILL.md 不是 Tool**，它是 prompt 输入，由 `ContextLoader` 加载。Skill 用到的工具仍要在 Profile 里显式授权。
- **Memory 不并进 Session**：引擎只调用 `MemoryService.context(session)`。`save_memory` / `recall_memory` 是普通 `KuulTool`，同样走 Tool 管线。`MEMORY.md` 不加缓存，每轮重新读。
- **治理逻辑集中在 `ToolExecutor` 管线**，不要散落到各个 Tool 里。高风险 Tool（`shell`、`write_file`、`http_post`）不能通过通配符授权。
- **Prompt 注入顺序**：identity（默认 `SOUL.md`）→ `AGENTS.md` → `USER.md` → Skills → `MEMORY.md` → 对话历史。
- **Tool 输出不可信**：用固定分隔标记包裹后再回填。异常不能抛出 ReAct 循环，一律转成 `ToolResult`。
- **沙箱加固**：
  - Shell 用 `ProcessBuilder` 按参数数组执行，不经过 `bash -c`，拒绝 `; | & $(` 和重定向等元字符；
  - 文件路径先 `toRealPath` 再校验根目录；
  - HTTP 手动跟随重定向，每一跳都重新校验域名。
- **SQLite**：WAL 模式，所有写操作走单线程写执行器。调用记录必须真的落库，只写日志不算。
- **API Key** 用常量时间比较；除 `/health` 外所有端点都要鉴权。

## 开发流程

主体开发按 User Story 推进：**US-1 → US-2 →（US-3 ∥ US-4）→ US-5**，详见 AI 编程指南 §4。

每个 Story：

1. 开工前重读 `spec.md`、`plan.md` 和最近的代码；
2. 先写测试（用脚本化的模拟 Provider 覆盖循环分支，用 WireMock 模拟 LLM 和 HTTP），再实现；
3. 按下方审查清单自查；
4. 跑通对应 Demo 和 E2E 测试；
5. 提交并打 tag `us-N`。

每个 task 控制在改 1–2 个文件。增量阶段（Bug 修复、新增 Tool/端点）直接改代码并补测试，不必走 Spec-Kit 全流程。

## 构建与测试

用仓库自带的 Maven Wrapper（Maven 3.9.16），不需要本机装 Maven。需要 JDK 21+，本机 JDK 在 `~/Tools/Language/JVM/`，构建前设置 `JAVA_HOME`：

```bash
export JAVA_HOME=~/Tools/Language/JVM/jdk-21.0.8.jdk/Contents/Home
```

```bash
./mvnw package                          # 编译、测试、打包，产物是 kuul-boot/target/kuul.jar
./mvnw test                             # 只跑测试
./mvnw -pl kuul-core -am test           # 只测某个模块（及其依赖）
java -jar kuul-boot/target/kuul.jar --help
java -jar kuul-cli/target/kuul-cli-0.1.0-SNAPSHOT-exec.jar --version   # 独立 CLI，不含 Spring
```

计划中的运行命令（尚未实现）：`init`、`chat`、`serve`、`gateway` 等，见技术方案 §9.3。DeepSeek / Kimi 的真实 Key 冒烟测试单独执行，需要 `DEEPSEEK_API_KEY`、`MOONSHOT_API_KEY`。

工程约定：

- groupId `io.kuul`，包名 `io.kuul.<模块名>`；版本统一在根 `pom.xml` 管理，子模块不写版本号。
- 父 POM 继承 `spring-boot-starter-parent` 4.0.10；Spring AI 2.0.3、MCP SDK 2.1.0 通过 BOM 导入。
- 入口：`kuul-cli` 的 `io.kuul.cli.KuulCommand.main` 可独立运行（shade 出 `-exec.jar`，只含轻命令）；`kuul.jar` 的入口 `io.kuul.boot.KuulMain` 委托给 `KuulCommand.execute`，重命令再启动 `KuulApplication`（Spring）。`kuul-cli` 不能依赖 `kuul-boot`。
- fat JAR 使用 `PropertiesLauncher`（ZIP layout），以便通过 `loader.path` 加载 `.kuul/plugins/` 下的 JAR。
- 只用非 starter 的 Spring AI 模块（如 `spring-ai-openai`），不引入 Spring AI 的自动配置，Provider 由 `ProviderRegistry` 用代码创建（C6）。

## 提交前审查清单

- [ ] Spring AI 的内部工具执行已关闭（C4）
- [ ] Provider 按名称显式映射，没有按 Bean 类型扫描（C6）
- [ ] `kuul-core` 中没有 Spring AI 的 import（C3）
- [ ] 每条 Tool 调用路径都经过 `PolicyGuard` 和审计（C5）
- [ ] 高风险 Tool 不能通过通配符授权（C5）
- [ ] Shell、文件、HTTP 的沙箱加固完整（C5）
- [ ] 没有 JPA、`ddl-auto` 或向量库依赖（C7）
- [ ] `tool_invocations` / `llm_calls` 真的落库（C5）
- [ ] SKILL.md 没有被当成 Tool

## 注意事项

- 训练数据多以 Spring Boot 3 / Spring AI 1.x 为主，写 Boot 4 / Spring AI 2.x 时先查官方文档，不要凭记忆写 API。编译错误往往说明用了旧 API。
- MCP 以 2026-07-28 版规范为基线，MCP 相关代码收敛在 `McpClientService`。

## 文档约定

- 文档用中文，中英文之间加空格。
- 每份文档顶部保留版本行、文档导航和可折叠目录；关键结论用 GitHub 提示块（`[!NOTE]` / `[!TIP]` / `[!IMPORTANT]` / `[!WARNING]`），每份不超过 4 处。
- 插图放在 `docs/init/images/`，用 SVG。
