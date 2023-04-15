# 【TS 类型体操】实现 Push

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/03057-easy-push/README.md

## 题目

实现 `Array.push` 的通用版本

例如：

```ts
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

## 题解

```ts
type Push<T extends unknown[], U> = [...T, U]
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `...`: 在这里是扩展运算符的展开语法而非剩余参数。

## 相关挑战

[WIP]

Concat

Unshift
