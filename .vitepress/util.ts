import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import type { DefaultTheme } from 'vitepress'

export const scanDir = (dir: string): DefaultTheme.SidebarItem[] => {
  const dirPath = join(__dirname, '../articles', dir.toLowerCase())

  const files = readdirSync(dirPath).filter(
    (file) =>
      !['images', 'index.md', 'list.md'].includes(file) &&
      file.endsWith('.md') &&
      !file.startsWith('_'),
  )

  return files.map((file) => {
    const filePath = join(dirPath, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      return {
        text: file,
        link: `/articles/${dir.toLowerCase()}/${file.toLowerCase()}/`,
        items: scanDir(`${dir}/${file}`),
      }
    }

    const content = readFileSync(filePath, 'utf-8')
    const title = content.split('\n')[0].replace(/^#+\s*/, '')

    return {
      text: title,
      link: `/articles/${dir.toLowerCase()}/${file.replace(/\.md$/, '')}`,
    }
  })
}
