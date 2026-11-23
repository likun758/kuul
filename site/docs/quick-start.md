# 快速开始

## 前置条件

- **JDK 21+**（推荐 25 LTS）。kuul 使用虚拟线程。
- 不需要单独安装 Maven：仓库自带 Maven Wrapper（`./mvnw`）。
- 至少一个 LLM Provider 的 API Key（DeepSeek、Kimi 等），或本地的 Ollama / vLLM。

## 构建 <Badge type="tip" text="可用" />

```bash
git clone https://github.com/likun758/kuul.git
cd kuul
./mvnw package
```

产物是 `kuul-boot/target/kuul.jar`。验证一下：

```bash
java -jar kuul-boot/target/kuul.jar --version
# kuul 0.1.0-SNAPSHOT
```

CLI 的轻命令也可以单独运行，不启动 Spring：

```bash
java -jar kuul-cli/target/kuul-cli-0.1.0-SNAPSHOT-exec.jar --version
```

下文把 `java -jar kuul.jar` 简写为 `kuul`。

## 初始化工作区 <Badge type="info" text="设计目标" />

```bash
kuul init
```

生成 `.kuul/` 目录、三个 Bootstrap 文件、`kuul.yaml` 模板和一份开箱即用的默认 Profile，并初始化数据库。已存在的文件不会被覆盖。

## 配置模型 <Badge type="info" text="设计目标" />

在 `.kuul/kuul.yaml` 中声明 Provider，密钥只通过环境变量注入：

```yaml
providers:
  deepseek:
    type: openai-compatible
    base_url: https://api.deepseek.com
    api_key: ${DEEPSEEK_API_KEY}
    model: deepseek-chat
```

```bash
export DEEPSEEK_API_KEY=sk-...
```

::: danger 不要把明文密钥写进配置
Profile 和 `kuul.yaml` 中出现明文密钥时，kuul 会直接拒绝加载。
:::

## 对话 <Badge type="info" text="设计目标" />

```bash
kuul chat                     # 交互对话，/quit 退出
kuul chat --message "你好"    # 单条消息
```

## 启动 HTTP 服务 <Badge type="info" text="设计目标" />

```bash
export KUUL_API_KEYS=your-api-key
kuul serve                    # 默认端口 8080
```

```bash
curl -X POST http://localhost:8080/api/v1/agents/default/invoke \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"message": "今天上海天气怎么样？"}'
```

::: tip
请求体格式以 1.0 发布时的 [REST API](./api) 文档为准。
:::

## 1.0 的验收 Demo

1.0 发布前，以下 5 个 Demo 必须跑通：

| Demo | 验证内容 |
|---|---|
| 1 | Agent 调天气 API，再用文件 Tool 写日报（LLM + ReAct + 内置 Tool） |
| 2 | 第一次对话告知偏好，第二次对话（可在重启后）能引用（Memory） |
| 3 | 通过 SKILL.md + 外部 MCP Server 完成跨工具任务（Plugin Tool） |
| 4 | 外部系统通过 REST 完成“创建会话 → 发消息 → 归档”（Web Service） |
| 5 | 未授权的 Tool 调用和无效 API Key 都被拒绝，并能在审计日志中查到（治理基线） |
