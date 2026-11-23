# Quick Start

## Prerequisites

- **JDK 21+** (25 LTS recommended). kuul relies on virtual threads.
- No separate Maven install: the repository ships with the Maven Wrapper (`./mvnw`).
- An API key for at least one LLM provider (DeepSeek, Kimi, …), or a local Ollama / vLLM.

## Build <Badge type="tip" text="available" />

```bash
git clone https://github.com/likun758/kuul.git
cd kuul
./mvnw package
```

The result is `kuul-boot/target/kuul.jar`. Check it:

```bash
java -jar kuul-boot/target/kuul.jar --version
# kuul 0.1.0-SNAPSHOT
```

The CLI's light commands can also run on their own, without Spring:

```bash
java -jar kuul-cli/target/kuul-cli-0.1.0-SNAPSHOT-exec.jar --version
```

Below, `java -jar kuul.jar` is shortened to `kuul`.

## Initialize a workspace <Badge type="info" text="design target" />

```bash
kuul init
```

Creates the `.kuul/` directory, the three bootstrap files, a `kuul.yaml` template and a ready-to-use default Profile, and initializes the database. Existing files are never overwritten.

## Configure a model <Badge type="info" text="design target" />

Declare a provider in `.kuul/kuul.yaml`; secrets come only from environment variables:

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

::: danger Never put plain-text secrets in config
kuul refuses to load a Profile or `kuul.yaml` that contains a plain-text secret.
:::

## Chat <Badge type="info" text="design target" />

```bash
kuul chat                        # interactive; /quit to exit
kuul chat --message "Hello"      # single message
```

## Start the HTTP server <Badge type="info" text="design target" />

```bash
export KUUL_API_KEYS=your-api-key
kuul serve                       # port 8080 by default
```

```bash
curl -X POST http://localhost:8080/api/v1/agents/default/invoke \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the weather in Shanghai today?"}'
```

::: tip
The request body format will be defined in the [REST API](./api) reference when 1.0 ships.
:::

## 1.0 acceptance demos

Before 1.0 is released, these five demos must pass:

| Demo | What it verifies |
|---|---|
| 1 | An agent calls a weather API, then writes a daily report with the file tool (LLM + ReAct + built-in tools) |
| 2 | A preference stated in one conversation is used in the next — even after a restart (Memory) |
| 3 | A cross-tool task via SKILL.md + an external MCP server (plugin tools) |
| 4 | An external system does "create session → send message → archive" over REST (Web Service) |
| 5 | Unauthorized tool calls and invalid API keys are rejected and visible in the audit log (governance baseline) |
