# 设计文档

kuul 的全部设计都公开在仓库的 [`docs/init/`](https://github.com/likun758/kuul/tree/main/docs/init) 目录下。本站的内容是它们的精简版；需要完整论证、数据来源和取舍细节时，请阅读原文。

建议阅读顺序：

| 文档 | 回答什么 |
|---|---|
| [产品调研](https://github.com/likun758/kuul/blob/main/docs/init/ProductResearch.md) | Agent OS 是什么、业界现状、为什么 Java 生态还没有人做、kuul 的定位 |
| [需求分析](https://github.com/likun758/kuul/blob/main/docs/init/RequirementAnalysis.md) | 1.0 做什么、做到什么程度算完成（5 个验收 Demo） |
| [扩展分析](https://github.com/likun758/kuul/blob/main/docs/init/ExtensionAnalysis.md) | P0 / P1 / P2 扩展功能的动因、依赖与完成标准 |
| [技术方案](https://github.com/likun758/kuul/blob/main/docs/init/TechnicalSolution.md) | 架构、模块设计、9 个关键技术决策 |
| [AI 编程指南](https://github.com/likun758/kuul/blob/main/docs/init/AIProgrammingGuide.md) | 用 Spec-Kit + Claude Code 落地的方法、项目宪章与审查清单 |

文档与代码冲突时以技术方案为准；需要改设计时，先改文档。
