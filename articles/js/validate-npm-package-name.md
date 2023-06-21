# 验证 npm 包名是否合法

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 7 期，链接：[https://juejin.cn/post/7084985308839673886](https://juejin.cn/post/7084985308839673886)。

## 工具介绍

今天的主角：[validate-npm-package-name](https://github.com/npm/validate-npm-package-name)

官方介绍的原文是：

> Give me a string and I'll tell you if it's a valid `npm` package name.
>
> This package exports a single synchronous function that takes a `string` as input and returns an object with two properties:
>
> - `validForNewPackages` :: `Boolean`
> - `validForOldPackages` :: `Boolean`

给我一个字符串，我会告诉你它是否是一个有效的 npm 包名。

此包导出一个同步函数，它接收一个字符串作为输入并返回一个具有两个属性的对象：

- `validForNewPackages` :: `Boolean`
- `validForOldPackages` :: `Boolean`

## 命名规则

下面是有效的 npm 包名应符合的规则列表。

- 包名长度应该大于 0
- 包名的所有字符都必须小写，也就是说不允许使用大写或混合大小写的名称
- 包名可以存在连字符
- 包名不得包含任何非 url 安全字符（因为最终包名会作为 url 的一部分）
- 包名不得以 `.` 或 `_` 开头
- 包名首尾不应包含空格
- 包名不应包含 `~)('!*` 中任何一个字符
- 包名不得与 node.js/io.js 的核心模块或者保留名以及黑名单相同。例如，下列的名字都是无效的：
  - http
  - stream
  - node_modules
  - favicon.ico
- 包名长度不能超过 214

## 示例

### 有效名称

```javascript
var validate = require('validate-npm-package-name')

validate('some-package')
validate('example.com')
validate('under_score')
validate('123numeric')
validate('@npm/thingy')
validate('@jane/foo.js')
```

以上名称都是有效的，所以你会得到这个对象：

```javascript
{
  validForNewPackages: true,
  validForOldPackages: true
}
```

### 无效名称

```javascript
validate('excited!')
validate(' leading-space:and:weirdchars')
```

这些都不是有效名称，所以你会得到这个：

```javascript
{
  validForNewPackages: false,
  validForOldPackages: false,
  errors: [
    'name cannot contain leading or trailing spaces',
    'name can only contain URL-friendly characters'
  ]
}
```

## 过去式名称

在 npm 的旧时代，包命名是很混乱的。它们可以有大写字母，它们可以非常长，它们可以是 npm 现有核心模块的名称。

如果你为此函数指定一个**以前有效**的包名称，你将看到 `validForNewPackages` 属性的值发生更改，并且将出现一个警告数组：

```javascript
validate(
  'eLaBorAtE-paCkAgE-with-mixed-case-and-more-than-214-characters-----------------------------------------------------------------------------------------------------------------------------------------------------------',
)
```

返回：

```javascript
{
  validForNewPackages: false,
  validForOldPackages: true,
  warnings: [
    "name can no longer contain capital letters",
    "name can no longer contain more than 214 characters"
  ]
}
```

## 源码阅读

### 结构概览

```javascript
'use strict'

// 匹配作用域包名的正则
var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
// node 内置模块列表
var builtins = require('builtins')
// 黑名单
var blacklist = ['node_modules', 'favicon.ico']

function validate(name) {
  var warnings = []
  var errors = []

  // ... 校验参数 name 是否符合规范
  // 其实就是一堆 if 判断

  return done(warnings, errors)
}

var done = function (warnings, errors) {
  // 返回处理结果
  var result = {
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    validForOldPackages: errors.length === 0,
    warnings: warnings,
    errors: errors,
  }
  if (!result.warnings.length) {
    delete result.warnings
  }
  if (!result.errors.length) {
    delete result.errors
  }
  return result
}
```

### 检测传入的参数是否存在且是字符串

如果不是字符串，就直接返回结果。

```javascript
if (name === null) {
  errors.push('name cannot be null')
  return done(warnings, errors)
}

if (name === undefined) {
  errors.push('name cannot be undefined')
  return done(warnings, errors)
}

if (typeof name !== 'string') {
  errors.push('name must be a string')
  return done(warnings, errors)
}
```

### 包名不能是空字符串

```javascript
if (!name.length) {
  errors.push('name length must be greater than zero')
}
```

### 包名不得以 `·` 或 `_` 开头

```javascript
if (name.match(/^\./)) {
  errors.push('name cannot start with a period')
}

if (name.match(/^_/)) {
  errors.push('name cannot start with an underscore')
}
```

### 包名首尾不得包含空格

```javascript
if (name.trim() !== name) {
  errors.push('name cannot contain leading or trailing spaces')
}
```

### 包名不得与黑名单、 node.js/io.js 的核心模块或者保留名相同

```javascript
// No funny business
blacklist.forEach(function (blacklistedName) {
  if (name.toLowerCase() === blacklistedName) {
    errors.push(blacklistedName + ' is a blacklisted name')
  }
})

// Generate warnings for stuff that used to be allowed

// core module names like http, events, util, etc
builtins({ version: '*' }).forEach(function (builtin) {
  if (name.toLowerCase() === builtin) {
    warnings.push(builtin + ' is a core module name')
  }
})
```

### 包名长度不得超过 214

```javascript
// really-long-package-names-------------------------------such--length-----many---wow
// the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
if (name.length > 214) {
  warnings.push('name can no longer contain more than 214 characters')
}
```

### 所有字符必须小写

```javascript
// mIxeD CaSe nAMEs
if (name.toLowerCase() !== name) {
  warnings.push('name can no longer contain capital letters')
}
```

### 包名不得包含 `~'!()*` 中任意一个字符

```javascript
if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
  warnings.push('name can no longer contain special characters ("~\'!()*")')
}
```

### 包名不得包含任何非 url 安全字符

```javascript
if (encodeURIComponent(name) !== name) {
  // Maybe it's a scoped package name, like @user/package
  var nameMatch = name.match(scopedPackagePattern)
  if (nameMatch) {
    var user = nameMatch[1]
    var pkg = nameMatch[2]
    if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
      return done(warnings, errors)
    }
  }

  errors.push('name can only contain URL-friendly characters')
}
```

## 总结

比较简单的包，都是一些基本的字符串判断，比较难懂的依然是正则部分，有待继续学习。
