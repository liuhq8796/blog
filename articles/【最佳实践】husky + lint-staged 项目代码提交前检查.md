# 【最佳实践】husky + lint-staged 项目代码提交前检查

## 1. husky 是什么

husky 是一个 Git Hook 工具。本文主要实现代码提交前进行 eslint 校验，简单说就是，当我们运行 git commit -m 'xxx' 时，检查提交的文件是否通过 eslint 校验。

## 2. 安装

需要安装以下依赖

```bash
// 使用 npm
npm i -D husky lint-staged

// 使用 yarn
yarn add husky lint-staged -D

// 使用 pnpm
pnpm add -D husky lint-staged
```

**注意**：新版 husky、lint-staged 对 node 版本提高了要求，可以按实际情况安装低版本依赖

## 3. 配置

使用 package.json 进行配置或创建独立配置文件，这里以 package.json 为例：

```json
{
  "husky": {
    "hooks": {
      // 提交前运行 lint-staged
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    // 检查提交文件中后缀为 js,jsx,vue 的文件
    "*.{js,jsx,vue}": [
      // 自定义命令，可以自行修改，例如:"eslint --fix"
      // 本例在此处使用了 --no-fix 选项，只做检查不修改
      "vue-cli-service lint",
      "git add"
    ]
  }
}
```

