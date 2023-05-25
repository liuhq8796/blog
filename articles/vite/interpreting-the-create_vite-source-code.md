# 解读 create-vite 源码

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 37 期，链接：[https://juejin.cn/post/7129087028947320862](https://juejin.cn/post/7129087028947320862)。

## npm create && npm init

先来看看如何搭建一个 Vite 项目：

```sh
# npm
$ npm create vite@latest

# yarn
$ yarn create vite

# pnpm
$ pnpm create vite
```

然后按照提示操作即可！

从 [npm init 文档](https://docs.npmjs.com/cli/v8/commands/npm-init)可知，`create` 其实就是 `init` 的一个别名。

`npm init <initializer>` 可以用来设置一个新的或已经存在的 npm 包。

这个时候，`<initializer>` 是一个名为 `create-<initializer>` 的 npm 包，它将会被安装并执行其主 bin —— 一般是用来创建或更新 package.json 并运行任何其他与初始化相关的操作。

也就是说，`npm create vite@latest` 相当于 `npm init create-vite@latest`。

## package 文件

<!-- prettier-ignore-start -->
```json
// create-vite/package.json
{
  "name": "create-vite",
  "version": "4.3.1",
  "type": "module",
  "bin": {
    "create-vite": "index.js",
    "cva": "index.js"
  },
  "files": [
    "index.js",
    "template-*",
    "dist"
  ],
  "engines": {
    "node": "^14.18.0 || >=16.0.0"
  }
}
```
<!-- prettier-ignore-end -->

- [`"type"`](https://nodejs.org/api/packages.html#type) 字段定义了 `Node.js` 用于以该 `package.json` 文件作为最近父级的所有 `.js` 文件的模块格式。

- [`"bin"`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bin) 是命令名称到本地文件名的映射。

- [`"files"`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) 字段是一个包含文件名或者文件名模式的数组，用于描述包中包含哪些文件。

  该字段的默认值是 `["*"]`，表示包含所有文件。如果包含了该字段，那么该字段的值就会覆盖默认值。

  该字段的值是一个数组，数组中的每一项都是一个文件名或者文件名模式。文件名模式可以使用 `*`、`?`、`[...]`、`!(...)`、`?(...)`、`+(...)`、`*(...)`、`@(...)` 等通配符。

  该字段的值是相对于 `package.json` 文件所在的目录的路径。如果该字段的值是一个目录，那么该目录下的所有文件都会被包含。

- [`"engines"`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines) 字段可以指定运行该包模块所需的 `Node.js` 版本以及能够正确安装该包模块的 `npm` 版本。

  当用户安装带有 bin 字段的包时，如果是全局安装，npm 将会使用符号链接把这些文件链接到 `/usr/local/node_modules/.bin/`；如果是本地安装，会链接到 `./node_modules/.bin/`。

接着我们来看看 index.js 这个文件。

## 入口文件主流程

```node
// index.js
#!/usr/bin/env node

import './dist/index.mjs'
```

嘿这个小机灵鬼，上次看还不是这样的。

打开打包配置文件，看到真正的入口在 `src/index`。

```ts
// src/index.ts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 可以在跨平台的情况下执行命令行的库 链接：https://www.npmjs.com/package/cross-spawn
import spawn from 'cross-spawn'
// 解析命令行的参数 链接：https://www.npmjs.com/package/minimist
import minimist from 'minimist'
// 询问选择之类的  链接：https://www.npmjs.com/package/prompts
import prompts from 'prompts'
// 终端颜色输出的库 链接：https://www.npmjs.com/package/kolorist
import { blue, cyan, green, lightGreen, lightRed, magenta, red, reset, yellow } from 'kolorist'

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
// 避免通过定义与选项无关的 args（_）自动转换为项目名称，需要将其解析为字符串。见 #4606
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })
// 当前 Nodejs 的执行目录
const cwd = process.cwd()

// 定义之后要用到的 Framework 数据和类型
type ColorFunc = (str: string | number) => string
type FrameworkVariant = {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}
type Framework = {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}

const FRAMEWORKS: Framework[] = [
  // 实际的源码中写了很多框架，我这里只以vue和vue的变体举例子
  {
    name: 'vue',
    display: 'Vue',
    color: green,
    variants: [
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: blue,
      },
      {
        name: 'vue',
        display: 'JavaScript',
        color: yellow,
      },
      {
        name: 'custom-create-vue',
        display: 'Customize with create-vue ↗',
        color: green,
        customCommand: 'npm create vue@latest TARGET_DIR',
      },
      {
        name: 'custom-nuxt',
        display: 'Nuxt ↗',
        color: lightGreen,
        customCommand: 'npm exec nuxi init TARGET_DIR',
      },
    ],
  },
]

// 从 FRAMEWORKS 中获取所有的模板名称
const TEMPLATES = FRAMEWORKS.map(
  (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), [])

// 管理需要重命名的文件
const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

// 默认的目标目录
const defaultTargetDir = 'vite-project'

// 主函数内容省略，后文讲述
async function init() {
  // 获取命令行参数中的目标目录
  const argTargetDir = formatTargetDir(argv._[0])
  // 获取命令行参数中 --template 或 -t 的模板名称
  const argTemplate = argv.template || argv.t

  // 获取实际的目标目录
  let targetDir = argTargetDir || defaultTargetDir
  // 获取实际的项目名称
  const getProjectName = () => (targetDir === '.' ? path.basename(path.resolve()) : targetDir)

  // 定义一个 prompt.Answers 类型的变量，用于存储 prompts 询问的结果
  let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'>

  try {
    result = await prompts(
      [
        // 输入项目名称
        {
          // 如果已有项目名称(目标目录)，则跳过该问题；若不存在，则输入文本
          type: argTargetDir ? null : 'text',
          // 输入的值将保存在返回的对象中的此键/属性下
          name: 'projectName',
          // 要向用户显示的信息
          message: reset('Project name:'),
          // 可选的默认提示值。还支持异步函数
          initial: defaultTargetDir,
          // 当前 prompt 状态更改时的回调。函数签名为 (state)，其中 state 是具有当前状态快照的对象。
          // 状态对象有两个属性 value 和 aborted。例如 { value: 'foo', aborted: false }
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        // 是否覆盖已有的目录
        {
          // 如果目标目录不存在，或目标目录为空目录，则跳过该问题；否则询问是否覆盖
          type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm'),
          name: 'overwrite',
          message: () =>
            (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        // 当上一条问题选择不覆盖已有目录时，抛出错误；否则跳过该步骤
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker',
        },
        // 输入包名
        {
          // 若项目名符合包名规范，则跳过该问题；否则输入文本
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          // 默认值提示，值为当前项目名转换成的合法的包名
          initial: () => toValidPackageName(getProjectName()),
          // 接收用户输入。如果值有效，则应返回 true ，否则应返回错误消息 String
          // 如果返回 false ，则显示默认错误消息
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
        },
        // 选择框架
        {
          // 若命令行参数中有模板名称，并且该名称在 TEMPLATES 中，则跳过该问题；否则选择框架
          type: argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
          name: 'framework',
          message:
            typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
              ? reset(`"${argTemplate}" isn't a valid template. Please choose from below: `)
              : reset('Select a framework:'),
          initial: 0,
          // 字符串或选项对象的数组 [{ title, description, value, disabled }, ...]
          // 如果未指定 value，则数组中选项的索引将用作其值。
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            }
          }),
        },
        // 选择框架变体
        {
          // 接收上一个 prompt 的值，若该值存在 variants 属性，则选择框架变体；否则跳过该问题
          type: (framework: Framework) => (framework && framework.variants ? 'select' : null),
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name,
              }
            }),
        },
      ],
      {
        onCancel() {
          throw new Error(red('✖') + ' Operation cancelled')
        },
      },
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  // 获取询问结果
  const { framework, overwrite, packageName, variant } = result

  // 获取项目根目录
  const root = path.join(cwd, targetDir)

  // 如果选择覆盖已有目录，则清空目录；否则创建目录
  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    // recursive: true 表示递归创建目录
    fs.mkdirSync(root, { recursive: true })
  }

  // 确定使用的模版
  let template: string = variant || framework?.name || argTemplate
  // 是否使用 react-swc 模版
  let isReactSwc = false
  if (template.includes('-swc')) {
    isReactSwc = true
    template = template.replace('-swc', '')
  }

  // 确定使用的包管理器
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  // 是否使用 yarn 1.x 版本
  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version?.startsWith('1.')

  // 获取自定义命令
  const { customCommand } =
    FRAMEWORKS.flatMap((f) => f.variants).find((v) => v.name === template) ?? {}

  // 如果自定义命令存在，则执行自定义命令并退出
  if (customCommand) {
    const fullCustomCommand = customCommand
      // 将命令中默认的 npm 替换为实际使用的包管理器
      .replace(/^npm create/, `${pkgManager} create`)
      // 如果使用 yarn 1.x 版本，则将命令中的 @latest 替换为空字符串
      .replace('@latest', () => (isYarn1 ? '' : '@latest'))
      .replace(/^npm exec/, () => {
        // 如果使用 pnpm 或非 1.x 的yarn，则将命令中的 npm exec 替换为 pnpm dlx 或 yarn dlx
        if (pkgManager === 'pnpm') {
          return 'pnpm dlx'
        }
        if (pkgManager === 'yarn' && !isYarn1) {
          return 'yarn dlx'
        }
        // 在其他情况下，仍然使用 npm exec
        // 包括使用 yarn 1.x 版本以及其他包管理器
        return 'npm exec'
      })

    const [command, ...args] = fullCustomCommand.split(' ')
    // 我们在这里替换自定义命令里的 TARGET_DIR 占位符，因为目标目录名可能包含空格，在上一步中会被错误地分割
    const replacedArgs = args.map((arg) => arg.replace(/TARGET_DIR/, targetDir))
    // 将 stdio 选项设置为 ‘inherit’ 时，子进程将继承父进程的标准输入、输出和错误流。这意味着子进程的 stdin、stdout 和 stderr 将与父进程共享，而不是被重定向到管道或文件中
    // 这对于需要在子进程中运行交互式命令的情况非常有用，因为它允许用户与子进程进行交互
    const { status } = spawn.sync(command, replacedArgs, { stdio: 'inherit' })
    process.exit(status ?? 0)
  }

  console.log(`\nScaffolding project in ${root}...`)

  // 拼接模版目录
  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../..', `template-${template}`)

  // 写入文件的方法，如果提供了 content，则写入 content，否则拷贝同名文件
  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  // 读取模版目录下的所有文件
  const files = fs.readdirSync(templateDir)
  // 将模板目录下的所有文件（除了package.json）写入到目标目录
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  // 读取模版目录下的 package.json，转为 JSON 对象
  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'))

  // 修改 package JSON 对象中的 name 字段
  pkg.name = packageName || getProjectName()

  // 重新写入 package.json
  write('package.json', JSON.stringify(pkg, null, 2) + '\n')

  // 如果使用 react-swc 模版，则执行 setupReactSwc 函数设置项目
  if (isReactSwc) {
    setupReactSwc(root, template.endsWith('-ts'))
  }

  // 获取从当前目录到项目根目录的相对路径
  const cdProjectName = path.relative(cwd, root)
  console.log(`\nDone. Now run:\n`)
  // 如果项目根目录不是当前执行命令的目录，则输出 cd 命令
  if (root !== cwd) {
    console.log(`  cd ${cdProjectName.include(' ') ? `"${cdProjectName}"` : `${cdProjectName}`}`)
  }
  // 输出安装依赖和启动项目的命令
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  // 输出空行
  console.log()
}

