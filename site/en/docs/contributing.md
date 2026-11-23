# Contributing

kuul is at an early stage, and contributions are very welcome.

## Where to start

- **Discuss the design**: questions or suggestions about the [design docs](./design-docs) are welcome as [issues](https://github.com/likun758/kuul/issues).
- **Pick up a task**: issues labeled `good-first-issue` are a good way in; new built-in tools, MCP adapters and channels are great first contributions.
- **Improve the docs**: PRs for the API reference, operations guide or this site are welcome.

## Local development

```bash
git clone https://github.com/likun758/kuul.git
cd kuul
./mvnw package                  # compile, test, package (JDK 21+)
./mvnw -pl kuul-core -am test   # test a single module
```

This site lives in `site/` and is built with VitePress:

```bash
cd site
npm install
npm run docs:dev
```

## Workflow

1. Fork and clone the repository;
2. Create a branch, describe the change, implement it on top of the existing code and add tests;
3. Make sure `./mvnw package` passes locally;
4. Open a PR; once CI (JDK 21 / 25) is green, a maintainer reviews and merges it.

## Rules you must follow

Contributions follow the project constitution. These are hard rules:

- **Governance can't be bypassed**: every tool call goes through the shared pipeline and audit; no shortcuts for any tool;
- **Don't change `kuul-core`'s interface contracts**; `kuul-core` must not depend on Spring AI;
- **Only half of Spring AI**: protocol adaptation and `@Tool` schema generation only, with internal tool execution turned off;
- **Explicit provider mapping**: create instances by name; never scan beans by type;
- **Storage**: SQLite + JDBC + Flyway — no JPA, no `ddl-auto`, no vector database;
- **SKILL.md is not a tool**; the context loader injects it into the prompt;
- No plain-text secrets.

Before submitting, check your change against the review checklist in [`CLAUDE.md`](https://github.com/likun758/kuul/blob/main/CLAUDE.md) at the repository root.

## License

kuul is released under the [Apache License 2.0](https://github.com/likun758/kuul/blob/main/LICENSE). By contributing, you agree that your code is released under that license.
