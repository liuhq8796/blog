import { scanDir } from './util'
import type { DefaultTheme } from 'vitepress'

const categories = [
  {
    label: 'JS',
    link: '/articles/js/',
  },
  {
    label: 'TS',
    link: '/articles/ts/',
  },
  {
    label: 'HTML',
    link: '/articles/html/',
  },
  {
    label: 'CSS',
    link: '/articles/css/',
  },
  {
    label: 'Vue',
    link: '/articles/vue/',
  },
  {
    label: 'Vite',
    link: '/articles/vite/',
  },
  {
    label: 'Node',
    link: '/articles/node/',
  },
  {
    label: 'Nginx',
    link: '/articles/nginx/',
  },
  {
    label: '工程化设计',
    link: '/articles/engineering-design/',
  },
  {
    label: '程序设计',
    link: '/articles/programming/',
  },
  {
    label: '阅读',
    link: '/articles/reading/',
  },
]

export default categories.map<DefaultTheme.SidebarItem>((category) => {
  const items = scanDir(category.link)

  return {
    text: category.label,
    link: category.link,
    items,
    collapsed: true,
  }
})
