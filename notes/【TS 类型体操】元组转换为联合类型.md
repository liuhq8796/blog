# 【TS 类型体操】元组转换为联合类型

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00010-medium-tuple-to-union/README.md

## 题目

实现一个 `TupleToUnion<T>` 泛型，它将元组的值覆盖到它的值联合中。

例如：

```ts
type Arr = ["1", "2", "3"];

type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'
```

关键字解析：

-   `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

## 题解

```ts
type TupleToUnion<T extends unknown[]> = T[number];

// or

type TupleToUnion<T> = T extends [infer first, ...infer rest]
    ? first | TupleToUnion<rest>
    : never;
```

关键词解析：

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `T[number]`: 索引访问类型 [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)，可以获取数组 `T` 类型中所有子元素的类型组成联合类型。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `infer`: 条件类型为我们提供了一种使用 `infer` 关键字从我们在真实分支中比较的类型进行推断的方法。在这里，我们使用 `infer` 关键字声明性地引入了名为 `first` 和 `rest` 的新泛型类型变量，而不是指定如何在 `true` 分支中检索 `T` 的元素类型。

- `...`: 剩余参数 [Rest Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters) 标识。除了使用可选参数或重载来制作可以接受各种固定参数计数的函数之外，我们还可以使用剩余参数定义接受无限数量参数的函数。rest 参数出现在所有其他参数之后，并使用 ... 语法。

## 相关挑战

[【TS 类型体操】元组转换为对象](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%AF%B9%E8%B1%A1.md)

Tuple to Enum Object

Union to Tuple

Tuple to Nested Object