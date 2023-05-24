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
  // 获取命令行参数中的模板名称
  const argTemplate = argv.template || argv.t

  // 获取实际的目标目录
  let targetDir = argTargetDir || defaultTargetDir
  // 获取实际的项目名称
  const getProjectName = () => (targetDir === '.' ? path.basename(path.resolve()) : targetDir)

  // 定义一个 prompt.Answers 类型的变量，用于存储 prompts 询问的结果
  let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'>

  try {
    result = await prompts([
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
    ])
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
}

init().catch((e) => {
  console.error(e)
})
```

### 输出目录

```js
// 命令行第一个参数，替换反斜杠 / 为空字符串
let targetDir = formatTargetDir(argv._[0])

// 命令行参数 --template 或者 -t
let template = argv.template || argv.t

const defaultTargetDir = 'vite-project'
// 获取项目名
const getProjectName = () => (targetDir === '.' ? path.basename(path.resolve()) : targetDir)
```

#### 格式化目标路径

替换反斜杠 `/` 为空字符串。

```js
function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '')
}
```

### prompts 询问项目名、选择框架、选择框架变体等

```js
let result = {}
try {
  result = await prompts(
    [
      {
        type: targetDir ? null : 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = formatTargetDir(state.value) || defaultTargetDir
        },
      },
      // overwrite 已有目录，是否重写
      // packageName 输入的项目名
      // framework 框架
      // variant 变体， 比如 vue => vue-ts
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled')
      },
    },
  )
} catch (cancelled) {
  console.log(cancelled.message)
  return
}
const { framework, overwrite, packageName, variant } = result

// user choice associated with prompts
const { framework, overwrite, packageName, variant } = result
```

### 重写已有目录或创建不存在的目录

```js
// 项目根目录
const root = path.join(cwd, targetDir)

if (overwrite) {
  // 清空文件夹
  emptyDir(root)
} else if (!fs.existsSync(root)) {
  // 创建文件夹
  fs.mkdirSync(root, { recursive: true })
}
```

#### 延伸函数 emptyDir

清空目标目录，忽略 .git 目录

```js
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    // 跳过 .git 目录
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}
```

### 获取模板路径

```js
// determine template
template = variant || framework || template

console.log(`\nScaffolding project in ${root}...`)

const templateDir = path.resolve(fileURLToPath(import.meta.url), '..', `template-${template}`)
```

### 写入文件

```js
const write = (file, content) => {
  // renameFile
  const targetPath = renameFiles[file] ? path.join(root, renameFiles[file]) : path.join(root, file)
  if (content) {
    fs.writeFileSync(targetPath, content)
  } else {
    copy(path.join(templateDir, file), targetPath)
  }
}
```

这里的 `renameFiles`，是因为在某些编辑器或者电脑上不支持 `.gitignore`。

```js
const renameFiles = {
  _gitignore: '.gitignore',
}
```

#### 延伸函数 copy & copyDir

copy 拷贝文件，遇到文件夹调用 copyDir

```js
function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}
```

### 根据模块路径的文件写入目标路径

`package.json` 文件单独处理，要修改它内部的 `name` 属性。

```js
const files = fs.readdirSync(templateDir)
for (const file of files.filter((f) => f !== 'package.json')) {
  write(file)
}

const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'))

pkg.name = packageName || getProjectName()

write('package.json', JSON.stringify(pkg, null, 2))
```

### 打印安装完成后的信息

```js
const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

console.log(`\nDone. Now run:\n`)
if (root !== cwd) {
  console.log(`  cd ${path.relative(cwd, root)}`)
}
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
console.log()
```

### 延伸函数 pkgFromUserAgent

提取用户代理信息中的包管理器名称

```js
/**
 * @param {string | undefined} userAgent process.env.npm_config_user_agent
 * @returns object | undefined
 */
function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}
```

## 总结

create-vite 的主要流程是：

1. 获取用户输入的参数（命令行或交互式）
2. 检查是否有同名文件夹；如有，询问是否覆盖原来的内容
3. 根据框架和变体读取模板文件写入文件夹
4. 提示进入文件夹，并执行安装命令

三个有用的 npm 包：

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
