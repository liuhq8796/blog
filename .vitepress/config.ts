import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '学海拾贝',
  titleTemplate: "LucasLiu's 博客网站",
  description: "LucasLiu's 博客网站",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '全部文章', link: '/articles/' },
    ],

    outlineTitle: '目录',

    sidebar: [
      {
        text: 'HTML',
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
        text: 'JS',
        items: [],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/liuhq8796/blog' }],

    returnToTopLabel: '返回顶部',
  },
})
