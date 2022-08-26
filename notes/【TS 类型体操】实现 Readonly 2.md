# 【TS 类型体操】实现 Readonly 2

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00008-medium-readonly-2/README.md

## 题目

实现一个 `MyReadonly2<T, K>` 泛型，它接受两个类型参数 `T` 和 `K`。

`T` 中的 `K` 属性将被设定为只读。当没有提供 `K` 时，它应该像普通的 `Readonly<T>` 一样使所有属性只读。

例如：

```ts
interface Todo {
    title: string
    description: string
    completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

## 实现 & 解析

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = Readonly<Pick<T, K>> & Omit<T, K>
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `keyof`: `keyof` 运算符应用于对象类型并生成其作为键的字符串或数字的联合类型。

  所以这里的 `K extends keyof T` 是说 `K` 被约束在 `T` 的键名组合成的联合类型中，不能超出这个范围，否则会报错的。

  另外，如果没有提供 `K`，则会已默认值 `Keyof T` 作为 `K`。

- `&`: 将多个类型合并为一个类型，包含了所有类型的特性，而且要同时满足要交叉的所有类型。

- `Readonly<T>`: 构造一个 `T` 的所有属性都设置为 `readonly` 的类型，这意味着构造类型的属性不能被重新分配。

  这里的 `Readonly<Pick<T, K>>` 就是将 `Pick<T, K>` 返回的类型的所有属性都设置为 `readonly` 的类型。

- `Pick<T, K>`: 通过从 `T` 中选择一组属性 `K`（字符串文字或字符串文字的联合）来构造一个类型。

- `Omit<T, K>`: 通过从 `T` 中选择所有属性然后删除 `K`（字符串文字或字符串文字的联合）来构造一个类型。

## 相关挑战

[【TS 类型体操】实现 Readonly](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Readonly.md)

[【TS 类型体操】实现 Deep Readonly](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%AE%9E%E7%8E%B0%20Deep%20Readonly.md)
