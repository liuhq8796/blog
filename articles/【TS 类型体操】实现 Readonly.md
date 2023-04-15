# 【TS 类型体操】实现 Readonly

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.md

## 题目

实现内置的 `Readonly<T>` 泛型而不使用它自身。

构造一个类型，将 `T` 的所有属性设置为只读，这意味着构造类型的属性不能重新分配。

例如：

```ts
interface Todo {
    title: string
    description: string
}

const todo: MyReadonly<Todo> = {
    title: "Hey",
    description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
```

关键字解析：

- `interface`: 接口声明是命名对象类型的一种方式。

## 题解

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

关键词解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `readonly`: 对于 TypeScript，属性也可以标记为只读。虽然它不会在运行时改变任何行为，但在类型检查期间不能写入标记为只读的属性。

- `keyof`: `keyof` 运算符应用于对象类型并生成其作为键的字符串或数字的联合类型。

  这里的 `keyof T` 会返回以 `T` 对象中所有的键为联合成员的联合类型。

- `in`: `P in keyof T` 执行了一个循环（可以理解为类似 `for...in` 的效果），这里的 `keyof T` 返回一个联合类型，而 `P` 是一个标识符，它映射为 `keyof T` 的每一个子类型。

## 相关挑战

[【TS 类型体操】实现 Readonly 2](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Readonly%202.md)

[【TS 类型体操】实现 Deep Readonly](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Deep%20Readonly.md)
