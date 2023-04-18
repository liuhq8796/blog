import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '学海拾贝',
  titleTemplate: "LucasLiu's 博客网站",
  description: "LucasLiu's 博客网站",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '全部文章', link: '/articles/' },
    ],

    outlineTitle: '页面导航',

    sidebar: [
      {
        text: 'JS',
        items: [],
      },
      {
        text: 'CSS',
        items: [
          {
            text: 'BEM、Atomic CSS 方法论',
            link: '/articles/css/BEM、Atomic CSS 方法论',
          },
        ],
      },
      {
        text: 'HTML',
        items: [],
      },
      {
        text: 'Nginx',
        items: [
          {
            text: '在 Nginx 中运行 JavaScript',
            link: '/articles/nginx/在 Nginx 中运行 JavaScript',
          },
          {
            text: 'Web 服务器配置中的 NGINX JavaScript',
            link: '/articles/nginx/Web 服务器配置中的 NGINX JavaScript',
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/liuhq8796/blog' }],

    darkModeSwitchLabel: '深色模式',

    sidebarMenuLabel: '目录',

    returnToTopLabel: '回到顶部',
  },
})
