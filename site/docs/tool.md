# Tool 体系

Agent 通过 Tool 接触模型之外的真实世界。kuul 把所有来源的 Tool 统一包装成 `KuulTool`，引擎不需要知道 Tool 从哪来，治理逻辑也只写一处。

## KuulTool 抽象

```text
KuulTool   { name, description, inputSchema (JSON Schema), risk (LOW | HIGH),
             execute(input, ToolContext) → ToolResult }
ToolResult { ok, content, error, retryable }
```

`ToolRegistry` 是全局的 Tool 池。每个 Profile 看到的可用 Tool，是全局池与它的 Policy 的**交集**。

## 内置 Tool

| Tool | 约束 | 风险 |
|---|---|---|
| `read_file` / `list_dir` | 路径白名单 | LOW |
| `write_file` | 路径白名单、文件大小上限 | **HIGH** |
| `shell` | 命令白名单、超时、输出上限 | **HIGH** |
| `http_get` | 域名白名单 | LOW |
| `http_post` | 域名白名单 | **HIGH** |
| `save_memory` / `recall_memory` | — | LOW |

高风险 Tool 必须在 Profile 中逐个列出，不能用通配符授权。

## 三种扩展方式

![Plugin Tool 三种扩展方式](/images/08-tool-extension.svg)

能用前一种就不用后一种：

| 方式 | 做法 | 适合 |
|---|---|---|
| **零代码** | `skills/<name>/SKILL.md` + 现成的 MCP Server | 组合社区已有的工具 |
| **轻代码** | 自写 MCP Server（任何语言），kuul 作为 MCP Client 接入 | 对接内部系统 |
| **重代码** | 用 `@Tool` 注解标注 Spring Bean，JAR 放进 `.kuul/plugins/` | 直接复用企业现有 Java 服务，性能最好 |

## MCP 接入

`McpClientService` 读取 `.kuul/mcp_servers.yaml`，连接每个 Server，调用 `tools/list`，把每个工具包装成 `KuulTool`：

```yaml
github:
  transport: stdio
  command: npx
  args: [-y, "@modelcontextprotocol/server-github"]
  env:
    GITHUB_TOKEN: ${GITHUB_TOKEN}
crm:
  transport: http
  url: https://crm.internal/mcp
  headers:
    Authorization: "Bearer ${CRM_TOKEN}"
```

- 支持 stdio 和 Streamable HTTP，以 MCP 2026-07-28 版规范为基线；
- 工具名带命名空间 `<server>.<tool>`（如 `github.list_pull_requests`），避免重名；Profile 中可以用 `github.*` 授权一组工具；
- Server 不可用时在日志里标记，并在后台按退避策略重连。不阻断启动，这个 Server 的工具暂时不注册。

## SKILL.md

Skill 本质上是 prompt 的输入，由上下文加载器注入 system prompt，**不是 Tool**。frontmatter 遵循 Agent Skills 标准（`name`、`description`）：

```markdown
---
name: daily-pr-digest
description: 汇总昨天合并的 PR，发到团队频道
---

1. 用 github.list_pull_requests 拉取昨天合并的 PR；
2. 按模块归类，每条一句话总结；
3. 用 slack.post_message 发到 #dev-daily。
```

Skill 里用到的工具，仍然要在 Profile 中显式授权。

## 沙箱加固

白名单配置在 `kuul.yaml` 的 `sandbox` 段，是全局上限；Profile 只能在此基础上**收窄，不能放宽**。

| 类型 | 校验 |
|---|---|
| 文件 | 先标准化路径，再用 `toRealPath` 解析符号链接，结果必须落在允许的根目录内，防止 `../` 和符号链接逃逸；单个文件有大小上限 |
| Shell | **不经过 `bash -c`**，用 `ProcessBuilder` 按参数数组直接执行；第一个参数必须在命令白名单内；拒绝 `;` `\|` `&` `$(` 和重定向等元字符；有超时，输出上限 64 KB |
| HTTP | 只允许 http / https；主机名按通配符匹配白名单；**手动跟随重定向**，每一跳都重新校验；响应体有大小上限 |

::: warning 应用层白名单不等于真隔离
1.0 的沙箱是加固过的应用层白名单，不适合高敏感生产场景。容器级沙箱（rootless 容器、资源配额、网络策略、只读根文件系统）在 P0 阶段提供。
:::
