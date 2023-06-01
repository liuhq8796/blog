# 无法识别组件类型的解决方案

## 问题描述

截止此文章撰写时，当使用 TS + unplugin-vue-components 插件以及 pnpm 包管理器时，会出现 TS 无法识别自动引入组件的类型的问题，相关的 issue 有：[components.d.ts it looks does not work](https://github.com/antfu/unplugin-vue-components/issues/608)。

## 解决方案

首先要确认的是项目中的 `tsconfig.json` 配置文件中包含了 `components.d.ts` 文件，如下：

```json
{
  "include": ["components.d.ts"]
}
```

如果你只是忘了这一步，那么恭喜你，问题解决了。

如果你已经配置过了该文件但仍没有解决问题，那么请继续往下看。

根据 issue 中的讨论，我们可以推断出这个问题是由于使用了幻影依赖导致的，也就是那些被提升到模块目录的根目录的依赖。而 pnpm 的初衷之一就是创建非扁平的 `node_modules`，它的机制会使项目无法使用幻影依赖。

因此，我们可以通过在项目根目录下创建 `.npmrc` 文件并添加如下内容来提升部分依赖以使项目可以使用这些幻影依赖：

```sh
# component.d.ts it looks does not work
# https://github.com/antfu/unplugin-vue-components/issues/608
public-hoist-pattern[]="@vue/runtime-core"
```
