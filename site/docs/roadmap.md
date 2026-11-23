# 路线图

![kuul 演进路线](/images/05-evolution-roadmap.svg)

演进方向：**单机 → 底座分布式 → 分布式 Agent 协作**。先单机做扎实，因为绝大多数企业都是先在一个场景里跑通、跑稳；单机最容易接入，也最容易纳入现有的运维和审计。

## 当前进展

- [x] 产品调研、需求分析、扩展分析、技术方案
- [x] Maven 多模块工程骨架、CI
- [ ] US-1 对接 LLM
- [ ] US-2 ReAct 循环 + 治理骨架
- [ ] US-3 Memory
- [ ] US-4 Tool 体系 + 完整沙箱
- [ ] US-5 Web Service + 收口
- [ ] 1.0 发布与项目主页

推进顺序：**US-1 → US-2 →（US-3 ∥ US-4）→ US-5**。

## 1.0 核心 <Badge type="tip" text="进行中" />

运行时内核 + 治理基线：让 Agent 跑起来，并且多 Agent 可以并存。

- 五大能力：对接 LLM、ReAct 循环、Memory、Tool 体系、Web Service；
- 治理基线：Tool Policy、审计日志、API 鉴权、密钥外置；
- 单 JAR 部署，CLI 与 REST API 两种入口。

1.0 能让企业试点，但还上不了高敏感生产。

![扩展功能三批推进](/images/14-extension-waves.svg)

## P0 生产准入 <Badge type="warning" text="规划中" />

不做完就过不了企业安全审查。

| 功能 | 完成标准 |
|---|---|
| SSO + RBAC + 租户 | 用企业 IdP（Keycloak / Entra ID / Okta）登录；越权返回 403 并审计；租户数据互相不可见 |
| 人工审批节点 | Tool 可配置三档决策级别；需审批的调用先挂起，批准后继续 |
| 企业 IM 渠道 | 企业微信、飞书、钉钉收发文本、卡片消息和审批回调 |
| 防篡改审计 + SIEM | 篡改任意一条记录都能被发现；支持 Syslog / HTTP 推送 |
| 容器级沙箱 | Shell 和文件类 Tool 在 rootless 容器中执行 |

## P1 规模化运营 <Badge type="warning" text="规划中" />

能上线之后，让它好用、省钱、稳定：Skill 签名与版本管理、KMS / Vault、注入与外泄防御、Provider 容灾 · 流式输出 · 配额限流、语义记忆与摘要压缩、Web Service 补全与定时任务、Web 管理台 · 可观测 · K8s、Slack / 邮件 / Web 嵌入渠道、三级组织模型。

::: warning 硬门槛
Skill 签名完成之前，不开放社区 Skill 导入——避免重蹈 ClawHub 恶意技能的覆辙。
:::

## P2 增强与扩展 <Badge type="info" text="愿景" />

状态外置 → 集群高可用、情景记忆与经验沉淀为 Skill（需审批）、子 Agent · 并行 Tool · 长任务恢复、自适应模型路由、kuul 作为 MCP Server · A2A 探索、企业系统 connector、GraalVM Native Image、配置热更新。

## 分布式的地基

中期扛量、高可用的前提是**实例无状态，状态外置**：

| 状态 | 外置到 |
|---|---|
| 会话 | Redis |
| 长期记忆、Skill | PostgreSQL / pgvector |
| 审计、大文件 | 对象存储，并投递到 SIEM |
| 配置、租户 | 配置中心 + 数据库 |

## 社区共建

不排期，有人贡献就推进：Skills Marketplace（建立在 Skill 签名之上）、多语言 SDK、可视化 Profile 编辑器、K8s Operator、Voice Channel、配套文档等。
