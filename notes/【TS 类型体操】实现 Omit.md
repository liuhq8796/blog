# 【TS 类型体操】实现 Omit

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00003-medium-omit/README.md

## 题目

实现内置的 `Omit<T, K>` 泛型而不使用它。

通过从 `T` 中选取所有属性然后删除 `K` 来构造一个类型，例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

## 实现 & 解析

```ts
type MyOmit<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P]
}
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `keyof`: `keyof` 运算符应用于对象类型并生成其作为键的字符串或数字的联合类型。

  所以这里的 `K extends keyof T` 是说 `K` 被约束在 `T` 的键名组合成的联合类型中，不能超出这个范围，否则会报错的。

- `in`: `P in Exclude<keyof T, K>` 执行了一个循环（可以理解为类似 `for...in` 的效果），这里的 `Exclude` 返回一个联合类型，而 `P` 是一个标识符，它映射为 `Exclude` 返回的联合类型的每一个子类型。

- `Exclude`: `Exclude<T, K>` 通过从 `T` 中排除可分配给 `K` 的所有联合成员来构造类型。这里的 `Exclude<keyof T, K>` 即是从以 `T` 对象中的键作为联合成员的联合类型中，排除可以分配给 `K` 的所有联合成员后，剩余的联合成员组成的联合类型。

## 相关挑战

[【TS 类型体操】实现 Pick](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Pick.md)

[【TS 类型体操】实现 Exclude](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Exclude.md)
