<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const repo = 'https://github.com/likun758/kuul'

const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))
const t = (zh: string, en: string) => (isEn.value ? en : zh)
/** Locale-aware internal link: /docs/what → /en/docs/what on the English site. */
const href = (path: string) => withBase(isEn.value ? `/en${path}` : path)

const pillars = computed(() => [
  {
    title: t('完全掌控', 'Fully yours'),
    desc: t('Apache 2.0 开源，私有部署，可接本地模型，数据不出边界', 'Apache 2.0, self-hosted, works with local models — data never leaves your boundary'),
  },
  {
    title: t('Java 原生', 'Java-native'),
    desc: t('就是一个 Spring Boot 应用，复用企业现有中间件与运维体系', 'Just a Spring Boot app that plugs into the middleware and ops stack you already run'),
  },
  {
    title: t('私有可审计', 'Auditable'),
    desc: t('模型调用、工具调用全部结构化留痕，可对接 SIEM', 'Every model and tool call leaves a structured audit trail, ready for your SIEM'),
  },
  {
    title: t('统一底座', 'One foundation'),
    desc: t('多个 Agent 共享渠道、模型、记忆、工具与治理能力', 'Many agents share channels, models, memory, tools and governance'),
  },
])

const capabilities = computed(() => [
  {
    num: '01',
    title: t('对接 LLM', 'LLM Providers'),
    desc: t(
      '统一的 Provider 抽象，优先支持 OpenAI 兼容协议。DeepSeek、Kimi、本地 Ollama / vLLM 按名称引用，每次调用记录 Token 与延迟。',
      'One Provider abstraction, OpenAI-compatible first. DeepSeek, Kimi and local Ollama / vLLM are referenced by name; every call records tokens and latency.'
    ),
    link: '/docs/provider',
  },
  {
    num: '02',
    title: t('ReAct 循环', 'ReAct Loop'),
    desc: t(
      '自研 Agent 引擎：推理 → 调用 Tool → 观察 → 继续。迭代次数、截止时间、重试策略可配置，完整调用链可回放、可审计。',
      'A purpose-built agent engine: reason → call a tool → observe → repeat. Iterations, deadlines and retries are configurable; every call chain can be replayed and audited.'
    ),
    link: '/docs/react-loop',
  },
  {
    num: '03',
    title: t('记忆系统', 'Memory'),
    desc: t(
      'Session 持久化到 SQLite，重启可恢复；长期记忆是一份可读、可编辑、可 git 跟踪的 MEMORY.md。',
      'Sessions persist in SQLite and survive restarts. Long-term memory is a MEMORY.md you can read, edit and track in git.'
    ),
    link: '/docs/memory',
  },
  {
    num: '04',
    title: t('Tool 体系', 'Tool System'),
    desc: t(
      '内置 Tool、SKILL.md + MCP Server（零代码）、自写 MCP Server（轻代码）、@Tool Spring Bean（重代码），统一包装、统一治理。',
      'Built-in tools, SKILL.md + MCP servers (no code), your own MCP server (low code) or @Tool Spring beans (full code) — one wrapper, one set of rules.'
    ),
    link: '/docs/tool',
  },
  {
    num: '05',
    title: 'Web Service',
    desc: t(
      '10 个 REST 端点是业务系统集成 kuul 的唯一通道。告警、CI/CD、定时任务，任何能发 HTTP 的系统都能接入。',
      'Ten REST endpoints are the single integration surface. Alerts, CI/CD, schedulers — anything that speaks HTTP can drive an agent.'
    ),
    link: '/docs/api',
  },
  {
    num: '06',
    title: t('治理基线', 'Governance Baseline'),
    desc: t(
      'Tool 默认拒绝、显式授权；每次模型和 Tool 调用都写审计；API Key 鉴权；密钥不落明文。第一天就有，不靠外挂。',
      'Tools are denied by default and granted explicitly; every model and tool call is audited; API keys guard the API; secrets never sit in plain text. Built in from day one.'
    ),
    link: '/docs/governance',
  },
])

const compareRows = computed(() => [
  {
    dim: t('形态', 'Form'),
    claw: t('常驻 Agent OS', 'Always-on Agent OS'),
    fw: t('代码库，运行环境自己搭', 'A library; you build the runtime'),
    cloud: t('托管服务', 'Managed service'),
    kuul: t('常驻 Agent OS', 'Always-on Agent OS'),
  },
  { dim: t('私有部署', 'Self-hosted'), claw: '✓', fw: '✓', cloud: '✗', kuul: '✓' },
  {
    dim: t('企业治理', 'Enterprise governance'),
    claw: t('外挂加固', 'Bolted-on hardening'),
    fw: t('各团队自己写', 'Every team rolls its own'),
    cloud: '✓',
    kuul: t('内建，第一天就有', 'Built in from day one'),
  },
  {
    dim: t('技术栈', 'Stack'),
    claw: 'Node.js / Python',
    fw: 'Java',
    cloud: t('厂商绑定', 'Vendor lock-in'),
    kuul: 'Java / Spring Boot',
  },
  {
    dim: t('Tool 权限', 'Tool permissions'),
    claw: t('默认宽松', 'Permissive by default'),
    fw: t('自行实现', 'Up to you'),
    cloud: t('平台策略', 'Platform policy'),
    kuul: t('默认拒绝，显式授权', 'Deny by default, explicit grants'),
  },
])

