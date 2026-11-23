# REST API

<Badge type="info" text="设计目标" /> REST API 是业务系统集成 kuul 的唯一通道。1.0 同步返回，提供 10 个端点，统一以 `/api/v1` 为前缀。

## 端点

| 分类 | 方法与路径 | 说明 |
|---|---|---|
| 会话 | `POST /sessions` | 创建会话 |
| | `POST /sessions/{id}/messages` | 在会话中发消息，跑完整的 ReAct 循环 |
| | `GET /sessions/{id}` | 查询会话与历史（最多最近 100 条） |
| | `DELETE /sessions/{id}` | 归档会话 |
| 调用 | `POST /agents/{name}/invoke` | 无状态的单次调用，适合短任务 |
| 查询 | `GET /profiles` | 已加载的 Profile |
| | `GET /memory` | 长期记忆 |
| | `GET /tools` | 已注册的 Tool |
| 系统 | `GET /health` | 健康检查（免鉴权） |
| | `GET /info` | 版本、Profile 数量、MCP Server 连接状态 |

## 集成方式

- **单次调用**：`POST /agents/{name}/invoke`，适合无状态短任务；
- **多轮会话**：先 `POST /sessions`，再多次 `POST /sessions/{id}/messages`，保持上下文；
- **事件触发**：告警、CI/CD、定时任务通过 HTTP 触发 Agent；
- 任何能发 HTTP 请求的语言都能接入。

## 鉴权

```http
Authorization: Bearer <api-key>
```

Key 从环境变量 `KUUL_API_KEYS` 读取，用常量时间比较。除 `/health` 外所有端点都要求鉴权，每次访问以 `api_access` 记入审计。

## 错误响应

所有错误使用统一结构：

```json
{
  "code": "SESSION_BUSY",
  "message": "Session is processing another message",
  "traceId": "7f3a2c...",
  "timestamp": "2026-11-23T10:00:00Z"
}
```

| 状态码 | 含义 |
|---|---|
| 400 | 参数错误 |
| 401 | 未鉴权 |
| 404 | 资源不存在 |
| 409 | 会话正忙（同一 Session 同时只处理一条消息） |
| 500 | 内部错误 |
| 503 | Provider 故障；`/health` 发现依赖不可用 |
| 504 | 超时（单次 Agent 调用最长 60 秒） |

## 约束

| 项 | 约定 |
|---|---|
| 单条消息 | 最大 32 KB |
| 会话历史查询 | 最多返回最近 100 条 |
| 超时 | 每次 Agent 调用最长 60 秒 |
| CORS | 默认关闭，需要时通过配置开放 |
| `/health` | 检查数据库和各 Provider 连通性，结果缓存 30 秒 |

扩展阶段会补齐 Profile / Memory 的增删改、调用历史、Webhook、OpenAPI 文档，以及 SSE 流式输出。
