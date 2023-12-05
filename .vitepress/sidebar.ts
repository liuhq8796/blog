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
    label: '设计思想',
    link: '/articles/design-philosophy/',
  }
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
