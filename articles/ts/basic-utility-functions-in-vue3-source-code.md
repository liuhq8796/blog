# Vue3 源码中的基础工具函数

## 前言

在 Vue3 的源码中，工具函数被分成了很多大类，比如 `general`、`looseEqual`、`makeMap` 等等。这里我只选择了提到的这三种比较通用的工具函数来讲解。

## `EMPTY_OBJ` 空对象

```ts
export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__ ? Object.freeze({}) : {}
```

- `readonly`: 对于 TypeScript，属性也可以标记为只读。虽然它不会在运行时改变任何行为，但在类型检查期间不能写入标记为只读的属性。

`__DEV__`: 通过 [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace) 插件全局替换成设定的值，为了方便理解可以看作是 `process.env.NODE_ENV !== 'production'`。

`process.env.NODE_ENV`: `node` 项目中的一个环境变量，一般定义为：`development` 或 `production`。根据环境写代码。比如开发环境，有报错等信息，生产环境则不需要这些报错警告。

[`Object.freeze()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze): 冻结一个对象（浅冻结）。可以用来作为对象参数的缺省值，比如：

```ts
function doSomeThing(obj) {
  const props = obj.props || EMPTY_OBJ
  // ...

  if (props !== EMPTY_OBJ) {
    // 说明传入了 props 对象
  }
}
```

## `EMPTY_ARR` 空数组

```ts
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : []
```

TS 自动为我们推论出了 `EMPTY_ARR` 的类型: `readonly never[]`，因此我们不需要显式的去写类型定义。当然你也可以自己写上，还可以用 `ReadonlyArray<never>` 来写类型，两者表示同一个类型，看个人习惯。

使用举例：

```ts
function doSomeThing(arr = EMPTY_ARR) {
  if (arr !== EMPTY_ARR) {
    // 说明传入了 arr 数组
  }
}
```

## `NOOP` 空函数

```ts
export const NOOP = () => {}
```

方便判断：

```ts
// 摘抄了 vue3 源码的小片段
const get = isFunction(opt)
  ? opt.bind(publicThis, publicThis)
  : isFunction(opt.get)
  ? opt.get.bind(publicThis, publicThis)
  : NOOP
if (get === NOOP) {
  warn$1(`Computed property "${key}" has no getter.`)
}
```

方便压缩：如果没有 NOOP 方法，那么在很多地方我们可能都要再定义一个匿名的空函数，这样的匿名函数就会导致无法被压缩，降低了代码的压缩率。

避免代码出错：比如当组件没有提供 render 方法时：

```ts
const render = Component.render || NOOP
render()
```

相关文章：

[vue3 源码：为什么这么写 const NOOP = () => { }; ？？？？](https://segmentfault.com/q/1010000041066441)

[JS 箭头函数之：为何用？怎么用？何时用？](https://segmentfault.com/a/1190000020134330)

## `NO` 永远返回 false 的函数

```ts
/**
 * Always return false.
 */
export const NO = () => false
```

使用举例：

```ts
export function validateComponentName(name: string, config: AppConfig) {
  const appIsNativeTag = config.isNativeTag || NO
  if (isBuiltInTag(name) || appIsNativeTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component id: ' + name)
  }
}
```

## `isOn` 判断字符串是不是 `on` 开头

```ts
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
```

`/^on[^a-z]/`: [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)。当`^`符号在正则的开头时，表示是以什么开头；而在 `[]` 内的开头时，则表示一个反向字符集。`[^a-z]`: 表示匹配除了小写字母 a 到 z 的其他字符。整体的意思是匹配以 `on` 开头且之后跟一个非小写字母的字符串。

[`test()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) 方法执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 `true` 或 `false`。

