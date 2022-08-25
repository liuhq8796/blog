# 【TS 类型体操】实现 Pick

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.md

## 题目

实现内置的 `Pick<T, K>` 泛型而不使用它自身。

通过从 T 中选择一组属性 K 来构造一个类型，例如：

```ts
interface Todo {
    title: string
    description: string
    completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'description'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

## 实现 & 解析

```ts
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `keyof`: `keyof` 运算符应用于对象类型并生成其作为键的字符串或数字的联合类型。

  所以这里的 `K extends keyof T` 是说 K 被约束在 T 的键名组合成的联合类型中，不能超出这个范围，否则会报错的。

- `in`: `P in K` 执行了一个循环（可以理解为类似 for...in 的效果），这里的 K 是一个联合类型，而 P 是一个标识符，它映射为 K 的每一个子类型。

## 相关挑战

[【TS 类型体操】实现 Omit](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Omit.md)
