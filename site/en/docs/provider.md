# LLM Providers

kuul connects to models through a unified **Provider** abstraction. Agents reference a provider by name and never know which vendor is behind it.

## Provider configuration

Providers are declared in `.kuul/kuul.yaml`:

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

- **OpenAI-compatible first**: DeepSeek and Kimi must work; local Ollama / vLLM use the same protocol.
- `type` starts with `openai-compatible` and `anthropic`; more types are added as needed.
- Secrets can only be referenced as `${ENV}` placeholders; plain text is rejected.

## Explicit mapping, not bean scanning

At startup, `ProviderRegistry` **creates a `ChatModel` instance in code** for each entry and builds a name → instance map.

It does not scan the Spring context for beans: with several providers configured, the context holds several beans of the same type whose names don't necessarily match provider names, so scanning can't tell them apart reliably.

## ProviderService

kuul defines its own `ProviderService` interface; Spring AI's `ChatModel` is just one implementation of it:

```text
chat(ProviderRequest) → ProviderResponse
  request:  messages, tool definitions, parameters
  response: text, tool_calls, token usage
```

These types belong to `kuul-core`'s own domain model; the adapter layer converts them to and from Spring AI types. Spring AI types never leak into the engine, and the implementation can be swapped later.

::: warning Only half of Spring AI
kuul uses Spring AI only for protocol conversion and `@Tool` JSON schema generation, and **turns off its internal tool execution** (`internalToolExecutionEnabled=false`). Otherwise tools would run twice and bypass kuul's policy and audit.
:::

## Cost transparency

Every call writes an `llm_calls` record: provider, model, token usage, latency and status. This is the basis for cost reporting and also goes into the audit log.

## Failure handling

- Failures are wrapped in a `ProviderException` and returned as 503;
- 1.0 has no automatic failover, but Profiles reserve a `provider.fallback` field that later phases will enable, together with circuit breaking.
