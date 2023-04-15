# 【源码共读】only-allow | 一行代码统一规范包管理器

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 16 期，链接：https://juejin.cn/post/7083149201869111304。

## 1. 用法

先写用法，方便随时取用 (づ￣ 3 ￣)づ

```json
// package.json
{
  "scripts": {
    "preinstall": "npx -y only-allow npm"
  }
}
```

上面代码中的 "npm" 可以换成你想用的其他包管理器，比如：yarn，pnpm。
​

`-y` 表示跳过安装任何内容之前的提示，请确认键入的包名称。

## 2. 使用场景

如果你的项目需要多人协同开发，那么还是有必要对包管理器做一些强制的要求的。仅靠口头或者文档约定，难免会出现一些疏忽。轻则项目安装出现问题，重则可能导致线上问题。

下面就来分解一下这段代码，研究一下到底是怎么用一行代码统一规范包管理器的。

## 3. preinstall 钩子

具体可参考[npm 文档——"scripts"](https://docs.npmjs.com/cli/v6/using-npm/scripts)

```
依次执行
# install 之前执行这个脚本
preinstall
# 执行 install 脚本
install
# install 之后执行这个脚本
postinstall
```

从名字上就可以看出他们之间的关系，想要在安装之前要求统一包管理器的话，当然是在 preinstall 脚本上做手脚啦~

> npm 现在有个问题：使用 npm 运行 install 时，preinstall 会在依赖安装后执行，用 yarn 和 pnpm 运行 install 倒是正常 Σ(っ °Д °;)っ
> 现在[相关 RFC](https://github.com/npm/rfcs/issues/325) 还是 open 状态，如果你看到这段时问题已经解决，麻烦评论区提醒我删掉这段，3Q~

以 Vue3 源码为例：

```json
// vue-next/package.json
{
  "private": true,
  "version": "3.2.22",
  "scripts": {
    "preinstall": "node ./scripts/preinstall.js"
  }
}
```

这段就是说：在 `npm install` 之前，执行 `node ./scripts/preinstall.js`。
​

顺藤摸瓜，再看一看这个 preinstall.js 的源码：

```javascript
// vue-next/scripts/preinstall.js

if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  );
  process.exit(1);
}
```

大意很简单，校验如果不是 pnpm 执行脚本则输出报错，退出进程。
​

其中有两不太熟悉的东西：`\u001b[33m`、`\u001b[39m`，这两个都是 ANSI 转义代码，可以控制输出到控制台的文本的颜色。我找了篇博客，有兴趣可以瞧一瞧——[《震惊！原来命令行还可以这么玩？！》](https://zhuanlan.zhihu.com/p/31398854)
​

这段代码就可以完成统一规范包管理器的任务，但多个项目总不能都复制一遍吧。这时想起一位老 leader 的话：都 2020 年了(当时是)，前端能写的库都让人写完了。[only-allow](https://github.com/pnpm/only-allow) 这个库确实印证了这句话，它实现了**一行代码统一规范包管理器：**

```json
// package.json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

npx 是 Node.js 的包运行器，它的一个重要特性是——无需先安装命令即可运行命令。也就是说，我们可以不在项目中事先安装 only-allow 包就可以运行 only-allow 命令。

终于到主菜了，下面来看看 only-allow 源码。

## 4. only-allow 源码

通过查看 only-allow 的 package.json 文件，从 `bin` 字段中确定主入口文件为 only-allow/bin.js。

```json
// package.json
{
  "name": "only-allow",
  "version": "1.0.0",
  "bin": "bin.js"
}
```

- `bin` 字段表示要安装到 PATH 的可执行文件，本地安装时即安装在 `./node_modules/.bin/` 目录下。通常是一个对象形式，键名表示命令名称，值表示脚本文件。如果只有单个可执行文件，并且其名称是包的名称，则可以将其作为字符串提供。也就是说上面代码的作用与下面这段代码相同：

```json
// package.json
{
  "name": "only-allow",
  "version": "1.0.0",
  "bin": { "only-allow": "bin.js" }
}
```

再来仔细瞅瞅 bin.js。

```javascript
// only-allow/bin.js

// #! 组成的符号叫做 shebang
// 通常出现在类Unix系统的脚本中第一行
// 用于指明执行这个脚本文件的解释器
#!/usr/bin/env node

// 导入 whichPMRuns 函数，可以获取当前运行的是哪一个包管理器
const whichPMRuns = require('which-pm-runs')
// 一个可以在控制台个性化输出的库
const boxen = require('boxen')

// process.argv 属性返回一个数组，由命令行执行脚本时的各个参数组成
// 它的第一个成员总是 node，第二个成员是脚本文件名，其余成员是脚本文件的参数 形如 [node, scriptName, ...arg]
// 如果执行命令是 npx only-allow pnpm，相当于下载 only-allow 之后执行 node only-allow pnpm
// 此时 process.argv 获取到的就是 ['.../bin/node', '.../only-allow/bin'.js, 'pnpm']
const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.log('Please specify the wanted package manager: only-allow <npm|pnpm|yarn>')
  process.exit(1)
}

const wantedPM = argv[0]
// 如果 wantedPM 不在 npm yarn pnpm 的范围中，则报错并退出进程
if (wantedPM !== 'npm' && wantedPM !== 'pnpm' && wantedPM !== 'yarn') {
  console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: npm, pnpm, or yarn.`)
  process.exit(1)
}

// 获取当前运行的是哪一个包管理器
const usedPM = whichPMRuns()
// 如果当前使用的包管理器和期望使用的包管理器不相等
// 则根据期望使用的包管理器差异化输出报错，然后退出进程
if (usedPM && usedPM.name !== wantedPM) {
  const boxenOpts = { borderColor: 'red', borderStyle: 'double', padding: 1 }
  switch (wantedPM) {
    case 'npm':
      console.log(boxen('Use "npm install" for installation in this project', boxenOpts))
      break
    case 'pnpm':
      console.log(boxen(`Use "pnpm install" for installation in this project.

If you don't have pnpm, install it via "npm i -g pnpm".
For more details, go to https://pnpm.js.org/`, boxenOpts))
      break
    case 'yarn':
      console.log(boxen(`Use "yarn" for installation in this project.

If you don't have Yarn, install it via "npm i -g yarn".
For more details, go to https://yarnpkg.com/`, boxenOpts))
      break
  }
  process.exit(1)
}

```

精华都在注释中 ～(￣ ▽ ￣～)(～￣ ▽ ￣)～

## 5. which-pm-runs 当前运行的是哪一个包管理器

which-pm-runs 导出的函数返回一个对象，包括当前运行的包管理器和版本号。
​

根据调试可知，`process.env.npm_config_user_agent` 是一段类似这样的字符串：
`'yarn/1.22.17 npm/? node/v16.13.0 darwin x64'`

```javascript
// 整个脚本都开启严格模式的语法
"use strict";

module.exports = function () {
  if (!process.env.npm_config_user_agent) {
    return undefined;
  }
  return pmFromUserAgent(process.env.npm_config_user_agent);
};

// 截取字符串，返回一个包含包管理器名称和版本的对象
function pmFromUserAgent(userAgent) {
  const pmSpec = userAgent.split(" ")[0];
  const separatorPos = pmSpec.lastIndexOf("/");
  return {
    name: pmSpec.substr(0, separatorPos),
    version: pmSpec.substr(separatorPos + 1),
  };
}
```

> 警告： 尽管 `String.prototype.substr(…)` 没有严格被废弃 (as in "removed from the Web standards"), 但它被认作是遗留的函数并且可以的话应该避免使用。它并非 JavaScript 核心语言的一部分，未来将可能会被移除掉。如果可以的话，使用 `substring()` 替代它。——[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr)

## 6. 总结

preinstall + only-allow 是一个很实用的统一规范包管理器的实践，尤其是在多人协同开发的项目上。
​

源码难度较低，先看一看再调试跑一跑，基本就能明白了。全部源码看下来，打破了我对源码高不可攀的印象，也学习到了很多原先不了解的东西。
​

收获满满，意犹未尽，继续努力 o(_￣ ▽ ￣_)o
