# Vue2 源码中的基础工具函数

## emptyObject 空对象

```ts
export const emptyObject: Record<string, any> = Object.freeze({})
```

冻结对象，第一层无法修改。可以用来作为对象参数的缺省值，比如：

```ts
function foo(obj = emptyObject) {
  if (obj !== emptyObject) {
    // 说明传入了参数
  }
}
```

`Object` 对象中也有判断是否冻结的方法：

```ts
Object.isFrozen(emptyObject) // true
```

## `isArray` 是否是数组

```ts
export const isArray = Array.isArray
```

就是把 `Array.isArray` 暴露出来，方便使用。

## `isUndef` 是否是未定义

```ts
export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null
}
```

## `isDef` 是否是已经定义

```ts
export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null
}
```

## `isTrue` 是否是 true

```ts
export function isTrue(v: any): boolean {
  return v === true
}
```

## `isFalse` 是否是 false

```ts
export function isFalse(v: any): boolean {
  return v === false
}
```

## `isPrimitive` 是否是原始值

判断是否是字符串、数字、布尔值或者 Symbol。

```ts
/**
 * Check if value is primitive.
 */
export function isPrimitive(value: any): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

## `isFunction` 是否是函数

```ts
export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function'
}
```

## `isObject` 是否是对象

排除了 `typeof null` 返回 `'object'` 的情况。

```ts
/**
 * Quick object check - this is primarily used to tell
 * objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object'
}

// 例子:
isObject({}) // true
isObject([]) // true 有时不需要严格区分数组和对象
isObject(function () {}) // false
isObject(null) // false
```

## `_toString` 获取原始类型字符串

```ts
/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString
```

[`Object.prototype.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法返回一个表示该对象的字符串。

## `toRawType` 转换成原始类型

```ts
export function toRawType(value: any): string {
  return _toString.call(value).slice(8, -1)
}

// 例子：
toRawType({}) // 'Object'
toRawType([]) // 'Array'
toRawType(function () {}) // 'Function'
toRawType(null) // 'Null'
toRawType(undefined) // 'Undefined'
toRawType(new Date()) // 'Date'
```

## `isPlainObject` 是否是纯对象

```ts
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}

// 例子：
isPlainObject({}) // true
isPlainObject([]) // false
isPlainObject(new Date()) // false
```

## `isRegExp` 是否是正则表达式

```ts
export function isRegExp(v: any): v is RegExp {
  return _toString.call(v) === '[object RegExp]'
}

// 例子：
isRegExp(/abc/) // true
```

## `isValidArrayIndex` 是否是有效的数组索引

```ts
/**
 * Check if val is a valid array index.
 */
export function isValidArrayIndex(val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
```

该全局 [`isFinite()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isFinite) 函数用来判断被传入的参数值是否为一个有限数值（finite number）。在必要情况下，参数会首先转为一个数值

## `isPromise` 是否是 Promise 对象

```ts
export function isPromise(val: any): val is Promise<any> {
  return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function'
}

// 例子：
isPromise(new Promise(() => {})) // true
isPromise(Promise.resolve()) // true
isPromise(Promise.reject()) // true
isPromise(Promise.all([])) // true
```

这里用 `isObject` 代替 `isDef` 其实会更严谨，毕竟在 Vue3 里他们就这样做了。

## `toString` 转换成字符串

如果是数组，或者是没有修改过原型链上 `toString` 方法的纯对象，则会调用 `JSON.stringify()` 转换

```ts
/**
 * Convert a value to a string that is actually rendered.
 */
export function toString(val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}
```

个人觉得这里的 `val == null` 可以用已经定义过的工具函数 `isUndef` 代替。虽然用双等号十分的简洁有效，但是在一些代码风格检查比较严格的项目中可能会报错，如果遇到的话还是建议用严格等号或者是 `isUndef`。

## `toNumber` 转数字

转换成数字，如果转换失败则返回输入值。

```ts
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber(val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

toNumber('a') // 'a'
toNumber('1') // 1
toNumber('1a') // 1
toNumber('a1') // 'a1'
```

## `makeMap` 生成一个 map (对象)

