# 治理基线

kuul 的原则是**治理优先**：Tool Policy、审计日志、API 鉴权、密钥外置这几项不留到扩展阶段，在 1.0 就具备。

## Tool 执行管线

每一次 Tool 调用都经过同一条管线，治理是其中的固定步骤，不靠调用方自觉：

```text
a. 参数校验（JSON Schema）
b. PolicyGuard：Profile 授权校验，未声明即拒绝
c. SandboxChecker：路径 / 命令 / 域名白名单
d. 执行（超时、资源上限）
e. 审计：tool_invocations 落库 + AuditEvent
f. 结果用分隔标记包裹后回填给 LLM
```

被拒绝的调用会把原因回传给 LLM，并以 `policy_denied` 记入审计。

## Tool Policy

| 项 | 规则 |
|---|---|
| 默认拒绝 | Profile 的 `tools` 列表就是 allow-list，未声明即拒绝 |
| 命名空间通配 | 支持 `github.*` 这样的通配 |
| 高风险 Tool | `shell`、`write_file`、`http_post` 不能通过通配符授权，必须单独列出 |
| 资源收窄 | Profile 的 `policy` 段只能在全局沙箱白名单上收窄 |

deny 规则和参数级约束放在扩展阶段。

## 审计

`AuditService` 接收 `AuditEvent`，交给 `AuditSink` 写出。1.0 的实现是 `JsonlAuditSink`：按天追加写入 `logs/audit/audit-YYYY-MM-DD.jsonl`。

| 字段 | 含义 |
|---|---|
| `trace_id` · `timestamp` | 串联同一次请求的链路，记录发生时间 |
| `actor` | CLI 调用记操作系统用户，API 调用记 API Key 的 ID |
| `tenant_id` | 1.0 固定为 `default`，为多租户预留 |
| `profile` · `action` · `target` | 哪个 Agent、做了什么、对象是谁 |
| `summary` · `outcome` | 脱敏后的参数摘要、结果状态 |

`action` 取值：`llm_call`、`tool_call`、`policy_denied`、`api_access`。

审计数据分两处存：JSONL 是只追加的审计流水；`tool_invocations` 和 `llm_calls` 两张表是可以查询的业务记录。两者通过 `trace_id` 关联。

```bash
kuul audit tail    # 查看最近的审计记录
```

## 脱敏

`Redactor` 先脱敏再落盘：`api_key`、`token`、`password` 等字段打码，过长的参数截断。

## API 鉴权

除 `/health` 外，所有端点都要求 API Key：

- 请求头 `Authorization: Bearer <key>`；
- Key 从环境变量 `KUUL_API_KEYS` 读取，用常量时间比较；
- 扩展阶段替换为 Spring Security 过滤器链，支持 SSO / RBAC。

## 密钥管理

- 密钥只通过环境变量或独立密钥文件注入，配置中用 `${ENV}` 占位符引用；
- `ConfigLoader` 加载时校验，缺失时报出“文件 + 字段路径 + 环境变量名”；
- **Profile 中出现明文密钥，直接拒绝加载。**

## 为扩展阶段预留的位置

| 扩展能力 | 预留位置 |
|---|---|
| 多租户 | `sessions` 表和 `AuditEvent` 已有 `tenant_id` 字段 |
| SSO / RBAC | 把 `ApiKeyFilter` 替换为 Spring Security 过滤器链 |
| 人工审批 | 在管线的 b 步和 d 步之间插入 `ApprovalGate`，高风险 Tool 先批后做 |
| 容器沙箱 | 新增 `ToolRunner` 接口，从进程内执行切换为容器执行 |
| SIEM / 防篡改 | 新增 `AuditSink` 实现；JSONL 加链式哈希 |
