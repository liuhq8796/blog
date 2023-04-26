import { scanDir } from './util'
import type { DefaultTheme } from 'vitepress'

export default ['JS', 'CSS', 'TS', 'Nginx'].map<DefaultTheme.SidebarItem>((category) => {
  const items = scanDir(category)

  return {
    text: category,
    link: `/articles/${category.toLowerCase()}/`,
    items,
  }
})
