# Design Docs

All of kuul's design work is public in the [`docs/init/`](https://github.com/likun758/kuul/tree/main/docs/init) directory of the repository. This site is a condensed version; read the originals for the full reasoning, data sources and trade-offs.

::: info Language
The design documents are written in Chinese.
:::

Suggested reading order:

| Document | What it answers |
|---|---|
| [Product Research](https://github.com/likun758/kuul/blob/main/docs/init/ProductResearch.md) | What an Agent OS is, the current landscape, why nobody has built one for Java, and kuul's positioning |
| [Requirements](https://github.com/likun758/kuul/blob/main/docs/init/RequirementAnalysis.md) | What 1.0 does and when it counts as done (five acceptance demos) |
| [Extension Analysis](https://github.com/likun758/kuul/blob/main/docs/init/ExtensionAnalysis.md) | Motivation, dependencies and done criteria for P0 / P1 / P2 |
| [Technical Design](https://github.com/likun758/kuul/blob/main/docs/init/TechnicalSolution.md) | Architecture, module design, nine key technical decisions |
| [AI Programming Guide](https://github.com/likun758/kuul/blob/main/docs/init/AIProgrammingGuide.md) | How kuul is built with Spec-Kit + Claude Code: method, project constitution, review checklist |

When docs and code disagree, the technical design wins; to change the design, change the docs first.
