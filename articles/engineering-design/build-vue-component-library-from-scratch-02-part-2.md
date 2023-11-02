# 从零搭建Vue组件库——02.在 Monorepo 模式下集成 Vite 和 TypeScript - Part 2

> 本文参考了稀土掘金上蘑菇王的系列文章——[《从 0 到 1 搭建 Vue 组件库框架》](https://juejin.cn/post/7254341178258505788)，并通过 Github Copilot 的辅助编写功能进行了修改和补充。

## 导航

系列导航：[00.系列大纲](/articles/engineering-design/build-vue-component-library-from-scratch-00.md)

上一篇：[02.在 Monorepo 模式下集成 Vite 和 TypeScript - Part 1](/articles/engineering-design/build-vue-component-library-from-scratch-02-part-1.md)

上半部分，我们通过集成构建工具 Vite 使组件库能构建出产物。下半部分，我们将要集成 TypeScript，为组件库的开发注入类型系统的支持。

## TypeScript 选型与简介

> TypeScript 是基于 JavaScript 之上构建的强类型编程语言。

选择 TypeScript 的理由已经老生常谈了，总结概述如下：

1. 为 js 添加静态类型检查，提前发现运行时出现的类型错误，将大量错误扼杀在编译阶段，提高代码健壮性。
   ![静态类型检查](./images/build-vue-component-library-from-scratch-02-part-2/static-type-checking.png)
2. 与编辑器结合，获得更好的代码提示，甚至实现“代码即文档”的效果(配合注释)，代码可读性的提高可以大幅减少后人上手成本。
   ![代码即文档](./images/build-vue-component-library-from-scratch-02-part-2/code-as-documentation.png)

我们发现，TypeScript 开始发力、获得收益的场景，都是在项目开发的中后期，而前期往往需要我们更多的努力与投入，这就决定了适合使用 TypeScript 的项目往往要有频繁迭代，长期维护的特点。组件库往往期望得到长期维护，若使用率很高的话，也避免不了频繁迭代。

另外，我个人比起静态类型检查，更加青睐 TypeScript 类型对理解代码提供的帮助。很多第三方库缺少文档，但是如果它有相对可靠的类型声明文件，其中的类型注解和接口声明就足以帮助我理解使用方法。从我个体的感受出发，推及到用户的角度，不难想到如果我们的组件库有完善的类型定义，就能隐性地给使用者带来很多帮助。

## 集成 TypeScript

完成了 Vite 的集成，我们可以开始集成 TypeScript 了。在已经安装好 typescript 公共依赖的情况下，所谓集成其实就是填写 tsconfig.json 文件。大部分项目都用着相似的 tsconfig 预设，且稳定之后在迭代过程中很少修改，因此我们不会对配置项做太多介绍。关于 tsconfig.json 的各个配置项，建议直接查阅[官方说明](https://www.typescriptlang.org/tsconfig)。

### tsconfig 到底为了谁？

在先前集成 Vite 过程中，我们没有做任何一点 TypeScript 配置，甚至无视了 IDE 的相关报错，但是丝毫没有影响 Vite 成功解析了我们的 ts 文件，并且构建出了产物。如果你平时习惯使用 Vite 脚手架生成 ts 项目，可能会感到有点反直觉，以为没有配好 ts 应该会导致构建过程出错。

其实，在 Vite 官方文档中，是这样 [介绍](https://cn.vitejs.dev/guide/features.html#typescript) 与 TypeScript 的关系的：

> Vite 天然支持引入 .ts 文件。请注意，Vite 仅执行 .ts 文件的转译工作，并不执行任何类型检查。并假定类型检查已经被你的 IDE 或构建过程处理了。

Vite 本质上是双引擎架构——内部除了 Rollup 之外，还集成了另一个构建工具 Esbuild。Esbuild 有着超快的编译速度，它在其中负责第三方库构建和 TS/JSX 语法编译。

无论是构建模式还是开发服务器模式，Vite 都通过 Esbuild 来将 ts 文件转译为 js，对这个过程的细节感兴趣的同学，可以前往 [Vite 源码 - Esbuild](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/esbuild.ts) 插件 分析。

我们可以理解为，Vite 为了保证构建效率，内部并没有执行完整的 tsc 编译过程，而是每当遇到一个 ts 文件，就组装出一个最小化的、剔除了所有与类型检查相关配置的 tsconfig，交由 Esbuild 做转译工作——这个转译只确保生成对应的 js 产物，不做任何多余的事情。因此，仅仅做单文件的转译几乎不需要多少 tsconfig 配置，以至于在没有 tsconfig.json 的情况下，Vite 的转译工作都能在绝大多数情况下获得正确预期结果。

在源码中可以看到，tsconfig.json 只有极其有限的几个字段可能对构建结果产生影响。

![能对构建结果产生影响的字段](./images/build-vue-component-library-from-scratch-02-part-2/fields-would-affect-result.png)

既然 tsconfig 对于 Vite 构建的影响如此之小，那么我们配置它更多地是为了什么？其实 Vite 文档中的那句 **“假定类型检查已经被你的 IDE 或构建过程处理了”** 就很好地揭示了答案：

- tsconfig 主要写给 IDE 看的，为了让 IDE 能够实现类型检查，提示我们代码中的类型错误。
- Vite 不负责类型检查，并且推荐我们在构建过程中于另一个进程单独执行类型检查，那么 tsconfig 就应该提供给执行检查任务的编译器 tsc。

### 规划 TypeScript 分治策略

下面我们开始规划整个项目的 tsconfig 配置。对于每个 tsconfig.json 文件，我们主要从以下两个角度理解：

- 每个 tsconfig.json 将一个文件集合声明为一个 ts project(如果称为项目则容易产生概念混淆，故叫做 ts project)，通过 include 描述集合中包含的文件、exclude 字段声明了集合中需要排除的文件。注意，除了 node_modules 中的三方依赖，每个被引用的源码文件都要被包含进来。
- compilerOptions 是编译选项，决定了 TypeScript 编译器在处理该 ts project 包含的文件时所采取的策略与行为。

```json
{
  "compilerOptions": {
    // 项目的编译选项
  },
  "include": [
    // 项目包含哪些文件
  ],
  "exclude": [
    // 在 include 包含的文件夹中需要排除哪些文件
  ]
}
```

include 与 exclude 字段通过 [glob](https://docs.python.org/zh-cn/3/library/glob.html) 语法进行文件匹配，不熟悉的同学可以通过以下文章简单了解：

[前端工程化之强大的glob语法](https://juejin.cn/post/6876363718578405384)

[glob 模式匹配简明教程](https://juejin.cn/post/6844904077801816077)

我们会将整个工程划分为多个 ts project，应该采用什么样的划分依据呢？我们可以参考 element-plus 的划分策略，不是将每个子模块划分为一个 ts project，分散在各个包中管理。而是将功能相似的代码划分到一个 ts project 中，集中在根目录下管理。

![element-plus-ts-ref](./images/build-vue-component-library-from-scratch-02-part-2/element-plus-ts-ref.png)

对于每个 TypeScript 项目而言，编译选项 compilerOptions 大部分都是重复的，因此我们需要建立一个基础配置文件 tsconfig.base.json，供其他配置文件继承。

```json
// tsconfig.base.json
{
  "compilerOptions": {
    // tsc 编译产物输出目录
    "outDir": "dist",
    // 编译目标 js 的版本
    "target": "es2018",
    // 设置程序的模块系统
    "module": "esnext",
    // 项目基础目录
    "baseUrl": ".",
    // 是否生成辅助 debug 的 .map.js 文件
    "sourceMap": false,
    // 模块解析策略
    "moduleResolution": "node",
    "allowJs": false,
    // 严格模式类型检查，建议开启
    "strict": true,
    // 不允许有未使用的变量
    "noUnusedLocals": true,
    // 允许引入 .json 模块
    "resolveJsonModule": true,
    // 与 esModuleInterop 配合允许从 commonjs 的依赖中直接按 import XX from 'xxx' 的方式引入 default 模块
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    // 产物不消除注释
    "removeComments": false,
    // 项目的根目录
    "rootDir": ".",
    // 默认引入的模块类型声明
    "types": [],
    // 路径别名设置
    "paths": {
      "@wonderful-element/*": ["packages/*"]
    }
  }
}
```

我们将所有 node 环境下执行的脚本、配置文件划分为一个 ts project，准备其配置文件 tsconfig.node.json。

```json
// tsconfig.node.json
{
  // 继承基础配置
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    // 该 ts project 将被视作一个部分，通过项目引用(Project References)功能集成到一个 tsconfig.json 中
    "composite": true,
    // node 脚本没有 dom 环境，因此只集成 esnext 库即可
    "lib": ["ESNext"],
    // 继承 Node.js 库函数的类型声明
    "types": ["node"],
    // 跳过库声明文件的类型检查
    "skipLibCheck": true
  },
  "include": [
    // 目前项目中暂时只有配置文件，如 vite.config.ts
    "**/*.config.*"
  ],
  "exclude": [
    // 暂时先排除产物目录，packages/xxx/dist/x.config.js 或者 node_modules/pkg/x.config.js 不会被包含进来
    "**/dist",
    "**/node_modules"
  ]
}
```

对于所有模块中 src 目录下的源码文件，它们几乎都是组件库的实现代码，大多要求浏览器环境下特有的 API(例如 DOM API)，且相互之间存在依赖关系。我们创建 tsconfig.src.json 将它们划入同一个 ts project 中。

```json
// tsconfig.src.json
{
  // 继承基础配置
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    // 组件库依赖浏览器的 DOM API
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "types": ["node"]
  },
  "include": ["typings/env.d.ts", "packages/**/src"]
}
```

到此，IDE 还是无法正常提供类型服务，我们最终还是要在根目录建立一个总的 tsconfig.json，通过 [项目引用(Project References)功能](https://www.typescriptlang.org/docs/handbook/project-references.html) 将多个 compilerOptions.composite = true 的 ts project 聚合在一起，这样 IDE 才能够识别。

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",
    "moduleResolution": "node",

    // vite 会读取到这个 tsconfig 文件(位于工作空间根目录)，按照其推荐配置这两个选项
    // https://cn.vitejs.dev/guide/features.html#typescript-compiler-options
    "isolatedModules": true,
    "useDefineForClassFields": true
  },
  "files": [],
  "references": [
    // 聚合 ts project
    { "path": "./tsconfig.src.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

[项目引用(Project References)](https://www.typescriptlang.org/docs/handbook/project-references.html) 特性，简单理解就是为项目的不同部分应用不同 tsconfig 的能力，如果希望更详细地了解，除了官方文档外，推荐阅读以下文章：

[探究 tsconfig.node.json 文件和 references 字段的作用](https://juejin.cn/post/7126043888573218823)

[Nest.js 这么大的项目是怎么优化 ts 编译性能的？](https://juejin.cn/post/7181462211964076093)

完成配置后，若出现下图中的效果，且源代码中没有任何 ts 报错，则代表我们的配置是完全正确的——对于组件源码文件，IDE 准确地识别了它的归属 tsconfig.src.json。Vite 配置文件作为 Node.js 脚本，也被 IDE 划拨到 tsconfig.node.json。

![tsconfig-src](./images/build-vue-component-library-from-scratch-02-part-2/tsconfig-src.png)
![tsconfig-node](./images/build-vue-component-library-from-scratch-02-part-2/tsconfig-node.png)

注意：VSCode 的 TypeScript 状态有时会有更新延迟。遇到这种情况，可以尝试通过 Ctrl + P 调出命令框，搜索 reload 关键字，执行 Developer: Reload Window 指令重载 IDE。

如果对 tsconfig 实际应用的编译选项或者包含的文件产生疑惑，可以通过以下命令去验证：

```bash
npx tsc -p tsconfig.src.json --showConfig

# 输出结果
{
    "compilerOptions": {
        # ...
        # 最终编译选项
    },
    "files": [
        # 实际包含的文件
        "./typings/env.d.ts",
        "./packages/button/src/index.ts",
        "./packages/input/src/index.ts",
        "./packages/shared/src/hello.ts",
        "./packages/shared/src/index.ts",
        "./packages/shared/src/useLodash.ts",
        "./packages/ui/src/index.ts"
    ],
    "include": [
        "typings/env.d.ts",
        "packages/**/src"
    ]
}
```

未来随着项目的增长，我们会根据实际情况不断更新这些 tsconfig，例如让已有的 ts project 包含更多的源码；或者划分出新的 ts project(比如测试专用的 tsconfig.test.json)。

最后，我们还要补充一些缺失的类型声明：

- 我们在 tsconfig 文件中设置了 "types": ["node"]，代表注入 Node.js 各种库函数的类型声明，这需要我们在根目录下补充安装 @types/node。

  ```bash
  pnpm i -wD @types/node
  ```

- 我们在 tsconfig.src.json 的 include 字段中包含了 typings/env.d.ts，这是为了让 TypeScript 对于 Vite 的一些特定功能提供类型定义(参考：TypeScript 的智能提示)，我们应该实际创建这个文件。这个文件除了服务于 Vite，在后续可能将其他一些环境相关的类型定义放在这里。

  ```ts
  // typings/env.d.ts
  /// <reference types="vite/client" />
  ```
