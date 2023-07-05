# 获取远程 git 仓库所有 tags

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 14 期，链接：[https://juejin.cn/post/7093858913480622087/](https://juejin.cn/post/7093858913480622087/)。

## 用法

```js
import remoteGitTags from 'remote-git-tags'

console.log(await remoteGitTags('https://github.com/sindresorhus/remote-git-tags'))
//=> Map {'v1.0.0' => '69e308412e2a5cffa692951f0274091ef23e0e32', …}
```

这个库的作用就是从远程 git 仓库中获取到所有 tags 并返回一个 Map，key 为 tag 名称，value 为 tag 的 commit hash。

原理其实就是通过执行 `git ls-remote --tags [url(仓库路径)]` 获取 `tags`。

可以从[npm 包描述信息](https://link.juejin.cn/?target=https%3A%2F%2Fnpm.im%2Fremote-git-tags)中看到有哪些包依赖这个包，其中一个比较熟悉的是[npm-check-updates](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnpm-check-updates)。

> `npm-check-updates` 将您的 `package.json` 依赖项升级到最新版本，忽略指定的版本。

其他可能的使用场景是从 `github` 中获取所有 `tags` 信息，切换 `tags` 或者选定 `tags` 发布版本等。

## 源码解读

先看一下 `package.json` 文件。

### package.json

```json
// package.json
{
  // 指定 Node 以什么模块加载，缺省时默认是 commonjs
  "type": "module",
  // 公开包模块，作为 "main" 字段的替代
  "exports": "./index.js",
  // 指定 nodejs 的版本
  "engines": {
    "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
  },
  "scripts": {
    "test": "xo && ava"
  }
}
```

- [`"type"`](https://nodejs.org/api/packages.html#type) 字段定义了 `Node.js` 用于以该 `package.json` 文件作为最近父级的所有 `.js` 文件的模块格式。
- [`"exports"`](https://nodejs.org/api/packages.html#exports) 字段提供了一种方法来为不同环境和 javascript 风格公开包模块，`Node.js` 12+ 支持它作为 [`"main"`](https://nodejs.org/api/packages.html#main) 的替代方案。
- [`"engines"`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines) 字段可以指定运行该包模块所需的 `Node.js` 版本(这里最低版本定为 12+ 应该是为了让 `Node.js` 能够识别 `exports` 字段)以及能够正确安装该包模块的 `npm` 版本。

知周所众，`Node` 曾经是 `CommonJs` 模块机制，`Node 13` 添加了对标准 `ES6` 模块的支持。对于以 `.js` 结尾的文件，默认是 `CommonJs` 模块，但如果同级目录及所有父目录有 `package.json` 文件，且 `type` 属性为 module，则会被视为 `ES6` 模块。`type` 值为 `commonjs` 或者为空或者没有 `package.json` 文件，都是默认 `CommonJs` 模块加载。

除了使用 `package.json` 文件指定，告诉 `Node` 它要加载的是什么模块最简单的方式，就是将信息编码到不同的扩展名中。如果是 `.mjs` 结尾的文件，则 `Node` 始终会将它作为 `ES6` 模块来加载，如果是 `.cjs` 结尾的文件，则 `Node` 始终会将它作为 `CommonJs` 模块来加载。

关于 `Node` 模块加载方式，在《JavaScript 权威指南第 7 版》16.1.4 `Node` 模块 小节，有更加详细的讲述。此书第 16 章都是讲述`Node`，感兴趣的读者可以进行查阅。

### 主文件，仅有 22 行源码

```js
// index.js
import { promisify } from 'node:util'
import childProcess from 'node:child_process'

const execFile = promisify(childProcess.execFile)

export default async function remoteGitTags(repoUrl) {
  const { stdout } = await execFile('git', ['ls-remote', '--tags', repoUrl])
  const tags = new Map()

  for (const line of stdout.trim().split('\n')) {
    const [hash, tagReference] = line.split('\t')

    // Strip off the indicator of dereferenced tags so we can override the
    // previous entry which points at the tag hash and not the commit hash
    // `refs/tags/v9.6.0^{}` → `v9.6.0`
    const tagName = tagReference.replace(/^refs\/tags\//, '').replace(/\^{}$/, '')

    tags.set(tagName, hash)
  }

  return tags
}
```

源码不多，下面来一步步拆解一下。

### node:util

[Core modules 文档](https://nodejs.org/dist/latest-v16.x/docs/api/modules.html#core-modules)

> Core modules can also be identified using the node: prefix, in which case it bypasses the require cache. For instance, require('node:http') will always return the built in HTTP module, even if there is require.cache entry by that name.

翻译一下：

> 核心模块也可以使用 node: 前缀来识别，在这种情况下，它会绕过 require 缓存。例如， require('node:http') 将始终返回内置的 HTTP 模块，即使存在该名称的 require.cache 条目。

所以源码的前两行代码其实就是引用了 node 的 util 和 child_process 核心模块。

### promisify

源码的第三行：

```js
const execFile = promisify(childProcess.execFile)
```

这里有我们的重头戏 `promisify`，它是一个函数，作用是将一个 `callback` 形式的函数转换成一个 `Promise` 形式的函数。

[utils promisify 文档](https://nodejs.org/dist/latest-v16.x/docs/api/util.html#utilpromisifyoriginal)

#### promisify 源码

```js
const kCustomPromisifiedSymbol = SymbolFor('nodejs.util.promisify.custom')
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs')

let validateFunction

function promisify(original) {
  // Lazy-load to avoid a circular dependency.
  if (validateFunction === undefined) ({ validateFunction } = require('internal/validators'))

  validateFunction(original, 'original')

  if (original[kCustomPromisifiedSymbol]) {
    const fn = original[kCustomPromisifiedSymbol]

    validateFunction(fn, 'util.promisify.custom')

    return ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true,
    })
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol]

  function fn(...args) {
    return new Promise((resolve, reject) => {
      ArrayPrototypePush(args, (err, ...values) => {
        if (err) {
          return reject(err)
        }
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {}
          for (let i = 0; i < argumentNames.length; i++) obj[argumentNames[i]] = values[i]
          resolve(obj)
        } else {
          resolve(values[0])
        }
      })
      ReflectApply(original, this, args)
    })
  }

  ObjectSetPrototypeOf(fn, ObjectGetPrototypeOf(original))

  ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true,
  })
  return ObjectDefineProperties(fn, ObjectGetOwnPropertyDescriptors(original))
}

promisify.custom = kCustomPromisifiedSymbol
```

promisify 的源码牵扯了许多其他模块，一时间可能难以看懂，所以我们就参考源码提取出一些关键部分，做一个简版的实现。

#### 简单实现

```js
const imageSrc = 'https://www.pexels.com/zh-cn/photo/1034662/'

function loadImage(src, callback) {
  const image = document.createElement('img')
  image.src = src
  image.alt = '城市图片'
  image.style = 'width: 350px;height: 440px'
  image.onload = () => callback(null, image)
  image.onerror = () => callback(new Error('加载失败'))
  document.body.append(image)
}

function promisify(original) {
  function fn(...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...values) => {
        if (err) {
          return reject(err)
        }
        resolve(values)
      })
      // original.apply(this, args);
      Reflect.apply(original, this, args)
    })
  }
  return fn
}

const loadImagePromise = promisify(loadImage)
async function load() {
  try {
    const res = await loadImagePromise(imageSrc)
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}
load()
```

简化后的代码就显得简单易懂了，虽然返回值和原版还有差别，但作为实现 promisify 的例子它已经足够了。

如果想进一步优化和了解的话，也可以看看 [es6-promisify](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmikehall314%2Fes6-promisify) 这个库的实现。

### child_process 子进程

如果你在前端工作中有编写一些前端工具，不可避免需要使用 `child_process` 这个模块，并且可以使用它进行文件压缩、脚本运行等操作。

本篇中用到的就是 `child_process` 子进程的 execFile 方法，它可以启动一个子进程来执行可执行文件。在本篇中它执行的就是上一节提到的 `git ls-remote --tags` 命令。

如果想继续了解 `child_process` 子进程，可以查看另一篇文章：[玩转 node 子进程 — child_process](https://juejin.cn/post/6882290865763680264)。

### git ls-remote --tags

支持远程仓库链接。

[git ls-remote 文档](https://link.juejin.cn/?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-ls-remote)

效果长这样：

```
$ git ls-remote --tags ./.
d6602ec5194c87b0fc87103ca4d67251c76f233a	refs/tags/v0.99
f25a265a342aed6041ab0cc484224d9ca54b6f41	refs/tags/v0.99.1
7ceca275d047c90c0c7d5afb13ab97efdf51bd6e	refs/tags/v0.99.3
c5db5456ae3b0873fc659c19fafdde22313cc441	refs/tags/v0.99.2
0918385dbd9656cab0d1d81ba7453d49bbc16250	refs/tags/junio-gpg-pub
$ git ls-remote http://www.kernel.org/pub/scm/git/git.git master seen rc
5fe978a5381f1fbad26a80e682ddd2a401966740	refs/heads/master
c781a84b5204fb294c9ccc79f8b3baceeb32c061	refs/heads/seen
$ git remote add korg http://www.kernel.org/pub/scm/git/git.git
$ git ls-remote --tags korg v\*
d6602ec5194c87b0fc87103ca4d67251c76f233a	refs/tags/v0.99
f25a265a342aed6041ab0cc484224d9ca54b6f41	refs/tags/v0.99.1
c5db5456ae3b0873fc659c19fafdde22313cc441	refs/tags/v0.99.2
7ceca275d047c90c0c7d5afb13ab97efdf51bd6e	refs/tags/v0.99.3
```

拿到这串字符串后，就可以做最后的格式化处理了，这部分就不细讲了。至此，`remote-git-tags` 的源码究竟做了什么我们已经全部弄明白了，好耶！

## 总结

一句话简述 `remote-git-tags` 执行过程：使用 `Node.js` 的子进程 `child_process` 模块的 `execFile` 方法执行 `git ls-remote --tags repoUrl` 获取所有 `tags` 和 `tags` 对应 `hash` 值存放在 `Map` 对象中。

短短 22 行源码中包含了 `Node` 核心模块加载，`child_process.execFile` 方法的使用，`git ls-remote --tags` 命令的作用，`promisify` 函数的实现和 `Map`、`for of`、解构赋值等 `ES6+` 语法知识，可谓是短小精悍了。