传入一个以逗号分隔的字符串，生成一个 `map` 键值对对象，并返回一个函数检测 `key` 值在不在这个 `map` 中。第二个参数是小写选项。

```ts
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export function makeMap(
  str: string,
  expectsLowerCase?: boolean,
): (key: string) => true | undefined {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val]
}
```

只看实现不理解有什么作用，还是要结合后两个函数的实际应用来看。

## `isBuiltInTag` 是否是内置的 tag

```ts
/**
 * Check if a tag is a built-in tag.
 */
export const isBuiltInTag = makeMap('slot,component', true)

console.log(isBuiltInTag('slot')) // true
console.log(isBuiltInTag('component')) // true
console.log(isBuiltInTag('Slot')) // true
console.log(isBuiltInTag('Component')) // true
```

## `isReservedAttribute` 是否是保留的属性

```ts
/**
 * Check if an attribute is a reserved attribute.
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

console.log(isReservedAttribute('key')) // true
console.log(isReservedAttribute('ref')) // true
console.log(isReservedAttribute('slot')) // true
console.log(isReservedAttribute('slot-scope')) // true
console.log(isReservedAttribute('is')) // true
console.log(isReservedAttribute('IS')) // undefined
```

## `remove` 移除数组中的一项

```ts
/**
 * Remove an item from an array.
 */
export function remove(arr: Array<any>, item: any): Array<any> | void {
  const len = arr.length
  if (len) {
    // fast path for the only / last item
    if (item === arr[len - 1]) {
      arr.length = len - 1
      return
    }
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

`splice` 其实是一个很耗性能的方法。删除数组中的一项，其他元素都要移动位置。

**引申**：[`axios InterceptorManager` 拦截器源码](https://github.com/axios/axios/blob/master/lib/core/InterceptorManager.js) 中，拦截器用数组存储的。但实际移除拦截器时，只是把拦截器置为 `null` 。而不是用`splice`移除。最后执行时为 `null` 的不执行，同样效果。`axios` 拦截器这个场景下，不得不说为性能做到了很好的考虑。

看如下 `axios` 拦截器代码示例：

```javascript
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
/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
```

## `hasOwn` 检测是否是传入对象的属性

通过 `call` 调用 `hasOwnProperty` 方法，检测是否是自己的属性。

```ts
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}
```

## `cached` 缓存

利用闭包特性，缓存数据

```ts
/**
 * Create a cached version of a pure function.
 */
