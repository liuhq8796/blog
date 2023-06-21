import { defineConfig, loadEnv } from 'vitepress'
import sidebar from './sidebar'

const env = loadEnv('', process.cwd())

let search

if (env.VITE_ALGOLIA_APP_ID && env.VITE_ALGOLIA_API_KEY && env.VITE_ALGOLIA_INDEX_NAME) {
  search = {
    provider: 'algolia',
    options: {
      appId: env.VITE_ALGOLIA_APP_ID,
      apiKey: env.VITE_ALGOLIA_API_KEY,
      indexName: env.VITE_ALGOLIA_INDEX_NAME,
    },
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '学海拾贝',
  titleTemplate: "Lucas Liu's 博客",
  description: "Lucas Liu's 博客",
  lang: 'zh-CN',

  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '全部文章', link: '/articles/' },
      { text: '关于我', link: env.VITE_ABOUT_ME_URL, target: '_blank' },
    ],

    outlineTitle: '页面导航',

    sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/liuhq8796/blog' }],

    darkModeSwitchLabel: '深色模式',

    sidebarMenuLabel: '目录',

    returnToTopLabel: '回到顶部',

    search,

    footer: {
      copyright: 'Copyright © 2023-present <a href="https://github.com/liuhq8796">Lucas Liu</a>',
    },
  },

  // Build

  srcExclude: ['**/list.md'],
})
