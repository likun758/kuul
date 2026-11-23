# CLI 命令

kuul 的 CLI 基于 Picocli，入口就是 `kuul.jar`。下文把 `java -jar kuul.jar` 简写为 `kuul`。

## 当前可用 <Badge type="tip" text="可用" />

```bash
kuul --version     # 打印版本：kuul 0.1.0-SNAPSHOT
kuul --help        # 打印帮助
kuul               # 不带参数：打印版本和用法
```

CLI 也可以不启动 Spring 单独运行（只包含轻命令）：

```bash
java -jar kuul-cli/target/kuul-cli-0.1.0-SNAPSHOT-exec.jar --version
```

## 命令一览 <Badge type="info" text="设计目标" />

| 命令 | 说明 | 类型 |
|---|---|---|
| `init` | 初始化 `.kuul/` 工作区，不覆盖已有文件 | 轻 |
| `profile list \| create \| show \| delete` | 管理 Profile | 轻 |
| `session list` | 列出会话 | 轻 |
| `audit tail` | 查看最近的审计记录 | 轻 |
| `chat` | 交互对话；`--message` 发单条消息；`/quit` 退出 | 重 |
| `serve` | 启动 HTTP 服务（默认 8080） | 重 |
| `gateway` | 常驻守护进程；1.0 等同于 `serve`，扩展阶段承载 IM 渠道 | 重 |
| `status` | 实例状态 | 重 |
| `provider list` | 列出 Provider 及连通性 | 重 |
| `tool list` | 列出已注册的 Tool | 重 |

## 轻命令与重命令

- **轻命令**不启动 Spring，直接读写文件或用 JDBC，亚秒级完成；
- **重命令**启动 Spring 上下文，需要初始化 Provider 和 MCP 连接，常驻服务启动 2–4 秒。

三种运行模式（`chat`、`serve`、`gateway`）只是接入层不同，共享同一份 Profile、同一套引擎和存储。

## 示例

```bash
kuul init
kuul profile create sales-insight
kuul chat --profile sales-insight
kuul chat --message "总结一下昨天的告警"
kuul serve
kuul audit tail
```
