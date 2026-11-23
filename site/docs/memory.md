# 记忆系统

`MemoryService` 是记忆的**统一门面**。引擎只调用 `context(session)` 一个接口，就能拿到会话历史和长期记忆。

## 分层

| 层 | 1.0 | 扩展阶段 |
|---|---|---|
| 会话记忆 | Session 持久化；超出上下文窗口时截断早期对话 | 摘要压缩 |
| 长期记忆 | 单个 `MEMORY.md` 文件，每轮整体注入；`save_memory` / `recall_memory` 关键词检索 | 自动抽取、向量检索 |
| 情景记忆 | — | 记录任务过程中的决策与结果 |

## 长期记忆：一份 MEMORY.md

`LongTermMemory` 操作 `.kuul/memory/MEMORY.md`，提供四个方法：

| 方法 | 行为 |
|---|---|
| `append` | 自动加日期标题，加文件锁 |
| `load` | 超过 4000 字时只保留最近的内容 |
| `recall(query, mode)` | 1.0 只支持 `keyword` 模式，接口已为 `semantic` 预留 |
| `truncateIfNeeded` | 控制文件体积 |

文件格式是 Markdown 列表，每条记忆带日期标题，不强制结构，由 LLM 自己理解。

## 记忆也是 Tool

`save_memory` / `recall_memory` 作为内置 Tool 注册，和其他 Tool 一样走同一条执行管线：同样要在 Profile 中授权，同样写审计。**何时记忆由 LLM 自行决定。**

```text
# 第一次对话
you   以后日报都用表格，每周五下午 5 点发
llm   → save_memory {"content": "日报用表格格式，每周五 17:00 发送"}

# 第二次对话（可以在重启之后）
MEMORY.md 被注入 system prompt → LLM 直接用上偏好
```

## 不缓存

每轮都重新读 `MEMORY.md`。这样 `save_memory` 写入后，下一轮马上可见。文件只有几 KB，读一次约 1–2 毫秒。扩展阶段再加内存缓存，并监听文件变更使缓存失效。

## USER.md 与 MEMORY.md

| 文件 | 谁来写 | kuul 的权限 | 定位 |
|---|---|---|---|
| `USER.md` | 用户手写 | 只读 | 初始设定 |
| `MEMORY.md` | Agent 写入 | 读写 | 成长记录 |

## 为什么 1.0 不引入向量库

主流向量库（Qdrant、Milvus、pgvector 等）都需要单独部署一个进程，和单进程“装好就跑”的定位冲突。关键词检索已经够跑通最短链路。扩展阶段在 pgvector（最成熟，需额外部署 PostgreSQL）和 JVector 等纯 Java 嵌入式索引（保持单进程）之间二选一，`recall(mode)` 的接口不变。
