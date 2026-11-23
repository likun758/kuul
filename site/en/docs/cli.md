# CLI

kuul's CLI is built on Picocli and its entry point is `kuul.jar`. Below, `java -jar kuul.jar` is shortened to `kuul`.

## Available now <Badge type="tip" text="available" />

```bash
kuul --version     # print the version: kuul 0.1.0-SNAPSHOT
kuul --help        # print help
kuul               # no arguments: print version and usage
```

The CLI can also run on its own without Spring (light commands only):

```bash
java -jar kuul-cli/target/kuul-cli-0.1.0-SNAPSHOT-exec.jar --version
```

## Commands <Badge type="info" text="design target" />

| Command | Description | Kind |
|---|---|---|
| `init` | Initialize the `.kuul/` workspace without overwriting existing files | Light |
| `profile list \| create \| show \| delete` | Manage Profiles | Light |
| `session list` | List sessions | Light |
| `audit tail` | Show recent audit entries | Light |
| `chat` | Interactive chat; `--message` sends a single message; `/quit` exits | Heavy |
| `serve` | Start the HTTP server (port 8080 by default) | Heavy |
| `gateway` | Long-running daemon; same as `serve` in 1.0, hosts IM channels later | Heavy |
| `status` | Instance status | Heavy |
| `provider list` | List providers and their connectivity | Heavy |
| `tool list` | List registered tools | Heavy |

## Light vs. heavy commands

- **Light commands** don't start Spring; they read and write files or use JDBC directly and finish in under a second;
- **Heavy commands** start the Spring context and initialize providers and MCP connections; a long-running server starts in 2–4 seconds.

The three run modes (`chat`, `serve`, `gateway`) differ only in the access layer; they share the same Profiles, engine and storage.

## Examples

```bash
kuul init
kuul profile create sales-insight
kuul chat --profile sales-insight
kuul chat --message "Summarize yesterday's alerts"
kuul serve
kuul audit tail
```
