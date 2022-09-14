# 【TS 类型体操】联合类型转换为元组

## 前言

本系列用来记录我在 [type-challenges](https://github.com/type-challenges/type-challenges) 项目中的挑战笔记。

题目链接：https://github.com/type-challenges/type-challenges/blob/main/questions/00730-hard-union-to-tuple/README.md

## 题目

实现一个类型，`UnionToTuple`，将联合转换为元组。

众所周知，联合是无序结构，但元组是有序的，这意味着我们不应该假设在创建或转换联合时，一个联合的项之间会保留任何顺序。

因此，在这个挑战中，**输出元组中元素的任何排列都是可以接受的。**

您的类型应该解析为以下两种类型之一，但**不是**它们的联合！

```ts
UnionToTuple<1>     // [1], and correct
UnionToTuple<'any' | 'a'> // ['any','a'], and correct
```

或者

```ts
UnionToTuple<'any' | 'a'> // ['a','any'], and correct
```

它不应该是所有可接受的元组的联合......

```ts
UnionToTuple<'any' | 'a'> // ['a','any'] | ['any','a'], which is incorrect
```

并且联合可能会崩溃，这意味着某些类型可以吸收（或被吸收）其他类型，并且没有办法阻止这种吸收。请参阅以下示例：

```ts
Equal<UnionToTuple<any | 'a'>,       UnionToTuple<any>>         // will always be a true
Equal<UnionToTuple<unknown | 'a'>,   UnionToTuple<unknown>>     // will always be a true
Equal<UnionToTuple<never | 'a'>,     UnionToTuple<'a'>>         // will always be a true
Equal<UnionToTuple<'a' | 'a' | 'a'>, UnionToTuple<'a'>>         // will always be a true
```

## 题解

```ts
/**
 * UnionToIntersection<{ foo: string } | { bar: string }> =
 *  { foo: string } & { bar: string }.
 */
type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

/**
 * LastInUnion<1 | 2> = 2.
 */
type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

/**
 * UnionToTuple<1 | 2> = [1, 2].
 */
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];
```

关键字解析：

- `type`: `type` 的作用就是给任意的类型起一个别名，通常用来给联合类型进行重命名，给对象类型进行命名时作用与 `interface` 类似，区别是 `type` 不能用同名类型进行扩展。

- `T extends U ? X : Y`: 这是条件类型 [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，用法和 JS 中的三元运算符类似，这里的意思是：如果 `T` 是 `U` 的子类型的话，那么就会返回 `X`，否者返回 `Y`。

- `infer`: 条件类型为我们提供了一种使用 `infer` 关键字从我们在真实分支中比较的类型进行推断的方法。参考：https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types

## 详细步骤：

**第一步：实现 UnionToIntersection 类型**

`ts` 没有提供从联合类型取值的操作

```ts
type Union = 1 | 2;
type A = Union[1]; // error
```

也不能直接将联合类型转为元组

```ts
type Union = 1 | 2;
type UnionToTuple<T> = T extends infer F | infer R ? [F, R]: never;
type A = UnionToTuple<Union>; // [1, 1] | [2, 2];
```

就需要想其他的方法，获取联合类型某个位置的值。

将联合类型转换成函数的交叉类型，通过 `infer` 推断类型。

在获取函数的返回值上，函数重载和函数交叉类型是一样的。

```ts
// 函数重载
type FunctionOverload = {
    (): number;
    (): string;
};
type A = ReturnType<FunctionOverload>; // string

// 函数交叉类型
type Intersection = (() => number) & (() => string);
type B = ReturnType<Intersection>; // string

// 函数重载和函数交叉类型相等
type C = FunctionOverload extend Intersection ? true : false; // true
```

实现函数交叉类型 `UnionToIntersection`，作用：将联合类型转换成对应的函数交叉类型

你可能会想，这里两个条件判断 `extends` 肯定都为 `true`

- `U extends any ⇒ true`
- `() extends (k: infer I) => void ⇒ true`

那能不能省略一个或者两个条件判断呢？

不能，这里需要用到泛型的分配率

```ts
type Union = 1 | true;
type A = UnionToInfer<Union>;
// 结果=>
type A = (() => 1) & (() => true);
```

TIP:

```ts
type A5 = ((k: 1) => void) | ((k: 2) => void) extends (
  k: infer I
) => void ? I : never;  // never

type A6 = ((k: () => 1) => void) | ((k: () => 2) => void) extends (
  k: infer I
) => void ? I : never;  // (() => 1) & (() => 2)
```

`k` 的参数是函数，返回的类型才是交叉类型，其他的都为 `never`

**第二步：实现 `LastInUnion` 类型**

`LastInUnion` 作用是：获取联合类型的最后一个类型

**第三步：实现 `UnionToTuple` 类型**

接收三个参数 `U`、 `Last`

`U` 是任意类型的联合类型
`Last` 是 `U` 中最后一位的值，默认 `LastInUnion<U>`
通过判断联合类型中有没有 `never` 类型，没有 `never` 递归调用 `UnionToTuple。`

## 相关挑战

[【TS 类型体操】元组转换为联合类型](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B.md)

[【TS 类型体操】元组转换为对象](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%AF%B9%E8%B1%A1.md)

Union to Intersection

[【TS 类型体操】元组转换为枚举对象](./%E3%80%90TS%20%E7%B1%BB%E5%9E%8B%E4%BD%93%E6%93%8D%E3%80%91%E5%85%83%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E6%9E%9A%E4%B8%BE%E5%AF%B9%E8%B1%A1.md)

Tuple to Nested Object
