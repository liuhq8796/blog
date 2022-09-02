# 【TS 类型体操】元组转换为枚举对象

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00472-hard-tuple-to-enum-object/README.md

## 题目

枚举是 TypeScript 的原始语法（它在 JavaScript 中不存在）。因此，由于转译，它被转换为如下形式：

```js
let OperatingSystem;
(function (OperatingSystem) {
    OperatingSystem[OperatingSystem["MacOS"] = 0] = "MacOS";
    OperatingSystem[OperatingSystem["Windows"] = 1] = "Windows";
    OperatingSystem[OperatingSystem["Linux"] = 2] = "Linux";
})(OperatingSystem || (OperatingSystem = {}));
```

在这个问题中，类型应该将给定的字符串元组转换为行为类似于枚举的对象。此外，枚举的属性最好是 pascal 格式的。

```ts
Enum<["macOS", "Windows", "Linux"]>
// -> { readonly MacOS: "macOS", readonly Windows: "Windows", readonly Linux: "Linux" }
```

如果在第二个参数中给出 true，则该值应该是数字。

```ts
Enum<["macOS", "Windows", "Linux"], true>
// -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }
```

## 题解

先解决一半的问题，在不考虑第二个参数的情况下有解：

```ts
type Enum<T extends readonly string[], N extends boolean = false> = {
  readonly [K in Capitalize<T[number]>]: K extends T[number] ? K : Uncapitalize<K>
}

// or

type Enum<T extends readonly string[], N extends boolean = false> = {
  readonly [K in T[number] as Capitalize<K>]: K
}
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `extends`: 在泛型中使用 `extends` 并不是用来继承的，而是用来约束类型的。

- `readonly`: 对于 TypeScript，属性也可以标记为只读。虽然它不会在运行时改变任何行为，但在类型检查期间不能写入标记为只读的属性。

- `in`: `P in K` 执行了一个循环（可以理解为类似 `for...in` 的效果），`K` 是一个联合类型，而 `P` 是一个标识符，它映射为 `K` 的每一个子类型。

- `Capitalize<StringType>`: 将字符串中的第一个字符转换为等效的大写字母。

- `Uncapitalize`: 将字符串中的第一个字符转换为等效的小写字母。

- `T[number]`: 索引访问类型 [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)，可以获取数组 `T` 类型中所有子元素的类型组成联合类型。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `as`: 类型断言 [Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)。有时 TypeScript 无法知道值的准确类型，例如，如果你使用 `document.getElementById`，TypeScript 只知道这将返回某种 `HTMLElement`，但您可能知道您的页面将始终具有给定 ID 的 `HTMLCanvasElement`。

  这里 `[K in T[number] as Capitalize<K>]` 的用法感觉是让 TS 将对象的属性名认作由 `Capitalize` 处理后的的 pascal 格式。

然后继续考虑如何实现第二参数：

```ts
type TupleIndex<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest] ? TupleIndex<Rest> | Rest["length"] : never

type Enum<T extends readonly string[], N extends boolean = false> = {
  readonly [P in TupleIndex<T> as Capitalize<T[P]>]: N extends true ? P : T[P]
}

// or

type FindIndex<T extends readonly unknown[], K extends T[number], Index extends unknown[] = []> = T extends readonly [infer First, ...infer Rest] ? First extends K ? Index["length"] : FindIndex<Rest, K, [...Index, unknown]> : never

type Enum<T extends readonly string[], N extends boolean = false> = {
  readonly [P in Capitalize<T[number]>]: N extends true ? FindIndex<T, P extends T[number] ? P : Uncapitalize<P>> : P extends T[number] ? P : Uncapitalize<P>
}
```

第一种方案是提取元组索引进行遍历，第二种方案是遍历元组本身寻找子元素索引。

关键字解析：

- `infer`: 条件类型为我们提供了一种使用 `infer` 关键字从我们在真实分支中比较的类型进行推断的方法。在这里，我们使用 `infer` 关键字声明性地引入了名为 `first` 和 `rest` 的新泛型类型变量，而不是指定如何在 `true` 分支中检索 `T` 的元素类型。

- `...`: 剩余参数 [Rest Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters) 标识。除了使用可选参数或重载来制作可以接受各种固定参数计数的函数之外，我们还可以使用剩余参数定义接受无限数量参数的函数。rest 参数出现在所有其他参数之后，并使用 ... 语法。

## 相关挑战

[【TS 类型体操】元组转换为对象](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%AF%B9%E8%B1%A1.md)

[【TS 类型体操】元组转换为联合类型](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B.md)

Union to Tuple

Tuple to Nested Object
