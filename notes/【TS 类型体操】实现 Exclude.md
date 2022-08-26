# 【TS 类型体操】实现 Exclude

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00043-easy-exclude/README.md

## 题目

实现内置的 `Exclude<T, U>`。

通过从 `T` 中排除可分配给 `U` 的所有联合成员来构造类型。

例如：

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

## 实现 & 解析

```ts
type MyExclude<T, U> = T extends U ? never : T
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `T extends U ? X : Y`: 这是在 ts 2.8 中引入的条件类型，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

  对于联合类型来说会自动分发条件，假如 `T` 是联合类型 `A | B`，那么实际情况就变成 `(A extends U ? X : Y) | (B extends U ? X : Y)`。
