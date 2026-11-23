# ReAct 循环

ReAct 循环是 kuul 的引擎：LLM 推理是否调用工具 → 执行 → 观察结果 → 继续，直到给出最终响应。核心循环自己实现，不依赖框架自带的 Agent 抽象。

![ReAct 循环与 Tool 执行管线](/images/10-react-loop.svg)

## 引擎组件

| 组件 | 职责 |
|---|---|
| `AgentService` | 统一入口，接收 `AgentRequest(profile, sessionId, message)`，返回 `AgentResponse(content, iterations, toolCalls, traceId, stopReason)` |
| `ReActLoop` | 核心循环：迭代计数、截止时间检查、消息累积 |
| `PromptBuilder` | 拼出 system 部分，再加上近 N 轮对话历史和当前 Profile 可用的 Tool 定义 |
| `ToolExecutor` | 按六步管线执行 Tool 调用；任何异常都转成 `ToolResult`，不让异常抛出循环 |

## 循环步骤

1. 用户消息追加到 Session；
2. 组装 Prompt；
3. 调用 LLM；
4. 没有 `tool_calls` 就返回最终响应；
5. 有 `tool_calls` 就逐个走 Tool 管线，结果作为 tool 消息回填；
6. 回到第 2 步。

每轮 Prompt 由五部分组成：system prompt、Bootstrap 文件、`MEMORY.md`、对话历史、可用 Tool。

## 终止条件

| 条件 | 默认值 |
|---|---|
| 给出最终响应 | — |
| 达到 `max_iterations` | 10，可在 Profile 中覆盖 |
| 超过整体截止时间 | 60 秒 |
| Provider 故障 | — |

终止原因写入 `stopReason`。

## 关键设计

- **顺序执行**：一次响应里有多个 Tool 调用时，按顺序执行。
- **重试**：Tool 失败时按 `retryable` 标识重试（指数退避，最多 3 次），失败原因回传给 LLM。
- **消息累积**：assistant 的 `tool_calls` 和对应的 tool 结果都完整写入 Session，调用链可以回放、可以审计。
- **上下文窗口**：保留 system 部分，加上最近 `max_history_turns` 轮（默认 20）；超出的部分直接丢弃，扩展阶段改为摘要压缩。
- **会话互斥**：同一个 Session 同一时间只处理一条消息，并发请求返回 409。
- **Tool 输出不可信**：Tool 结果用固定的分隔标记包裹后才回填，防止工具输出里夹带的指令被当成系统指令。
- **可追踪**：每次 LLM 调用和 Tool 调用都写结构化日志，用 `trace_id` 串联。

## 会话生命周期

- 活跃 Session 的每条消息都实时落库，重启后从 SQLite 恢复；
- 后台定时任务把空闲超过 `session.idle_timeout`（默认 30 分钟）的 Session 标记为 archived，归档后仍可查询。

## 1.0 不做

并行 Tool 调用、子 Agent 委托、流式输出——这些在[路线图](./roadmap)的扩展阶段。
