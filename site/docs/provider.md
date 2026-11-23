# 对接 LLM

kuul 通过统一的 **Provider** 抽象接入大模型。Agent 只按名称引用 Provider，不感知底层是哪家厂商。

## Provider 配置

Provider 在 `.kuul/kuul.yaml` 中声明：

```yaml
providers:
  deepseek:
    type: openai-compatible
    base_url: https://api.deepseek.com
    api_key: ${DEEPSEEK_API_KEY}
    model: deepseek-chat
  kimi:
    type: openai-compatible
    base_url: https://api.moonshot.cn/v1
    api_key: ${MOONSHOT_API_KEY}
    model: kimi-k2
  local:
    type: openai-compatible
    base_url: http://localhost:11434/v1
    model: qwen3
```

- **优先支持 OpenAI 兼容协议**：DeepSeek、Kimi 必须跑通，本地 Ollama / vLLM 走同一协议。
- `type` 首批支持 `openai-compatible` 和 `anthropic`，其他类型按需扩展。
- 密钥只能用 `${ENV}` 占位符引用，明文会被拒绝加载。

## 显式映射，而不是 Bean 扫描

`ProviderRegistry` 在启动时，按每一条配置**用代码直接创建** `ChatModel` 实例，建立“名称 → 实例”的映射表。

不靠扫描 Spring 容器里的 Bean：配置多个 Provider 时，容器里会有多个同类型的 Bean，Bean 名称也不一定等于 Provider 名称，扫描无法可靠区分。

## ProviderService

kuul 定义了自己的 `ProviderService` 接口，Spring AI 的 `ChatModel` 只是它的一种实现：

```text
chat(ProviderRequest) → ProviderResponse
  请求：消息列表、Tool 定义、参数
  响应：文本、tool_calls、Token 用量
```

这些类型都是 `kuul-core` 自己的领域模型，由适配层负责和 Spring AI 的类型互相转换。这样 Spring AI 的类型不会渗透进引擎，以后也可以换成其他实现。

::: warning Spring AI 只用一半
kuul 只用 Spring AI 做协议转换和 `@Tool` 的 JSON Schema 生成，并**关闭它的内部工具执行**（`internalToolExecutionEnabled=false`）。否则 Tool 会被执行两次，还会绕过 kuul 的策略和审计。
:::

## 成本透明

每次调用都写一条 `llm_calls` 记录：Provider、模型、Token 用量、延迟、状态。这是成本统计的依据，也会写入审计日志。

## 故障处理

- 失败统一包装成 `ProviderException`，对外返回 503；
- 1.0 不做自动容灾，但 Profile 中预留了 `provider.fallback` 字段，扩展阶段启用并加熔断。
