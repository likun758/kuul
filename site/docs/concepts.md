# 核心概念

| 概念 | 定义 |
|---|---|
| **Profile** | 一个 Agent 的完整 YAML 配置，一个 Profile 对应一个 Agent |
| **Provider** | LLM 的统一抽象，Agent 不感知底层是哪家厂商 |
| **ReAct 循环** | LLM 推理是否调用工具 → 执行 → 观察结果 → 继续，直到给出最终响应 |
| **Tool** | 内置 Tool 加上 Plugin Tool（SKILL.md + MCP、自写 MCP Server、`@Tool` Bean） |
| **Skill** | 用 `SKILL.md` 描述的指令模板，遵循 Agent Skills 开放标准，可与 OpenClaw / Hermes 互通 |
| **Session** | 对话上下文容器，按 Channel + 用户 + Profile 区分 |
| **Channel** | 消息入口，如 CLI、IM。HTTP 接入归 Web Service |
| **Workspace** | 实例工作目录 `.kuul/`，包含 profiles、skills、memory、plugins、data、logs 与 Bootstrap 文件 |

## Profile：Agent 是配置出来的

```yaml
name: ops-assistant
identity:
  agent_name: 运维助手
  prompt_file: SOUL.md
provider:
  name: deepseek
  temperature: 0.2
tools: [read_file, http_get, shell, save_memory, recall_memory, github.*]
skills: [daily-pr-digest]
```

`tools` 列表就是该 Agent 的授权清单：**未列出的 Tool 一律拒绝**。完整字段见 [配置与 Profile](./configuration)。

## Skill 不是 Tool

Skill 本质上是 prompt 的输入：一段描述“怎么用哪些工具完成某件事”的 Markdown。它由上下文加载器注入 system prompt，而不是被当作 Tool 调用。Skill 里用到的工具，仍然要在 Profile 中显式授权。

## Bootstrap 文件

工作区根目录下的三个 Markdown 文件会注入每一轮 Prompt：

| 文件 | 谁来写 | 作用 |
|---|---|---|
| `SOUL.md` | 用户 | Agent 的身份与人格，默认作为 identity prompt |
| `AGENTS.md` | 用户 | 行为规则与约定 |
| `USER.md` | 用户手写，kuul 只读 | 用户的初始设定与偏好 |
| `MEMORY.md` | Agent 写入 | 长期记忆，Agent 的成长记录 |

注入顺序：identity（`SOUL.md`）→ `AGENTS.md` → `USER.md` → Skills → `MEMORY.md` → 对话历史。先确定身份和规则，再加入偏好和技能；最易变的长期记忆放在最后，紧挨对话历史。

## 工作区结构

```text
.kuul/
├── kuul.yaml            # Provider、沙箱、服务端口
├── mcp_servers.yaml     # 外部 MCP Server
├── AGENTS.md  SOUL.md  USER.md
├── profiles/            # 每个 Agent 一份 YAML
├── skills/<name>/SKILL.md
├── memory/MEMORY.md     # 长期记忆
├── plugins/             # @Tool Bean 的 JAR
├── data/kuul.db         # SQLite
└── logs/{app,audit}/    # 应用日志与审计日志
```

Profile、Bootstrap、Skill、`MEMORY.md`、MCP 配置都放在文件里，方便直接编辑、用 git 跟踪和备份。
