# 【TS 类型体操】获取数组的第一个元素

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.md

## 题目

实现一个通用的 `First<T>` ，它接受一个 Array `T` 并返回它的第一个元素的类型。

例如：

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

## 题解

```ts
// 三种方法

//1.类型推断infer
type First<T extends any[]> = T extends [infer First, ...any[]] ? First : never

// or

//2.考虑为空时返回never，否则返回数组的第一个，T extends U表示T类型能被赋值给U类型，这里还涉及到TS类型兼容性
type First<T extends any[]> = T extends [] ? never : T[0]

// or

//3.判断T数组(或者元组)的长度是否为0，若为0则return never，否则返回数组(或者元组)的第一个
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `infer`: 条件类型为我们提供了一种使用 `infer` 关键字从我们在真实分支中比较的类型进行推断的方法。参考：https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types

- `...`: 剩余参数 [Rest Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters) 标识。除了使用可选参数或重载来制作可以接受各种固定参数计数的函数之外，我们还可以使用剩余参数定义接受无限数量参数的函数。rest 参数出现在所有其他参数之后，并使用 ... 语法。

## 相关挑战

[【TS 类型体操】获取数组的最后一个元素](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E8%8E%B7%E5%8F%96%E6%95%B0%E7%BB%84%E7%9A%84%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0.md)
