# 【TS 类型体操】元组转换为对象

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.md

## 题目

给出一个数组，转换成一个对象类型，并且键/值必须在给定的数组中。

例如：

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

关键词解析：

- `as`: 类型断言。有时 TypeScript 无法知道值的准确类型，例如，如果你使用 `document.getElementById`，TypeScript 只知道这将返回某种 `HTMLElement`，但您可能知道您的页面将始终具有给定 ID 的 `HTMLCanvasElement`。

  在这种情况下，您可以使用类型断言来指定更具体的类型：

  ```ts
  const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
  ```

- `as const`: TypeScript 3.4 为字面值引入了一种新的构造，称为 const 断言。它的语法是用 const 代替类型名称的类型断言（例如 `123 as const`）。当我们用 const 断言构造新的字面表达式时，我们可以向语言发出信号：

  - 不应扩大该表达式中的字面类型（例如，不要从`“hello”`变为`string`）

  - 对象字面量获得 `readonly` 属性

  - 数组字面量变成 `readonly` 元组

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。


- `typeof`: JavaScript 已经有一个可以在表达式上下文中使用的 typeof 运算符：

  ```js
  console.log(typeof "Hello world"); // string
  ```

  TypeScript 添加了一个 typeof 运算符，您可以在类型上下文中使用它来引用变量或属性的类型：

  ```ts
  let s = "hello";
  let n: typeof s; // let n: string
  ```

## 题解

```ts
type TupleToObject<T extends readonly PropertyKey[]> = {
  [P in T[number]]: P
}
```

关键字解析：

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `readonly`: 对于 TypeScript，属性也可以标记为只读。虽然它不会在运行时改变任何行为，但在类型检查期间不能写入标记为只读的属性。

- `PropertyKey`: TypeScript 内置类型，相当于 `type PropertyKey = string | number | symbol;`。

- `T[number]`: 索引访问类型 [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)，可以获取数组 `T` 类型中所有子元素的类型组成联合类型。

- `in`: `P in T[number]` 执行了一个循环（可以理解为类似 `for...in` 的效果），这里的 `T[number]` 是一个联合类型，而 `P` 是一个标识符，它映射为 `T[number]` 的每一个子类型。

## 相关挑战

[【TS 类型体操】元组转换为联合类型](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B.md)

Tuple to Enum Object

Union to Tuple

Tuple to Nested Object