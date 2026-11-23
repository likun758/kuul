import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Home from './components/Home.vue'

// Self-hosted Latin fonts (no Google Fonts, so the site loads reliably everywhere).
// Chinese text falls back to the system CJK font (PingFang SC / Noto Sans SC / Microsoft YaHei).
import '@fontsource/montserrat/latin-300.css'
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/montserrat/latin-500.css'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-500.css'
import '@fontsource/dm-sans/latin-700.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Home', Home)
  },
} satisfies Theme