const scenarios = computed(() => [
  {
    title: t('运维自愈', 'Self-healing Ops'),
    flow: t(
      '告警 Webhook → 拉取日志 → 匹配历史故障 → 执行自愈 Skill → IM 群汇报',
      'Alert webhook → pull logs → match past incidents → run a remediation Skill → report to the team chat'
    ),
    tags: ['Shell / Prometheus', 'Memory', 'Skill'],
  },
  {
    title: t('合规知识助手', 'Compliance Assistant'),
    flow: t(
      '飞书提问 → 检索合同与法规 → 给出带引用来源的建议',
      'Ask in Feishu → search contracts and regulations → answer with cited sources'
    ),
    tags: [t('记忆检索', 'Retrieval'), t('引用可追溯', 'Traceable citations')],
  },
  {
    title: t('销售客户洞察', 'Sales Account Insight'),
    flow: t(
      '拜访前提问 → 调用 CRM 与企查查 MCP → 生成客户简报',
      'Ask before a visit → query CRM and company-data MCP servers → get an account brief'
    ),
    tags: [t('MCP 集成', 'MCP integration'), t('Tool 编排', 'Tool chaining')],
  },
])

const roadmap = computed(() => [
  {
    phase: t('1.0 核心', '1.0 Core'),
    status: t('进行中', 'In progress'),
    active: true,
    items: [
      t('五大能力：LLM、ReAct、Memory、Tool、Web Service', 'Five capabilities: LLM, ReAct, Memory, Tools, Web Service'),
      t('治理基线：Tool Policy、审计、API Key、密钥外置', 'Governance baseline: tool policy, audit, API keys, external secrets'),
      t('CLI 与单 JAR 部署', 'CLI and single-JAR deployment'),
    ],
  },
  {
    phase: t('P0 生产准入', 'P0 Production-ready'),
    status: t('规划中', 'Planned'),
    active: false,
    items: [
      'SSO / RBAC / ' + t('租户', 'tenants'),
      t('人工审批（三级决策权限）', 'Human approval (three decision levels)'),
      t('企业微信 / 飞书 / 钉钉', 'WeCom / Feishu / DingTalk'),
      t('防篡改审计 + SIEM、容器沙箱', 'Tamper-evident audit + SIEM, container sandbox'),
    ],
  },
  {
    phase: t('P1 规模化运营', 'P1 Operate at scale'),
    status: t('规划中', 'Planned'),
    active: false,
    items: [
      t('Skill 签名、KMS / Vault', 'Skill signing, KMS / Vault'),
      t('Provider 容灾、流式输出、配额', 'Provider failover, streaming, quotas'),
      t('语义记忆、管理台、K8s', 'Semantic memory, admin console, K8s'),
    ],
  },
  {
    phase: t('P2 增强与扩展', 'P2 Extend'),
    status: t('愿景', 'Vision'),
    active: false,
    items: [
      t('集群高可用', 'Clustered HA'),
      t('子 Agent、情景记忆', 'Sub-agents, episodic memory'),
      'MCP Server / A2A, Native Image',
    ],
  },
])

// ── Hero background: a slow, flowing line field (pointer devices only, respects reduced motion) ──
const flowCanvas = ref<HTMLCanvasElement | null>(null)
let stopFlow: (() => void) | null = null

onMounted(() => {
  const canvas = flowCanvas.value
  if (!canvas) return
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0
  let h = 0
  type P = { x: number; y: number; age: number; life: number }
  let particles: P[] = []
  const spawn = (): P => ({ x: Math.random() * w, y: Math.random() * h, age: 0, life: 120 + Math.random() * 220 })

  const resize = () => {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    particles = Array.from({ length: Math.round((w * h) / 2600) }, spawn)
  }
  resize()

  const color = () => getComputedStyle(canvas).getPropertyValue('--kuul-flow-rgb').trim() || '61, 99, 221'
  let rgb = color()
  const themeObserver = new MutationObserver(() => (rgb = color()))
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  let t = 0
  let raf = 0
  let visible = true
  const field = (x: number, y: number) =>
    Math.sin(x * 0.0021 + t * 0.6) * 1.6 + Math.cos(y * 0.0034 - t * 0.4) * 1.2 + Math.sin((x + y) * 0.0011 + t * 0.25)

  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!visible) return
    t += 0.004
    // Fade previous strokes so lines leave soft trails on a transparent canvas.
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0,0,0,0.045)'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(${rgb}, 0.16)`
    ctx.beginPath()
    for (const p of particles) {
      const a = field(p.x, p.y)
      const nx = p.x + Math.cos(a) * 0.9
      const ny = p.y + Math.sin(a) * 0.9
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(nx, ny)
      p.x = nx
      p.y = ny
      if (++p.age > p.life || nx < 0 || nx > w || ny < 0 || ny > h) Object.assign(p, spawn())
    }
    ctx.stroke()
  }
  raf = requestAnimationFrame(frame)

  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)
  window.addEventListener('resize', resize)

  stopFlow = () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    themeObserver.disconnect()
    window.removeEventListener('resize', resize)
  }
})