export function cached<R>(fn: (str: string) => R): (sr: string) => R {
  const cache: Record<string, R> = Object.create(null)
  return function cachedFn(str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}
```

## `camelize` 连字符转小驼峰

```ts
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

// 例子：
console.log(camelize('on-click')) // 'onClick'
```

## `capitalize` 首字母转大写

```ts
/**
 * Capitalize a string.
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

// 例子：
console.log(capitalize('click')) // 'Click'
```

## `hyphenate` 小驼峰转连字符

```ts
/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

// 例子：
console.log(hyphenate('onClick')) // 'on-click'
```

## `polyfillBind` bind 的 polyfill

```ts
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind(fn: Function, ctx: Object): Function {
  function boundFn(a: any) {
    const l = arguments.length
    return l ? (l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a)) : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

function nativeBind(fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

// @ts-expect-error bind cannot be `undefined`
export const bind = Function.prototype.bind ? nativeBind : polyfillBind

// 用例
var a = 1
function logA() {
  console.log(this.a)
}
var obj = { a: 2 }
bind(logA, obj)()
// 2
```

注释里说明了，这个方法是为了兼容 `PhantomJS 1.x` 才保留的。`PhantomJS` 是一个基于 `webkit` 的无界面浏览器，用于测试。`PhantomJS 1.x` 是 `2011` 年发布的版本，当时 `bind` 方法还不是很流行。

`polyfillBind` 在实现上区分了 `call` 和 `apply`，据说是因为性能问题。`call` 用于在无参数或仅有单个参数时绑定 `this`，`apply` 用于绑定 this 和多个参数。

## `toArray` 将类数组转为数组

把类数组转换为数组，支持指定从哪个位置开始，默认从 0 开始。

```ts
/**
 * Convert an Array-like object to a real Array.
 */
export function toArray(list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

// 例子：
function fn() {
  var arr1 = toArray(arguments)
  console.log(arr1)
  var arr2 = toArray(arguments, 2)
  console.log(arr2)
}

fn(1, 2, 3, 4, 5)
// [1, 2, 3, 4, 5]
// [3, 4, 5]
```

## `extend` 对象合并

```ts
/**
 * Mix properties into target object.
 */
export function extend(
  to: Record<PropertyKey, any>,
  _from?: Record<PropertyKey, any>,
): Record<PropertyKey, any> {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

// 例子：
const data = { name: '哆啦A梦' }
const data2 = extend(data, { desc: '蓝色机器猫', name: '是哆啦A梦' })
console.log(data) // { name: '是哆啦A梦', desc: '蓝色机器猫' }
console.log(data2) // { name: '是哆啦A梦', desc: '蓝色机器猫' }
console.log(data === data2) // true
```

## `toObject` 转对象

将对象数组合并到一个对象中。

```ts
/**
 * Merge an Array of Objects into a single Object.
 */
export function toObject(arr: Array<any>): object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

var obj = { a: 1, b: 2 }
var obj2 = { a: 'hello', c: 3 }
const res = toObject([obj, obj2])
console.log(res)
// {a: 'hello', b: 2, c: 3}
```

## `noop` 空函数

常用来初始化赋值。

```ts
/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
export function noop(a?: any, b?: any, c?: any) {}
```

## `no` 永远返回 false

```ts
/**
 * Always return false.
 */
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */
```

## `identity` 返回参数本身

```ts
/**
 * Return the same value.
 */
export const identity = (_: any) => _
```

## `genStaticKeys` 生成静态属性

```ts
/**
 * Generate a string containing static keys from compiler modules.
 */
export function genStaticKeys(
  modules: Array<{ staticKeys?: string[] } /* ModuleOptions */>,
): string {
  return modules
    .reduce((keys, m) => {
      return keys.concat(m.staticKeys || [])
    }, [] as string[])
    .join(',')
}
```

## `looseEqual` 宽松相等

因为对象、数组等都是引用类型，所以两个内容看起来是相等的值，实际上并不是严格相等的。

```ts
var a = {}
var b = {}
a === b // false
a == b // false
```

所以该函数是对数组、日期、对象进行递归比对。如果内容完全相等则宽松相等。

```ts
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual(a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return (
          a.length === b.length &&
          a.every((e: any, i: any) => {
            return looseEqual(e, b[i])
          })
        )
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return (
          keysA.length === keysB.length &&
          keysA.every((key) => {
            return looseEqual(a[key], b[key])
          })
        )
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e: any) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}
```

## `looseIndexOf` 宽松的 indexOf

该函数实现的是宽松相等，原生的 `indexOf` 是严格相等的。

```ts
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
export function looseIndexOf(arr: Array<unknown>, val: unknown): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}
```

## `once` 确保函数只执行一次

利用闭包特性，存储状态

```ts
/**
 * Ensure a function is called only once.
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments as any)
    }
  } as any
}

const fn1 = once(function () {
  console.log('哎嘿，无论你怎么调用，我只执行一次')
})

fn1() // '哎嘿，无论你怎么调用，我只执行一次'
fn1() // 我不输出
fn1() // 我还不输出
fn1() // 我就不输出
```

## `hasChanged` 检查值是否发生变化

```ts
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#polyfill
export function hasChanged(x: unknown, y: unknown): boolean {
  if (x === y) {
    return x === 0 && 1 / x !== 1 / (y as number)
  } else {
    return x === x || y === y
  }
}

// 例子：
hasChanged(1, 1) // false
hasChanged(1, 2) // true

const obj = { a: 1 }
obj.b = 2
hasChanged(obj, obj) // false

const obj2 = obj
hasChanged(obj, obj2) // false

const obj3 = { a: 1 }
hasChanged(obj, obj3) // true
```
