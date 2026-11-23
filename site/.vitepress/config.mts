import { defineConfig, type DefaultTheme } from 'vitepress'

const base = '/kuul/'
const siteUrl = 'https://likun758.github.io/kuul/'
const repo = 'https://github.com/likun758/kuul'

// ── Chinese (root) ──────────────────────────────────────────────
const zhNav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '文档', link: '/docs/what', activeMatch: '^/docs/' },
  { text: '路线图', link: '/docs/roadmap' },
  { text: '参与贡献', link: '/docs/contributing' },
]

const zhSidebar: DefaultTheme.Sidebar = {
  '/docs/': [
    {
      text: '介绍',
      items: [
        { text: 'kuul 是什么', link: '/docs/what' },
        { text: '为什么需要 kuul', link: '/docs/why' },
        { text: '核心概念', link: '/docs/concepts' },
      ],
    },
    {
      text: '快速入门',
      items: [{ text: '快速开始', link: '/docs/quick-start' }],
    },
    {
      text: '架构设计',
      items: [
        { text: '架构概览', link: '/docs/architecture' },
        { text: '对接 LLM', link: '/docs/provider' },
        { text: 'ReAct 循环', link: '/docs/react-loop' },
        { text: '记忆系统', link: '/docs/memory' },
        { text: 'Tool 体系', link: '/docs/tool' },
        { text: '治理基线', link: '/docs/governance' },
      ],
    },
    {
      text: '参考',
      items: [
        { text: '配置与 Profile', link: '/docs/configuration' },
        { text: 'REST API', link: '/docs/api' },
        { text: 'CLI 命令', link: '/docs/cli' },
      ],
    },
    {
      text: '项目',
      items: [
        { text: '路线图', link: '/docs/roadmap' },
        { text: '设计文档', link: '/docs/design-docs' },
        { text: '参与贡献', link: '/docs/contributing' },
      ],
    },
  ],
}

// ── English (/en/) ──────────────────────────────────────────────
const enNav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/en/' },
  { text: 'Docs', link: '/en/docs/what', activeMatch: '^/en/docs/' },
  { text: 'Roadmap', link: '/en/docs/roadmap' },
  { text: 'Contribute', link: '/en/docs/contributing' },
]

const enSidebar: DefaultTheme.Sidebar = {
  '/en/docs/': [
    {
      text: 'Introduction',
      items: [
        { text: 'What is kuul', link: '/en/docs/what' },
        { text: 'Why kuul', link: '/en/docs/why' },
        { text: 'Core Concepts', link: '/en/docs/concepts' },
      ],
    },
    {
      text: 'Getting Started',
      items: [{ text: 'Quick Start', link: '/en/docs/quick-start' }],
    },
    {
      text: 'Architecture',
      items: [
        { text: 'Overview', link: '/en/docs/architecture' },
        { text: 'LLM Providers', link: '/en/docs/provider' },
        { text: 'ReAct Loop', link: '/en/docs/react-loop' },
        { text: 'Memory', link: '/en/docs/memory' },
        { text: 'Tool System', link: '/en/docs/tool' },
        { text: 'Governance Baseline', link: '/en/docs/governance' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Configuration & Profile', link: '/en/docs/configuration' },
        { text: 'REST API', link: '/en/docs/api' },
        { text: 'CLI', link: '/en/docs/cli' },
      ],
    },
    {
      text: 'Project',
      items: [
        { text: 'Roadmap', link: '/en/docs/roadmap' },
        { text: 'Design Docs', link: '/en/docs/design-docs' },
        { text: 'Contributing', link: '/en/docs/contributing' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'kuul',
  titleTemplate: ':title — kuul',
  base,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#2563EB' }],
    ['meta', { name: 'keywords', content: 'kuul, Agent OS, enterprise AI agents, Java, Spring Boot, Spring AI, MCP, self-hosted, AI governance, audit, 企业级 Agent, 私有部署' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'kuul' }],
    ['meta', { property: 'og:image', content: `${siteUrl}logo.svg` }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'Java 原生、私有部署、可审计的企业级 Agent OS',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        editLink: { pattern: `${repo}/edit/main/site/:path`, text: '在 GitHub 上编辑此页' },
        footer: { message: '基于 Apache License 2.0 发布', copyright: 'Copyright © 2026 kuul contributors' },
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新' },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        langMenuLabel: '切换语言',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'The Java-native, self-hosted, auditable enterprise Agent OS',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        editLink: { pattern: `${repo}/edit/main/site/:path`, text: 'Edit this page on GitHub' },
        footer: { message: 'Released under the Apache License 2.0', copyright: 'Copyright © 2026 kuul contributors' },
        outline: { level: [2, 3], label: 'On this page' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [{ icon: 'github', link: repo }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到相关结果',
                resetButtonTitle: '清除查询',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },
  },

  sitemap: { hostname: siteUrl },

  transformHead({ page, title, description }) {
    const pagePath = page.replace(/index\.md$/, '').replace(/\.md$/, '')
    const canonicalUrl = new URL(pagePath || './', siteUrl).href
    return [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['link', { rel: 'canonical', href: canonicalUrl }],
    ]
  },
})
