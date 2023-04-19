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
        link: '/articles/js/',
        items: [],
      },
      {
        text: 'CSS',
        link: '/articles/css/',
        items: [
          {
            text: 'BEM 与 Atomic CSS 方法论',
            link: '/articles/css/bem-and-atomic-css-methodology',
          },
        ],
      },
      {
        text: 'HTML',
        link: '/articles/html/',
        items: [],
      },
      {
        text: 'Nginx',
        link: '/articles/nginx/',
        items: [
          {
            text: '在 Nginx 中运行 JavaScript',
            link: '/articles/nginx/running-javascript-in-nginx',
          },
          {
            text: 'Nginx 配置中的 JavaScript',
            link: '/articles/nginx/javascript-in-nginx-configuration',
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/liuhq8796/blog' }],

    darkModeSwitchLabel: '深色模式',

    sidebarMenuLabel: '目录',

    returnToTopLabel: '回到顶部',
  },

  // Site Metadata

  base: '/blog/',

  // Build

  srcExclude: ['**/list.md'],
})