// 执行 init 函数
init().catch((e) => {
  console.error(e)
})
```

## 主流程中用到的工具函数

### `formatTargetDir` 格式化目标目录

```ts
function formatTargetDir(targetDir: string | undefined) {
  // 将反斜杠 `/` 替换为空字符串
  return targetDir?.trim().replace(/\/+$/g, '')
}
```

### `copy` 拷贝文件或文件夹

```ts
function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}
```

### `isValidPackageName` 判断是否为合法的包名

```ts
function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName)
}
```

### `toValidPackageName` 将包名转为合法的包名

```ts
function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}
```

### `copyDir` 拷贝文件夹

```ts
function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}
```

### `isEmpty` 判断文件夹是否为空

```ts
function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}
```

### `emptyDir` 清空文件夹

```ts
function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}
```

### `pkgFromUserAgent` 从 user agent 中获取包名和版本号

```ts
function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}
```

### `setupReactSwc` 设置 react-swc

```ts
function setupReactSwc(root: string, isTs: boolean) {
  editFile(path.resolve(root, 'package.json'), (content) => {
    return content.replace(/"@vitejs\/plugin-react": ".+?"/, `"@vitejs/plugin-react-swc": "^3.0.0"`)
  })
  editFile(path.resolve(root, `vite.config.${isTs ? 'ts' : 'js'}`), (content) => {
    return content.replace('@vitejs/plugin-react', '@vitejs/plugin-react-swc')
  })
}
```

### `editFile` 编辑文件

```ts
function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8')
  fs.writeFileSync(file, callback(content), 'utf-8')
}
```

## 总结

create-vite 的主要流程是：

1. 获取用户输入的参数（命令行或交互式）
2. 检查是否有同名文件夹；如有，询问是否覆盖原来的内容
3. 根据框架和变体读取模板文件写入文件夹
4. 提示进入文件夹，并执行安装命令

三个有用的 npm 包：

- [spawn](https://www.npmjs.com/package/spawn)：调用系统命令
- [minimist](https://www.npmjs.com/package/minimist)：命令行参数解析
- [prompts](https://www.npmjs.com/package/prompts)：交互式命令行提示工具
- [kolorist](https://www.npmjs.com/package/kolorist)：命令行颜色工具

Node API：

- url
  - fileURLToPath: 文件 url 转路径
- path
  - basename: 获取文件路径的文件名部分
  - resolve: 解析路径 (拼接)
  - join: 将多个参数组合成一个 path
  - relative: 相对路径查找
- fs
  - existsSync: 以同步方式检查目录是否存在
  - mkdirSync: 以同步方式创建文件夹
  - writeFileSync: 以同步方式写入文件
  - readdirSync: 以同步方式读取目录
  - statSync: 以同步方式读取文件信息
    - isDirectory: 判断是否为文件夹
  - copyFileSync: 以同步方式拷贝文件
  - rmSync: 以同步方式删除文件
