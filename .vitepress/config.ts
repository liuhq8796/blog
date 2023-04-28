import { defineConfig } from 'vitepress'
import sidebar from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '学海拾贝',
  titleTemplate: "Lucas Liu's 博客",
  description: "Lucas Liu's 博客",

  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: '全部文章', link: '/articles/' }],

    outlineTitle: '页面导航',

    sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/liuhq8796/blog' }],

    darkModeSwitchLabel: '深色模式',

    sidebarMenuLabel: '目录',

    returnToTopLabel: '回到顶部',
  },

  // Build

  srcExclude: ['**/list.md'],
})
