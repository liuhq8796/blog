# 【TS 类型体操】联合类型转换为交叉类型

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00055-hard-union-to-intersection/README.md

## 题目

实现高级实用程序类型 `UnionToIntersection<U>`

例如：

```ts
type I = Union2Intersection<'foo' | 42 | true> // expected to be 'foo' & 42 & true
```

## 题解

```ts
type UnionToIntersection<U> = (U extends any ? (arg: U) => any : never) extends ((arg: infer I) => void) ? I : never
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `infer`: 条件类型为我们提供了一种使用 `infer` 关键字从我们在真实分支中比较的类型进行推断的方法。参考：https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
