import { mkdirSync, writeFileSync, appendFileSync } from 'fs'
import prompts from 'prompts'
;(async () => {
  let categoryRow = ''

  if (process.argv.length >= 3) {
    categoryRow = process.argv[2]
  } else {
    const response = await prompts({
      type: 'text',
      name: 'category',
      message: 'What category do you want to create?',
    })

    categoryRow = response.category
  }

  const category = categoryRow.toLowerCase()

  mkdirSync(`./articles/${category}`, { recursive: true })

  writeFileSync(`./articles/${category}/index.md`, '# 文章目录\n\n <!-- @include: ./list.md -->\n')

  writeFileSync(`./articles/${category}/list.md`, `## ${categoryRow}\n`)

  const newIndex = `\n<!-- @include: ./${category}/list.md -->\n`

  appendFileSync('./articles/index.md', newIndex)
})()