同时推荐一个正则在线工具：[regex101](https://regex101.com/)

另外正则看老姚的迷你书就够用了：[《JavaScript 正则表达式迷你书》问世了！](https://juejin.cn/post/6844903501034684430)

使用举例：

```ts
function doSomeThing(value) {
  const isEventHandler = isOn(value.name)
  // ...
}
```

## `isModelListener` 判断字符串是不是以 `onUpdate:` 开头

```ts
export const isModelListener = (key: string) => key.startsWith('onUpdate:')
```

[`startsWith()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith) 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true` 或 `false`。

相关文章：[ES6 入门教程：字符串的新增方法](https://es6.ruanyifeng.com/#docs/string-methods)

## `extend` 继承/合并

```ts
export const extend = Object.assign
```

[`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。

使用举例：

```ts
const finalOptions = extend({}, defaultOptions, {
  someProp: someValue,
  // ...
})
```

## `remove` 移除数组的一项

```ts
export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}
```

[`indexOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

[`splice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。

`splice` 其实是一个很耗性能的方法。删除数组中的一项，其他元素都要移动位置。

**引申**：[`axios InterceptorManager` 拦截器源码](https://github.com/axios/axios/blob/master/lib/core/InterceptorManager.js) 中，拦截器用数组存储的。但实际移除拦截器时，只是把拦截器置为 `null` 。而不是用`splice`移除。最后执行时为 `null` 的不执行，同样效果。`axios` 拦截器这个场景下，不得不说为性能做到了很好的考虑。

看如下 `axios` 拦截器代码示例：

```ts
// 代码有删减
// 声明
this.handlers = []

// 移除
if (this.handlers[id]) {
  this.handlers[id] = null
}

// 执行
if (h !== null) {
  fn(h)
}
```

## `hasOwnProperty` 检测是否是自己的属性

```ts
const hasOwnProperty = Object.prototype.hasOwnProperty
```

[`hasOwnProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是是否有指定的键）。

## `hasOwn` 是不是自己本身所拥有的属性

```ts
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key)
```

`is`、`typeof` 是 TS 中的类型保护，`keyof` 是 TS 中的索引类型，可以参考：[高级类型](https://www.tslang.cn/docs/handbook/advanced-types.html)

[`call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

相关文章：[JavaScript 对象所有 API 解析【2020 版】](https://mp.weixin.qq.com/s/Y3nL3GPcxiqb3zK6pEuycg)

使用举例：

```ts
hasOwn({ __proto__: { a: 1 } }, 'a') // false
hasOwn({ a: undefined }, 'a') // true
hasOwn({}, 'a') // false
hasOwn({}, 'hasOwnProperty') // false
hasOwn({}, 'toString') // false
```

[`Object.prototype` (zh-CN)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 的 `__proto__` 属性是一个访问器属性（一个 getter 函数和一个 setter 函数）, 暴露了通过它访问的对象的内部`[[Prototype]]` (一个对象或 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null))。

它已被不推荐使用, 现在更推荐使用[`Object.getPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)/[`Reflect.getPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf) 和[`Object.setPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)/[`Reflect.setPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/setPrototypeOf)（尽管如此，设置对象的[[Prototype]]是一个缓慢的操作，如果性能是一个问题，应该避免）。

## `isArray` 判断数组

```ts
export const isArray = Array.isArray
```

[`Array.isArray()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) 用于确定传递的值是否是一个 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)。

## `isMap` 判断是不是 Map 对象

```ts
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
```

参考：[Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

## `isSet` 判断是不是 Set 对象

```ts
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
```

参考：[Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

## `isDate` 判断是不是 Date 对象

```ts
export const isDate = (val: unknown): val is Date => val instanceof Date
```

[`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

## `isRegExp` 判断是不是 RegExp 对象

```ts
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === '[object RegExp]'
```

参考：[RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

## `isFunction` 判断是不是函数

```ts
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
```

[`typeof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) 操作符返回一个字符串，表示未经计算的操作数的类型。

`unknown` 类似于 `any`，具体可参考：[TypeScript `unknown` 类型 ](https://www.cnblogs.com/Wayou/p/typescript_unknown_type.html)

## `isString` 判断是不是字符串

```ts
export const isString = (val: unknown): val is string => typeof val === 'string'
```

## `isSymbol` 判断是不是 Symbol

```ts
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
```

## `isObject` 判断是不是对象

```ts
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'
```

注意：`typeof null` 会返回 `object`。

> 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，`typeof null` 也因此返回 `"object"`。——[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)

## `isPromise` 判断是不是 Promise

```ts
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
```

相关文章：[JavaScript Promise 迷你书（中文版）](http://liubin.org/promises-book/)

## `objectToString` 对象转字符串

```ts
export const objectToString = Object.prototype.toString
```

[`toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法返回一个表示该对象的字符串。

## `toTypeString` 对象转字符串

```ts
export const toTypeString = (value: unknown): string => objectToString.call(value)
```

相关文章：[从深入到通俗：Object.prototype.toString.call()](https://zhuanlan.zhihu.com/p/118793721)

## `toRawType` 对象转字符串 截取后几位

```ts
export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
```

截取 `Object.prototype.toString.call()` 方法返回的字符串中表示参数类型的字符串。

## `isPlainObject` 判断是不是纯粹的对象

```ts
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'
```

## `isIntegerKey` 判断是不是数字型的字符串 key 值

```ts
export const isIntegerKey = (key: unknown) =>
  isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key
```

## `makeMap` 生成一个 map (对象)

```ts
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
export function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val]
}
```

传入一个以逗号分隔的字符串，生成一个 `map`(键值对)，并且返回一个函数检测 `key` 值在不在这个 `map` 中。第二个参数是小写选项。

## `isReservedProp` 判断是不是保留的属性

```ts
export const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,ref_for,ref_key,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted',
)
```

## `isBuiltInDirective` 判断是不是内置的指令

```ts
export const isBuiltInDirective = /*#__PURE__*/ makeMap(
  'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo',
)
```

## `cacheStringFunction` 缓存函数字符串结果

```ts
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}
```

在 vue2 的工具函数中，与之类似的是 cached 函数，差别在于被 cached 函数所接收的函数的返回值类型并不固定。

## `camelize` 转换成驼峰格式

```ts
const camelizeRE = /-(\w)/g

export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})
```

[`replace()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 方法返回一个由替换值（`replacement`）替换部分或所有的模式（`pattern`）匹配项后的新字符串。模式可以是一个字符串或者一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。**如果`pattern`是字符串，则仅替换第一个匹配项。**原字符串不会改变。

## `hyphenate` 驼峰命名转换成连字符命名

```ts
const hyphenateRE = /\B([A-Z])/g

export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase(),
)
```

`\B`：匹配非单词边界，即在两个字母字符或两个非字母字符之间。

## `capitalize` 首字母转大写

```ts
export const capitalize = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
)
```

[`charAt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charAt) 方法从一个字符串中返回指定的字符。

[`slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**（包括 `begin`，不包括`end`）。原始数组不会被改变。

## `toHandlerKey` 输入的字符串首字母转大写，并字符串前面加 on

```ts
export const toHandlerKey = cacheStringFunction((str: string) =>
  str ? `on${capitalize(str)}` : ``,
)
```

## `hasChanged` 判断是不是有变化

```ts
export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue)
```

[`Object.is()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 方法判断两个值是否为[同一个值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)。

**Polyfill**:

```ts
if (!Object.is) {
  Object.is = function (x, y) {
    // SameValue algorithm
    if (x === y) {
      // +0 != -0
      return x !== 0 || 1 / x === 1 / y
    } else {
      // NaN == NaN
      return x !== x && y !== y
    }
  }
}
```

## `invokeArrayFns` 执行数组里的函数

```ts
export const invokeArrayFns = (fns: Function[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}
```

为什么这样写，我们一般都是一个函数执行就行。

数组中存放函数，函数其实也算是数据。这种写法方便统一执行多个函数。

## `def` 定义对象属性

```ts
export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value,
  })
}
```

[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

## `looseToNumber` 宽松转数字

```ts
/**
 * "123-foo" will be parsed to 123
 * This is used for the .number modifier in v-model
 */
export const looseToNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

其实 `isNaN` 本意是判断是不是 `NaN` 值，但不是准确的。

比如：`isNaN('a')` 为 `true`。 所以 `ES6` 有了 `Number.isNaN` 这个判断方法，为了弥补这一个`API`。

```ts
Number.isNaN('a') // false
Number.isNaN(NaN) // true
```

## `toNumber` 严格转数字

```ts
/**
 * Only conerces number-like strings
 * "123-foo" will be returned as-is
 */
export const toNumber = (val: any): any => {
  const n = isString(val) ? Number(val) : NaN
  return isNaN(n) ? val : n
}
```

## `getGlobalThis` 全局对象

```ts
let _globalThis: any
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
```

获取全局 `this` 指向。

初次执行肯定是 `_globalThis` 是 `undefined`。所以会执行后面的赋值语句。

如果存在 `globalThis` 就用 `globalThis`。[MDN globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

如果存在`self`，就用`self`。在 `Web Worker` 中不能访问到 `window` 对象，但是我们却能通过 `self` 访问到 `Worker` 环境中的全局对象。

如果存在`window`，就用`window`。

如果存在`global`，就用`global`。`Node`环境下，使用`global`。

如果都不存在，使用空对象。可能是微信小程序环境下。

下次执行就直接返回 `_globalThis`，不需要第二次继续判断了。这种写法值得我们学习。

## `genPropsAccessExp` 生成属性访问表达式

```ts
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/

export function genPropsAccessExp(name: string) {
  return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`
}
```

`identRE` 是一个正则表达式，用来判断是不是一个合法的标识符。

`/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/`

`^` 匹配输入的开始。

`[_$a-zA-Z\xA0-\uFFFF]` 匹配一个字符，下划线、美元符号、字母、Unicode 字符。

`[_$a-zA-Z0-9\xA0-\uFFFF]*` 匹配 0 个或多个字符，下划线、美元符号、字母、数字、Unicode 字符。

`$` 匹配输入的结束。

## `looseCompareArrays` 宽松比较数组

```ts
function looseCompareArrays(a: any[], b: any[]) {
  if (a.length !== b.length) return false
  let equal = true
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i])
  }
  return equal
}
```

## `looseEqual` 宽松比较

```ts
export function looseEqual(a: any, b: any): boolean {
  if (a === b) return true
  let aValidType = isDate(a)
  let bValidType = isDate(b)
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false
  }
  aValidType = isSymbol(a)
  bValidType = isSymbol(b)
  if (aValidType || bValidType) {
    return a === b
  }
  aValidType = isArray(a)
  bValidType = isArray(b)
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false
  }
  aValidType = isObject(a)
  bValidType = isObject(b)
  if (aValidType || bValidType) {
    /* istanbul ignore if: this if will probably never be called */
    if (!aValidType || !bValidType) {
      return false
    }
    const aKeysCount = Object.keys(a).length
    const bKeysCount = Object.keys(b).length
    if (aKeysCount !== bKeysCount) {
      return false
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key)
      const bHasKey = b.hasOwnProperty(key)
      if ((aHasKey && !bHasKey) || (!aHasKey && bHasKey) || !looseEqual(a[key], b[key])) {
        return false
      }
    }
  }
  return String(a) === String(b)
}
```

## `looseIndexOf` 宽松索引

```ts
export function looseIndexOf(arr: any[], val: any): number {
  return arr.findIndex((item) => looseEqual(item, val))
}
```