onBeforeUnmount(() => stopFlow?.())

// ── Content motion: scroll-reveal + a spotlight that follows the pointer inside cards ──
const root = ref<HTMLElement | null>(null)
let stopMotion: (() => void) | null = null

onMounted(() => {
  const el = root.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Only hide content once JS is running, so the page is fully visible without it.
  el.classList.add('motion')
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  )
  el.querySelectorAll('.reveal').forEach((n) => io.observe(n))

  const onMove = (ev: PointerEvent) => {
    const card = (ev.target as HTMLElement).closest<HTMLElement>('.card')
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${ev.clientX - r.left}px`)
    card.style.setProperty('--my', `${ev.clientY - r.top}px`)
  }
  el.addEventListener('pointermove', onMove)

  stopMotion = () => {
    io.disconnect()
    el.removeEventListener('pointermove', onMove)
  }
})

onBeforeUnmount(() => stopMotion?.())

const footerGroups = computed(() => [
  {
    title: t('产品', 'Product'),
    links: [
      { text: t('kuul 是什么', 'What is kuul'), href: href('/docs/what') },
      { text: t('快速开始', 'Quick Start'), href: href('/docs/quick-start') },
      { text: t('架构概览', 'Architecture'), href: href('/docs/architecture') },
      { text: t('路线图', 'Roadmap'), href: href('/docs/roadmap') },
    ],
  },
  {
    title: t('参考', 'Reference'),
    links: [
      { text: t('配置与 Profile', 'Configuration'), href: href('/docs/configuration') },
      { text: 'REST API', href: href('/docs/api') },
      { text: 'CLI', href: href('/docs/cli') },
      { text: t('设计文档', 'Design Docs'), href: href('/docs/design-docs') },
    ],
  },
  {
    title: t('社区', 'Community'),
    links: [
      { text: 'GitHub', href: repo },
      { text: 'Issues', href: `${repo}/issues` },
      { text: t('参与贡献', 'Contributing'), href: href('/docs/contributing') },
      { text: 'Apache 2.0', href: `${repo}/blob/main/LICENSE` },
    ],
  },
])
</script>

<template>
  <div ref="root" class="kuul-home">
    <!-- ── HERO ── -->
    <section class="hero">
      <canvas ref="flowCanvas" class="flow" aria-hidden="true"></canvas>
      <div class="hero-inner">
        <a class="notice" :href="href('/docs/roadmap')">
          {{ t('kuul 处于早期阶段：设计文档与工程骨架已就绪，1.0 正在开发中', 'kuul is early: the design and project skeleton are ready, and 1.0 is in development') }}
          <span aria-hidden="true">→</span>
        </a>

        <img class="hero-logo" :src="withBase('/logo.svg')" alt="kuul" width="72" height="72" />

        <h1 class="hero-title">
          {{ t('像管理服务一样', 'Run agents') }}<br />{{ t('管理 Agent', 'like services') }}
        </h1>

        <p class="hero-sub">
          {{ t(
            'Java 原生、私有部署、可审计的企业级 Agent OS。业务方只需配 Profile、写 Tool，其余交给 kuul。',
            'The Java-native, self-hosted, auditable Agent OS for the enterprise. Write a Profile, bring your Tools — kuul runs the rest.'
          ) }}
        </p>

        <!-- Glass demo card: what a governed run looks like (design target) -->
        <div class="glass demo reveal" role="img" :aria-label="t('kuul chat 运行示例', 'Example kuul chat session')">
          <div class="demo-q"><span class="who">you</span>{{ t('查一下上海天气，写进今天的日报', "Check Shanghai's weather and add it to today's report") }}</div>
          <div class="demo-log">
            <div class="line" style="--d: 1"><span class="k">llm</span>deepseek-chat · 812 tokens · 1.4s</div>
            <div class="line" style="--d: 2"><span class="k">tool</span>http_get api.weather… <span class="ok">policy ✓ sandbox ✓</span></div>
            <div class="line" style="--d: 3"><span class="k">tool</span>write_file ./workspace/daily.md <span class="ok">policy ✓ sandbox ✓</span></div>
            <div class="line" style="--d: 4"><span class="k">tool</span>shell rm -rf / <span class="deny">{{ t('已拒绝：shell 未在 Profile 中授权', 'denied: shell is not granted in this Profile') }}</span></div>
            <div class="line" style="--d: 5"><span class="k">audit</span>trace 7f3a… · 2 llm_call · 3 tool_call · 1 policy_denied</div>
          </div>
          <div class="demo-a line" style="--d: 6"><span class="who kuul">kuul</span>{{ t('已写入日报：上海今天多云，16–22°C。', 'Added to the report: Shanghai is cloudy today, 16–22°C.') }}</div>
        </div>

        <div class="hero-ctas">
          <a class="pill pill-primary" :href="href('/docs/what')">{{ t('了解 kuul', 'Explore kuul') }}</a>
          <a class="pill" :href="href('/docs/quick-start')">{{ t('快速开始', 'Quick Start') }}</a>
          <a class="pill" :href="repo" target="_blank" rel="noopener">GitHub</a>
        </div>
        <p class="hero-note">{{ t('示意：1.0 的设计目标，功能尚在开发中。', 'Illustration of the 1.0 design target; still in development.') }}</p>
      </div>
    </section>

    <!-- ── PILLARS ── -->
    <section class="block">
      <div class="inner pillars">
        <div v-for="(p, i) in pillars" :key="p.title" class="pillar card reveal" :style="{ '--i': i }">
          <h3>{{ p.title }}</h3>
          <p>{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── TWO THINGS ── -->
    <section class="block">
      <div class="inner">
        <header class="head reveal">
          <h2>{{ t('业务方只做两件事', 'Teams do just two things') }}</h2>
          <p>{{ t(
            '消息从哪来、模型怎么调、权限怎么管、审计怎么落、上下文怎么续，都由 kuul 负责。',
            'Where messages come from, how models are called, who may do what, how it is audited and how context carries over — kuul handles all of it.'
          ) }}</p>
        </header>
        <div class="two">
          <div class="two-item card reveal" style="--i: 0">
            <span class="step">01</span>
            <h3>{{ t('配 Profile', 'Write a Profile') }}</h3>
            <p>{{ t(
              'Agent 是配置出来的。一份 YAML 定义身份、模型、可用 Tool 与授权规则——未列出的 Tool 一律拒绝。',
              'Agents are configured, not coded. One YAML file defines identity, model, tools and permissions — any tool not listed is denied.'
            ) }}</p>
            <pre><code><span class="c-key">name</span>: ops-assistant
<span class="c-key">provider</span>: { <span class="c-key">name</span>: deepseek, <span class="c-key">temperature</span>: 0.2 }
<span class="c-key">tools</span>: [read_file, http_get, shell, github.*]
<span class="c-key">policy</span>:
  <span class="c-key">shell</span>: { <span class="c-key">allowed_commands</span>: [kubectl, git] }</code></pre>
          </div>
          <div class="two-item card reveal" style="--i: 1">
            <span class="step">02</span>
            <h3>{{ t('写 Tool', 'Bring your Tools') }}</h3>
            <p>{{ t(
              '任何语言，通过 MCP 接入；或者零代码地用 SKILL.md 组合现成的 MCP Server。工具名自动带命名空间。',
              'Any language, connected over MCP — or no code at all: combine existing MCP servers with a SKILL.md. Tool names are namespaced automatically.'
            ) }}</p>
            <pre><code><span class="c-comment"># .kuul/mcp_servers.yaml</span>
<span class="c-key">github</span>:
  <span class="c-key">transport</span>: stdio
  <span class="c-key">command</span>: npx
  <span class="c-key">args</span>: [-y, "@modelcontextprotocol/server-github"]
<span class="c-key">crm</span>: { <span class="c-key">transport</span>: http, <span class="c-key">url</span>: https://crm.internal/mcp }</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ARCHITECTURE ── -->
    <section class="block">
      <div class="inner">
        <header class="head reveal">
          <h2>{{ t('一个进程，四层结构', 'One process, four layers') }}</h2>
          <p>{{ t(
            '接入层 → 引擎层 → 能力层 → 基础层。治理横切每一次模型与 Tool 调用；新增 Channel、Provider 或 Tool 只在边缘加实现，不改引擎。',
            'Access → engine → capabilities → foundation. Governance cuts across every model and tool call; new channels, providers or tools are added at the edges without touching the engine.'
          ) }}</p>
        </header>
        <img class="arch reveal" :src="withBase(t('/images/09-tech-architecture.svg', '/images/en/09-tech-architecture.svg'))" :alt="t('kuul 技术架构', 'kuul architecture')" loading="lazy" />
        <ol class="pipeline">
          <li style="--s: 0">{{ t('参数校验', 'Validate') }}</li>
          <li class="hl" style="--s: 1">{{ t('Policy 授权', 'Policy') }}</li>
          <li style="--s: 2">{{ t('沙箱校验', 'Sandbox') }}</li>
          <li style="--s: 3">{{ t('执行', 'Execute') }}</li>
          <li class="hl" style="--s: 4">{{ t('审计', 'Audit') }}</li>
          <li style="--s: 5">{{ t('结果回填', 'Return') }}</li>
        </ol>
        <p class="caption">{{ t(
          '每一次 Tool 调用都走同一条管线——治理是固定步骤，不靠调用方自觉。',
          'Every tool call goes through the same pipeline — governance is a fixed step, not something callers opt into.'
        ) }}</p>
      </div>
    </section>

    <!-- ── CAPABILITIES ── -->
    <section class="block">
      <div class="inner">
        <header class="head reveal">
          <h2>{{ t('五大能力与治理基线', 'Five capabilities, one governance baseline') }}</h2>
          <p>{{ t(
            '1.0 的全部范围：让 Agent 跑起来，让多个 Agent 并存，并且从第一天起可控、可审计。',
            'The full scope of 1.0: run agents, run many side by side, and keep them controlled and auditable from day one.'
          ) }}</p>
        </header>
        <div class="grid3">
          <a v-for="(c, i) in capabilities" :key="c.num" class="cap card reveal" :style="{ '--i': i }" :href="href(c.link)">
            <span class="num">{{ c.num }}</span>
            <h3>{{ c.title }} <span class="arrow" aria-hidden="true">→</span></h3>
            <p>{{ c.desc }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ── COMPARISON ── -->
    <section class="block">
      <div class="inner">
        <header class="head reveal">
          <h2>{{ t('框架给代码，编排平台给流程，kuul 给运行时', 'Frameworks give code. Orchestrators give flows. kuul gives the runtime.') }}</h2>
          <p>{{ t(
            '继承 OpenClaw / Hermes 已验证的产品形态，把企业治理作为第一天的设计，并扎根 Java 生态。',
            'It keeps the product shape proven by OpenClaw and Hermes, designs enterprise governance in from day one, and lives in the Java ecosystem.'
          ) }}</p>
        </header>
        <div class="table-scroll card reveal">
          <table class="compare">
            <thead>
              <tr>
                <th></th>
                <th>OpenClaw / Hermes</th>
                <th>{{ t('Java Agent 框架', 'Java agent frameworks') }}</th>
                <th>{{ t('云托管平台', 'Cloud platforms') }}</th>
                <th class="col-kuul">kuul</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in compareRows" :key="r.dim">
                <th scope="row">{{ r.dim }}</th>
                <td>{{ r.claw }}</td>
                <td>{{ r.fw }}</td>
                <td>{{ r.cloud }}</td>
                <td class="col-kuul">{{ r.kuul }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ── SCENARIOS ── -->
    <section class="block">
      <div class="inner">
        <header class="head reveal">
          <h2>{{ t('典型场景', 'Typical scenarios') }}</h2>
          <p>{{ t(
            '都用 Profile + Plugin Tool + Web Service 组合实现，kuul 不为具体业务做专门模块。',
            'All built from Profiles, plugin tools and the Web Service — kuul ships no business-specific modules.'
          ) }}</p>
        </header>
        <div class="grid3">
          <div v-for="(s, i) in scenarios" :key="s.title" class="case card reveal" :style="{ '--i': i }">
            <span class="num">0{{ i + 1 }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.flow }}</p>
            <p class="tags">{{ s.tags.join(' · ') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ROADMAP ── -->
    <section class="block">
      <div class="inner">
        <header class="head reveal">
          <h2>{{ t('单机做扎实，架构不堵路', 'Solid on one node, open to scale') }}</h2>
          <p>{{ t('演进方向：单机 → 底座分布式 → 分布式 Agent 协作。', 'Single node → distributed foundation → distributed agent collaboration.') }}</p>
        </header>
        <div class="timeline">
          <div v-for="(r, i) in roadmap" :key="r.phase" class="milestone card reveal" :class="{ active: r.active }" :style="{ '--i': i }">
            <span class="dot" aria-hidden="true"></span>
            <span class="status">{{ r.status }}</span>
            <h3>{{ r.phase }}</h3>
            <ul>
              <li v-for="i in r.items" :key="i">{{ i }}</li>
            </ul>
          </div>
        </div>
        <p class="more"><a :href="href('/docs/roadmap')">{{ t('查看完整路线图', 'See the full roadmap') }} →</a></p>
      </div>
    </section>

    <!-- ── CLOSING ── -->
    <section class="closing">
      <div class="inner closing-inner">
        <h2>{{ t('一起把 Java 生态的 Agent OS 做出来', "Let's build the Agent OS for the Java ecosystem") }}</h2>
        <div class="glass cmd">
          <code><span class="prompt">$</span> git clone {{ repo }}.git &amp;&amp; cd kuul &amp;&amp; ./mvnw package</code>
        </div>
        <div class="hero-ctas">
          <a class="pill pill-primary" :href="href('/docs/contributing')">{{ t('参与贡献', 'Contribute') }}</a>
          <a class="pill" :href="repo" target="_blank" rel="noopener">Star on GitHub</a>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="footer">
      <div class="inner footer-inner">
        <div class="footer-brand">
          <div class="brand-row">
            <img :src="withBase('/logo.svg')" alt="" width="28" height="28" />
            <strong>kuul</strong>
          </div>
          <p>{{ t('Java 原生的企业级 Agent OS', 'The Java-native enterprise Agent OS') }}</p>
        </div>
        <nav v-for="g in footerGroups" :key="g.title" class="footer-group">
          <h4>{{ g.title }}</h4>
          <a v-for="l in g.links" :key="l.text" :href="l.href" :target="l.href.startsWith('http') ? '_blank' : undefined" :rel="l.href.startsWith('http') ? 'noopener' : undefined">{{ l.text }}</a>
        </nav>
      </div>
      <div class="inner footer-bottom">
        <span>© 2026 kuul contributors · Apache License 2.0</span>
        <span class="langs">
          <a :href="withBase('/')" :class="{ on: !isEn }">中文</a>
          <a :href="withBase('/en/')" :class="{ on: isEn }">EN</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.kuul-home {
  background: var(--kuul-page);
  color: var(--kuul-ink);
  font-family: var(--kuul-font-sans);
}
.kuul-home * { box-sizing: border-box; }
.kuul-home a { text-decoration: none; color: inherit; }
.kuul-home h1, .kuul-home h2, .kuul-home h3, .kuul-home h4 { border: 0; margin: 0; padding: 0; }
.kuul-home p { margin: 0; }
.kuul-home h1, .kuul-home h2, .kuul-home .hero-sub, .kuul-home .head p { text-wrap: balance; }
.kuul-home ul, .kuul-home ol { margin: 0; padding: 0; list-style: none; }
.two > *, .grid3 > *, .timeline > *, .pillars > *, .footer-inner > * { min-width: 0; }

.inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

/* ── Glass & pills ── */
.glass {
  background: var(--kuul-glass);
  border: 1.5px solid var(--kuul-glass-edge);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
}
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 24px;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 500;
  color: var(--kuul-ink) !important;
  background: var(--kuul-glass);
  border: 1px solid var(--kuul-glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.pill:hover { background: var(--kuul-glass-strong); border-color: var(--kuul-brand); color: var(--kuul-brand) !important; }
.pill-primary { background: var(--kuul-ink-bluish); border-color: transparent; color: var(--kuul-page) !important; }
.pill-primary:hover { background: var(--kuul-brand); border-color: transparent; color: #fff !important; }

/* ── HERO ── */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--kuul-hero-sky) 0%, transparent 100%);
  padding: 120px 0 96px;
}
.flow { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 880px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.notice {
  max-width: 640px;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.6;
  transition: opacity 0.2s, color 0.2s;
  margin-bottom: 40px;
}
.notice:hover { opacity: 1; color: var(--kuul-brand) !important; }
.hero-logo { margin-bottom: 28px; }
.hero-title {
  font-family: var(--kuul-font-display);
  font-weight: 400;
  font-size: clamp(40px, 6.4vw, 68px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--kuul-ink-bluish);
  margin-bottom: 24px !important;
}
.hero-sub {
  max-width: 620px;
  font-size: 17px;
  line-height: 1.75;
  color: var(--kuul-ink-2);
  margin-bottom: 48px !important;
}

.demo {
  width: 100%;
  text-align: left;
  padding: 22px 26px;
  margin-bottom: 40px;
}
.demo-q, .demo-a { font-size: 15px; line-height: 1.7; }
.who {
  display: inline-block;
  min-width: 44px;
  margin-right: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--kuul-ink-3);
}
.who.kuul { color: var(--kuul-brand); }
.demo-log {
  margin: 14px 0;
  padding: 12px 0 12px 16px;
  border-left: 2px solid var(--kuul-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.85;
  color: var(--kuul-ink-2);
  overflow-x: auto;
  white-space: nowrap;
}
.demo-log .k { display: inline-block; width: 48px; color: var(--kuul-ink-3); }
.ok { color: #1f9d6b; margin-left: 6px; }
.deny { color: #d64545; margin-left: 6px; }
.dark .ok { color: #4ade80; }
.dark .deny { color: #f87171; }

.hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.hero-note { margin-top: 20px !important; font-size: 12px; color: var(--kuul-ink-3); }

/* ── Content blocks ── */
.block { padding: 112px 0 0; }
.head { max-width: 720px; margin-bottom: 56px; }
.head h2 {
  font-family: var(--kuul-font-display);
  font-weight: 400;
  font-size: clamp(28px, 3.8vw, 40px);
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: var(--kuul-ink-bluish);
}
.head p { margin-top: 18px !important; font-size: 16px; line-height: 1.8; color: var(--kuul-ink-2); }

h3 {
  font-family: var(--kuul-font-display);
  font-weight: 500;
  color: var(--kuul-ink-bluish);
  letter-spacing: -0.01em;
}
.num, .step, .status {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--kuul-ink-3);
  letter-spacing: 0.04em;
}

/* Pillars */
.pillars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.pillar h3 { font-size: 18px; margin-bottom: 10px; }
.pillar p { font-size: 14px; line-height: 1.75; color: var(--kuul-ink-2); }

/* Two things */
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.two-item { display: flex; flex-direction: column; gap: 14px; }
.two-item h3 { font-size: 24px; }
.two-item p { font-size: 15px; line-height: 1.8; color: var(--kuul-ink-2); }
.two-item pre {
  margin: 8px 0 0;
  padding: 20px 22px;
  border-radius: 16px;
  background: var(--kuul-code-bg);
  overflow-x: auto;
}
.two-item code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.75;
  color: var(--kuul-ink);
  background: none;
  padding: 0;
}
.c-key { color: var(--kuul-brand); }
.c-comment { color: var(--kuul-ink-3); }

/* Architecture */
.arch { display: block; width: 100%; border-radius: 16px; }
.pipeline {
  margin-top: 48px !important;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px 0;
  font-size: 15px;
  color: var(--kuul-ink-2);
}
.pipeline li { display: flex; align-items: center; }
.pipeline li + li::before { content: ''; width: 36px; height: 1px; margin: 0 14px; background: var(--kuul-divider); }
.pipeline li.hl { color: var(--kuul-brand); font-weight: 500; }
.caption { text-align: center; margin-top: 16px !important; font-size: 13px; color: var(--kuul-ink-3); }

/* Capabilities & cases */
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 56px 48px; }
.cap, .case { display: flex; flex-direction: column; gap: 10px; }
.cap h3, .case h3 { font-size: 20px; }
.cap p, .case p { font-size: 14.5px; line-height: 1.8; color: var(--kuul-ink-2); }
.arrow { display: inline-block; color: var(--kuul-brand); opacity: 0; transform: translateX(-4px); transition: opacity 0.2s, transform 0.2s; }
.cap:hover .arrow { opacity: 1; transform: none; }
.case .tags { font-size: 13px; color: var(--kuul-brand); }

/* Comparison */
.table-scroll { overflow-x: auto; }
.compare { width: 100%; border-collapse: collapse; font-size: 15px; display: table; margin: 0; }
.compare tr { background: transparent !important; border: 0; }
.compare th, .compare td { padding: 18px 20px 18px 0; text-align: left; border: 0; border-bottom: 1px solid var(--kuul-divider); background: transparent; }
.compare thead th { font-size: 13px; font-weight: 500; color: var(--kuul-ink-3); }
.compare tbody th { font-weight: 500; color: var(--kuul-ink); white-space: nowrap; }
.compare td { color: var(--kuul-ink-2); }
.compare .col-kuul { color: var(--kuul-brand); font-weight: 500; }

/* Roadmap timeline */
.timeline { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.timeline::before { content: ''; position: absolute; left: 0; right: 0; top: 6px; height: 1px; background: var(--kuul-divider); }
.milestone { position: relative; display: flex; flex-direction: column; gap: 8px; }
.dot { width: 13px; height: 13px; border-radius: 50%; background: var(--kuul-page); border: 1.5px solid var(--kuul-ink-3); margin-bottom: 18px; }
.milestone.active .dot { border: 0; background: var(--kuul-brand); box-shadow: 0 0 0 6px var(--vp-c-brand-soft); }
.milestone.active .status { color: var(--kuul-brand); }
.milestone h3 { font-size: 19px; }
.milestone li { font-size: 14px; line-height: 1.8; color: var(--kuul-ink-2); }
.more { margin-top: 48px !important; }
.more a { color: var(--kuul-brand) !important; font-weight: 500; }
.more a:hover { text-decoration: underline; text-underline-offset: 4px; }

/* Closing */
.closing {
  margin-top: 144px;
  padding: 112px 0 120px;
  background: linear-gradient(0deg, var(--kuul-hero-sky) 0%, transparent 100%);
}
.closing-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 32px; }
.closing h2 {
  font-family: var(--kuul-font-display);
  font-weight: 400;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.25;
  letter-spacing: -0.015em;
  color: var(--kuul-ink-bluish);
  max-width: 720px;
}
.cmd { max-width: 100%; padding: 14px 22px; border-radius: 100px; overflow-x: auto; }
.cmd code { font-family: var(--vp-font-family-mono); font-size: 13.5px; color: var(--kuul-ink); background: none; padding: 0; white-space: nowrap; }
.cmd .prompt { color: var(--kuul-brand); margin-right: 8px; }

/* Footer */
.footer { padding: 72px 0 48px; }
.footer-inner { display: grid; grid-template-columns: 1.4fr repeat(3, 1fr); gap: 40px; }
.brand-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.brand-row strong { font-family: var(--kuul-font-display); font-weight: 500; font-size: 18px; color: var(--kuul-ink-bluish); }
.footer-brand p { font-size: 14px; color: var(--kuul-ink-2); }
.footer-group { display: flex; flex-direction: column; gap: 12px; }
.footer-group h4 { font-size: 14px; font-weight: 500; color: var(--kuul-ink); margin-bottom: 4px; }
.footer-group a { font-size: 14px; color: var(--kuul-ink-2); transition: color 0.2s; }
.footer-group a:hover { color: var(--kuul-brand); }
.footer-bottom {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--kuul-divider);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--kuul-ink-3);
}
.langs { display: flex; gap: 14px; }
.langs a { color: var(--kuul-ink-3); }
.langs a.on, .langs a:hover { color: var(--kuul-ink); }

/* ── Responsive ── */
@media (max-width: 960px) {
  .pillars, .timeline { grid-template-columns: 1fr 1fr; }
  .timeline::before { display: none; }
  .grid3 { grid-template-columns: 1fr 1fr; }
  .two { grid-template-columns: 1fr; gap: 56px; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .inner, .hero-inner { padding: 0 16px; }
  .hero { padding: 96px 0 72px; }
  .block { padding-top: 88px; }
  .head { margin-bottom: 40px; }
  .pillars, .grid3, .timeline { grid-template-columns: 1fr; gap: 36px; }
  .demo { padding: 18px; }
  .closing { margin-top: 104px; padding: 88px 0; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
  .pipeline li + li::before { width: 14px; margin: 0 8px; }
}

/* ════════════════════════════════════════════════════════════
   Cards & motion
════════════════════════════════════════════════════════════ */
.card {
  --mx: 50%;
  --my: 0%;
  position: relative;
  isolation: isolate;
  padding: 28px;
  border-radius: 20px;
  background: var(--kuul-glass);
  border: 1px solid var(--kuul-glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s, border-color 0.35s, background 0.35s;
}
/* Gradient border that lights up on hover. */
.card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #818cf8, var(--kuul-brand) 45%, #22d3ee);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s;
  pointer-events: none;
}
/* Soft spotlight that follows the pointer. */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: radial-gradient(360px circle at var(--mx) var(--my), rgba(var(--kuul-flow-rgb), 0.12), transparent 60%);
  opacity: 0;
  transition: opacity 0.35s;
  pointer-events: none;
}
.card:hover {
  transform: translateY(-4px);
  background: var(--kuul-glass-strong);
  border-color: transparent;
  box-shadow: 0 18px 40px -18px rgba(var(--kuul-flow-rgb), 0.45);
}
.card:hover::before, .card:hover::after { opacity: 1; }

.cap:hover h3, .case:hover h3 { color: var(--kuul-brand); }
.pillar.card { padding: 24px; }
.pillar.card h3 { transition: color 0.3s; }
.pillar.card:hover h3 { color: var(--kuul-brand); }
.two-item.card { padding: 32px; }
.two-item.card .step { color: var(--kuul-brand); }
.grid3 { gap: 24px; }
.pillars { gap: 20px; }
.two { gap: 24px; }
.table-scroll.card { padding: 8px 28px; }
.table-scroll.card:hover { transform: none; }

/* Roadmap milestones as cards; the active one breathes. */
.timeline { gap: 20px; }
.timeline::before { display: none; }
.milestone.card { padding: 26px 24px; }
.milestone.active { border-color: rgba(var(--kuul-flow-rgb), 0.45); }
.milestone.active .dot { animation: breathe 2.4s ease-in-out infinite; }
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 4px rgba(var(--kuul-flow-rgb), 0.18); }
  50% { box-shadow: 0 0 0 10px rgba(var(--kuul-flow-rgb), 0.06); }
}

/* Pipeline: glass pills with a highlight that travels through the steps. */
.pipeline { gap: 12px 0; }
.pipeline li {
  position: relative;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 14px;
  background: var(--kuul-glass);
  border: 1px solid var(--kuul-glass-border);
  animation: flowStep 3s ease-in-out infinite;
  animation-delay: calc(var(--s) * 0.5s);
}
.pipeline li + li { margin-left: 36px; }
.pipeline li + li::before { position: absolute; right: 100%; top: 50%; margin: 0 4px; width: 28px; }
@keyframes flowStep {
  0%, 30%, 100% { border-color: var(--kuul-glass-border); box-shadow: none; }
  12% { border-color: rgba(var(--kuul-flow-rgb), 0.8); box-shadow: 0 0 0 4px rgba(var(--kuul-flow-rgb), 0.12); }
}

/* Demo card: gentle float, log lines arrive one by one. */
.demo { transition: transform 0.4s, box-shadow 0.4s; }
.demo:hover { transform: translateY(-3px); box-shadow: 0 24px 60px -28px rgba(var(--kuul-flow-rgb), 0.5); }

/* ── Scroll reveal (only active once JS adds .motion) ── */
.motion .reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: calc(var(--i, 0) * 90ms);
}
.motion .reveal.in { opacity: 1; transform: none; }
/* Cards keep their own hover transition after they have appeared. */
.motion .card.reveal.in {
  transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--i, 0) * 90ms),
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s, border-color 0.35s, background 0.35s;
}
.motion .card.reveal.in:hover { transform: translateY(-4px); }
.motion .table-scroll.card.reveal.in:hover { transform: none; }
.motion .demo.reveal.in:hover { transform: translateY(-3px); }
.motion .demo .line { opacity: 0; transform: translateX(-6px); transition: opacity 0.5s, transform 0.5s; }
.motion .demo.in .line { opacity: 1; transform: none; transition-delay: calc(0.35s + var(--d) * 0.28s); }

@media (prefers-reduced-motion: reduce) {
  .card, .card::before, .card::after, .demo { transition: none; }
  .card:hover, .demo:hover { transform: none; }
  .pipeline li, .milestone.active .dot { animation: none; }
}
@media (max-width: 640px) {
  .card { padding: 22px; }
  .pipeline { gap: 10px; }
  .pipeline li + li { margin-left: 0; }
  .pipeline li + li::before { display: none; }
}
</style>
