# 配置与 Profile

<Badge type="info" text="设计目标" /> 以下格式来自技术方案，1.0 发布前可能微调。

## kuul.yaml

实例级配置：Provider、沙箱白名单、服务端口。

```yaml
providers:
  deepseek:
    type: openai-compatible
    base_url: https://api.deepseek.com
    api_key: ${DEEPSEEK_API_KEY}
    model: deepseek-chat

sandbox:              # 全局上限，Profile 只能收窄
  file:
    allowed_paths: [./workspace]
  shell:
    allowed_commands: [kubectl, git, ls, cat]
  http:
    allowed_domains: ["*.github.com", api.weather.example]

server:
  port: 8080
```

## Profile

一个 Profile 对应一个 Agent，放在 `.kuul/profiles/<name>.yaml`：

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
policy:
  file:
    allowed_paths: [./workspace]
  shell:
    allowed_commands: [kubectl, git]
bootstrap: [AGENTS.md, SOUL.md, USER.md]
settings:
  max_iterations: 10
  max_history_turns: 20
```

| 字段 | 内容 |
|---|---|
| `name` | Profile 名称，即 Agent 名称 |
| `identity` | 名称、描述、人格 prompt（或引用 `SOUL.md`） |
| `provider` | Provider 名、模型、参数；预留 `fallback` |
| `tools` | 可用 Tool，即授权清单；支持 `github.*` 通配，高风险 Tool 须单独列出 |
| `skills` | 引用的 Skill |
| `policy` | 资源白名单，只能在 `kuul.yaml` 的 `sandbox` 上收窄 |
| `channels` | 绑定的渠道 |
| `bootstrap` | 要注入的 Bootstrap 文件 |
| `settings` | 覆盖默认的 `max_iterations`、`max_history_turns` |

加载时用 JSON Schema 校验，并检查 Provider、Tool、Bootstrap 文件是否存在。非法配置会报出字段路径；校验失败的 Profile 不会阻断启动，但不会被注册。

## mcp_servers.yaml

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

## 环境变量

| 变量 | 用途 |
|---|---|
| `KUUL_API_KEYS` | REST API 的访问 Key |
| `DEEPSEEK_API_KEY`、`MOONSHOT_API_KEY` 等 | 在配置中以 `${...}` 引用的模型密钥 |

## 默认值

| 项 | 默认值 |
|---|---|
| `max_iterations` | 10 |
| `max_history_turns` | 20 |
| Agent 调用超时 | 60 秒 |
| `session.idle_timeout` | 30 分钟 |
| 单条消息上限 | 32 KB |
| Shell 输出上限 | 64 KB |
| HTTP 端口 | 8080 |
