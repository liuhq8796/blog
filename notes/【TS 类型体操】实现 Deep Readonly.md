# 【TS 类型体操】实现 Deep Readonly

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00009-medium-deep-readonly/README.md

## 题目

实现一个 `DeepReadonly<T>` 泛型，它使对象的每个参数 - 及其递归的子对象 - 只读。

你可以假设我们在这个挑战中只处理对象。数组、函数、类等不需要考虑。但是，您仍然可以通过涵盖尽可能多的不同案例来挑战自己。

例如：

```ts
type X = {
    x: {
        a: 1
        b: 'hi'
    },
    y: 'hey'
}

type Expected = {
    readonly x: {
        readonly a: 1
        readonly b: 'hi'
    }
    readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

## 题解

```ts
type DeepReadonly<T> = {
  readonly [k in keyof T]: T[k] extends Record<any, any>
    ? T[k] extends Function
      ? T[k]
      : DeepReadonly<T[k]>
    : T[k]
}

// or

type DeepReadonly<T> = keyof T extends never
  ? T
  : { readonly [k in keyof T]: DeepReadonly<T[k]> };
```

关键字解析：

- `readonly`: 对于 TypeScript，属性也可以标记为只读。虽然它不会在运行时改变任何行为，但在类型检查期间不能写入标记为只读的属性。

- `keyof`: `keyof` 运算符应用于对象类型并生成其作为键的字符串或数字的联合类型。

- `in`: `P in K` 执行了一个循环（可以理解为类似 `for...in` 的效果），这里的 `K` 是一个联合类型，而 `P` 是一个标识符，它映射为 `K` 的每一个子类型。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `Record<K, T>`: 构造一个对象类型，其属性键为 `K`，其属性值为 `T`。此实用程序可用于将一种类型的属性映射到另一种类型。

## 相关挑战

[【TS 类型体操】实现 Readonly](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Readonly.md)

[【TS 类型体操】实现 Readonly 2](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Readonly%202.md)
