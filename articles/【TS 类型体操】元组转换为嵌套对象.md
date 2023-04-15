# 【TS 类型体操】元组转换为嵌套对象

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/03188-medium-tuple-to-nested-object/README.md

## 题目

给定一个只包含字符串类型的元组类型 `T` 和一个类型 `U`，递归地构建一个对象。

```ts
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

## 题解

```ts
type TupleToNestedObject<T extends unknown[], U> = T extends [infer First, ... infer Rest]  ? {
  [P in First & string]: TupleToNestedObject<Rest, U>
} : U
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `infer`: 条件类型为我们提供了一种使用 `infer` 关键字从我们在真实分支中比较的类型进行推断的方法。参考：https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types

- `...`: 剩余参数 [Rest Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters) 标识。除了使用可选参数或重载来制作可以接受各种固定参数计数的函数之外，我们还可以使用剩余参数定义接受无限数量参数的函数。rest 参数出现在所有其他参数之后，并使用 ... 语法。

- `&`: 将多个类型合并为一个类型，包含了所有类型的特性，而且要同时满足要交叉的所有类型。

有疑问的点是：题目中明确了元组类型 `T` 只包含字符串，所以我尝试将题解中的泛型参数 `<T extends unknown[], U>` 修改为 `<T extends string[], U>`，但在递归调用 `TupleToNestedObject<Rest, U>` 时发生了错误，错误的含义是：类型 `Rest` 不满足约束 `string[]` 、类型 `unknown[]` 不能分配给类型 `string[]`，也就是说，TS 将 Rest 的类型推断为 `unknown[]`，这里我不知道该如何理解。

另外说一下，其实 `First` 也被推断为了 `unknown`，但在定义索引签名类型时做了处理：`[P in First & string]`，将 `First` 类型与 `string` 交叉，得到了有效的结果。

## 相关挑战

[【TS 类型体操】元组转换为对象](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%AF%B9%E8%B1%A1.md)

[【TS 类型体操】元组转换为联合类型](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B.md)

[【TS 类型体操】元组转换为枚举对象](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E6%9E%9A%E4%B8%BE%E5%AF%B9%E8%B1%A1.md)

[【TS 类型体操】联合类型转换为元组](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%85%83%E7%BB%84.md)
