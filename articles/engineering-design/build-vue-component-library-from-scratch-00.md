# 从零搭建Vue组件库——00.系列大纲

> 本文参考了稀土掘金上蘑菇王的系列文章——[《从 0 到 1 搭建 Vue 组件库框架》](https://juejin.cn/post/7254341178258505788)，并通过 Github Copilot 的辅助编写功能进行了修改和补充。

## 系列内容导航

本系列文章将会从零开始搭建一个 Vue 组件库，主要包括以下内容：

- [x] [01.搭建 Monorepo 项目结构](/articles/engineering-design/build-vue-component-library-from-scratch-01.md)
- [x] [02.使用 Vite 搭建开发环境](/articles/engineering-design/build-vue-component-library-from-scratch-02-part-1.md)
- [ ] 03.集成 Lint 代码检查
- [ ] 04.Monorepo 下的模块打包
- [ ] 05.组件库的样式方案设计
- [ ] 06.建立可直接复用组件的文档网站
- [ ] 07.接入单元测试与 E2E 测试
- [ ] 08.版本管理和发布机制
- [ ] 09.持续集成与持续部署

## 为什么要从零搭建组件库

在日常开发中，我们可能会使用一些成熟的组件库，如 [Element Plus](https://element-plus.org/#/zh-CN)、[Ant Design Vue](https://2x.antdv.com/docs/vue/introduce-cn/) 等。这些组件库都是经过多个项目验证过的，可以直接拿来使用，非常方便。

那么既然有这么多成熟的组件库，为什么还要从零搭建组件库呢？

- **学习组件库的设计思想**：组件库的设计思想是非常值得学习的，它们是如何设计组件的，如何设计组件的 API，如何设计组件的样式方案，如何设计组件的文档网站等等，这些都是非常值得我们学习的。
- **提升自己的能力**：从零搭建组件库，可以让我们学习到很多知识，如组件库的设计思想、Monorepo 的项目结构、组件库的打包、组件库的样式方案、组件库的文档网站、单元测试、E2E 测试、版本管理和发布机制、持续集成和持续部署等等，这些都是非常有用的知识，可以提升我们的能力。
- **提升自己的影响力**：从零搭建组件库，可以让我们在团队中提升自己的影响力，可以让我们更好地推动项目的发展。

## 技术选型

本系列文章将使用以下技术：

- [pnpm](https://pnpm.io/)：Monorepo 项目管理工具
- [Vue 3](https://v3.cn.vuejs.org/)：组件库基于 Vue 3 开发
- [Vite](https://vitejs.dev/)：开发环境搭建
- [TypeScript](https://www.typescriptlang.org/)：提供类型支持
- [VitePress](https://vitepress.vuejs.org/)：文档网站搭建
- [Vitest](https://vitejs.dev/guide/api-test.html#vite-test)：处理单元测试
- [Playwright](https://playwright.dev/)：处理 E2E 测试
- [ESLint](https://eslint.org/): 代码检查
- [Stylelint](https://stylelint.io/): 样式检查
- [Prettier](https://prettier.io/): 代码格式化
- [Commitlint](https://commitlint.js.org/#/): 提交信息检查
- [Changesets](https://github.com/changesets/changesets): 版本管理
- [GitHub Actions](https://docs.github.com/cn/actions): 持续集成和持续部署

## 组件库基础设施

### 目录结构

在造轮子前，学习一下成熟的组件库的目录结构是非常有必要的，这里以 [Element Plus](https://element-plus.org/#/zh-CN) 的 packages 目录为例，它的目录结构如下：

```bash
📦element-plus
 ┣ 📂...
 ┣ 📂packages
 ┃ ┣ 📂components         # 各种 UI 组件
 ┃ ┃ ┣ 📂button
 ┃ ┃ ┣ 📂input
 ┃ ┃ ┣ 📂...
 ┃ ┃ ┗ 📜package.json
 ┃ ┣ 📂utils              # 公用方法包
 ┃ ┃ ┗ 📜package.json
 ┃ ┣ 📂theme-chalk        # 组件样式包
 ┃ ┃ ┗ 📜package.json
 ┃ ┣ 📂element-plus       # 组件统一出口
 ┃ ┃ ┗ 📜package.json
 ┣ 📜...
```

从目录结构中，我们可以看出，它是一个 Monorepo 项目，这也是目前比较流行的组件库项目结构。Monorepo 项目的好处是可以将多个相关的项目放在一个仓库中，方便管理，也方便开发者在多个项目之间切换(相关阅读：[带你了解更全面的 Monorepo - 优劣、踩坑、选型](https://juejin.cn/post/7215886869199896637))。

### 代码规范

在开源多人协作的项目中，代码规范是非常重要的，它可以让代码更加规范，也可以让代码更加易读，从而提高项目的可维护性。在本系列文章中，我们将使用以下工具来规范代码：

- [ESLint](https://eslint.org/)：检查 JavaScript 代码
- [Stylelint](https://stylelint.io/)：检查样式代码
- [Prettier](https://prettier.io/)：格式化代码
- [Commitlint](https://commitlint.js.org/#/)：检查提交信息

在后续的系列文章中，将会详细介绍如何配置这些工具。

### 打包构建

从[Element Plus](https://element-plus.org/#/zh-CN)的 internal/build 目录中可以找到它的打包构建脚本，是基于 [Rollup](https://rollupjs.org/guide/en/) API 实现的自定义构建脚本。

这样做的好处是：一方面可以更好地管理打包流程，另一方面是为了生成可用性尽可能高的产物。可以从 package.json 看出 element-plus 到底构建出了多少不同规格的产物。

```json
// 摘自 element-plus 的 package.json
{
  // cjs 入口
  "main": "lib/index.js",
  // esm 标准入口
  "module": "es/index.mjs",
  // d.ts 类型声明入口
  "types": "es/index.d.ts",
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.mjs",
      "require": "./lib/index.js"
    },
    "./es": {
      "types": "./es/index.d.ts",
      "import": "./es/index.mjs"
    },
    "./lib": {
      "types": "./lib/index.d.ts",
      "require": "./lib/index.js"
    },
    "./es/*.mjs": {
      "types": "./es/*.d.ts",
      "import": "./es/*.mjs"
    },
    "./es/*": {
      "types": ["./es/*.d.ts", "./es/*/index.d.ts"],
      "import": "./es/*.mjs"
    },
    "./lib/*.js": {
      "types": "./lib/*.d.ts",
      "require": "./lib/*.js"
    },
    "./lib/*": {
      "types": ["./lib/*.d.ts", "./lib/*/index.d.ts"],
      "require": "./lib/*.js"
    },
    "./*": "./*"
  },
  // 为 <script> 直接引入提供的全量版本，上传到 unpkg 和 jsdelivr cdn。
  "unpkg": "dist/index.full.js",
  "jsdelivr": "dist/index.full.js"
}
```

前端的运行环境是复杂的，最大限度地保证产物的可用性并不是一件容易的事情(相关阅读：[Monorepo 下的模块包设计实践](https://juejin.cn/post/7052271542000074782))。

### 样式

element-plus 的 packages/theme-chalk 目录，使用 Sass 预处理器构建了一套主题预设方案，使得用户可以个性化地修改组件的主题样式。
我们为自己的组件库制定样式方案时，也会基于以下几个角度思考：

- “换肤能力”称得上是当下组件库的标配，我们的方案能支持主题切换功能吗？
- 如何尽可能地减少组件库样式与用户样式的冲突？
- 如何让用户方便地修改微调组件样式？

### 文档

文档是否友好也是评价一个组件库是否好用的重要标准。element-plus 有全面完善的官方文档，兼具组件效果展示、代码展示、甚至还有对网络环境要求不那么高的在线演示 Playground。
做好组件库的文档并不是一件简单的事情，其中也有很多值得思考的问题：

- 用什么工具能够兼顾搭建效率与定制的灵活性？
- 组件源码怎样直接复用到文档中？
- 能不能尽可能地提高自动化生成内容的比例，避免频繁地手动维护，比如组件 API 说明有没有可能通过源码自动生成？
- 如何搭建在线演示 Playground？

### 测试

测试完善度是我们是否选用一款组件库的重要指标，element-plus 拥有 84% 的测试覆盖率，足以说明其作为开源软件是相对成熟可靠的。

完善的单元测试也极大地提高了项目的可靠性，集成到 CI 系统后，在每次合并代码前进行单元测试检查，可以提前识别重构或变更带来的风险。

除了单元测试之外，我们还会对端到端的 UI 测试进行一些探索，从用户交互的角度补充一些测试用例，让项目的可靠性防护更加扎实。

### 发布

我们注意到 element-plus 的版本发布，或者说成熟项目的版本发布都有着一套连贯的流程。

- 将新版本构建出的产物发布到 npm 仓库。
- 基于发布分支，用版本号给代码仓打 tag。
- CHANGELOG 文件会自动根据 github 相关信息，生成特性更新条目。

实现这些能力，需要我们了解 npm 组件发布的优秀实践，并集成一款成熟的发布工具。

### 持续集成

element-plus 的 .github/workflows 目录下存放了各种各样的 Github Actions 剧本。Github Actions 为绝大多数开源项目提供了便捷的持续集成功能，将原本零散的构建、规范检查、测试、发布等流程以流水线的方式串联起来。

我们会以下面三个最关键的场景为核心，去实践持续集成：

- 代码合并门禁检查。
- 自动测试。
- 发布 / 部署流水线。

## 参考资料

本系列涉及到的相关资料汇总如下：

官网与文档：

- [前端框架 Vue 官网](https://v3.cn.vuejs.org/)
- [构建工具 Rollup 官方文档](https://rollupjs.org/guide/zh/)
- [构建工具 Vite 官方文档](https://cn.vitejs.dev/)
- [TypeScript 官网](https://www.typescriptlang.org/zh/)
- [NPM 官网](https://www.npmjs.com/)
- [UI 组件库 Element Plus 官网](https://element-plus.org/#/zh-CN)
- [规范工具 ESLint](https://eslint.org/)
- [规范工具 Stylelint](https://stylelint.io/)
- [规范工具 commitlint](https://commitlint.js.org/#/)
- [代码风格工具 Prettier](https://prettier.io/)
- [单元测试框架 VitePress](https://vitepress.vuejs.org/)
- [E2E 测试框架 Playwright](https://playwright.dev/)
- [版本发布工具 Changesets](https://github.com/changesets/changesets)
- [Github Actions](https://docs.github.com/cn/actions)

分享博文：

- [带你了解更全面的 Monorepo - 优劣、踩坑、选型](https://juejin.cn/post/7215886869199896637)
- [Monorepo 下的模块包设计实践](https://juejin.cn/post/7052271542000074782)
