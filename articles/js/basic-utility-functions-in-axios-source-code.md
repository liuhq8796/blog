# Axios 源码中的基础工具函数

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 19 期，链接：[https://juejin.cn/post/7083113675879350309](https://juejin.cn/post/7083113675879350309)。

## `toString` 转字符串

```js
const { toString } = Object.prototype
```

`Object.prototype.toString`方法返回一个表示该对象的字符串。
​

它的返回是这样的：

```js
let d = new Date()
let a = []
let r = /\d+/
console.log(toString.call(d)) // [object Date]
console.log(toString.call(a)) // [object Array]
console.log(toString.call(r)) // [object RegExp]
```

## `getPrototypeOf` 获取原型

```js
const { getPrototypeOf } = Object
```

`Object.getPrototypeOf()`方法返回指定对象的原型（内部`[[Prototype]]`属性的值）。

```js
const prototype1 = {}
const object1 = Object.create(prototype1)

console.log(getPrototypeOf(object1) === prototype1) // true
```

## `kindOf` 获取类型

```js
const kindOf = ((cache) => (thing) => {
  const str = toString.call(thing)
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase())
})(Object.create(null))
```

这个函数的作用是判断传入的参数的类型，返回一个字符串，比如：

```js
kindOf({}) // object
kindOf([]) // array
kindOf(1) // number
kindOf('') // string
kindOf(/a/) // regexp
kindOf(new Date()) // date
kindOf(null) // null
kindOf(undefined) // undefined
kindOf(function () {}) // function
kindOf(true) // boolean
```

## `kindOfTest` 判断类型

```js
const kindOfTest = (type) => {
  type = type.toLowerCase()
  return (thing) => kindOf(thing) === type
}
```

这个函数的作用是判断传入的参数的类型是否与传入的参数相同，返回一个布尔值，比如：

```js
const isObject = kindOfTest('object')
isObject({}) // true
isObject([]) // false
```

## `typeOfTest` 判断类型

```js
const typeOfTest = (type) => (thing) => typeof thing === type
```

这个函数的作用是判断传入的参数的类型是否与传入的参数相同，返回一个布尔值，比如：

```js
const isNumber = typeOfTest('number')
isNumber(1) // true
isNumber('1') // false
```

## `isArray` 判断数组

```js
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const { isArray } = Array
```

## `isUndefined` 判断 `undefined`

```js
/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined')
```

返回一个用来判断传入参数是否是 `undefined` 的函数。

## `isBuffer` 判断 `buffer`

```js
/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    isFunction(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  )
}
```

先判断不是 `null` 和 `undefined`，再判断 `val` 存在构造函数，因为 `Buffer` 本身是一个类，最后通过自身的 `isBuffer` 方法判断。
​

因为 axios 不仅可以运行在浏览器中，还可以运行在 node 环境中，所以处理二进制数据是不可避免的。比如在处理像 TCP 流或文件流时，必须使用到二进制数据。
​

而 JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。因此在 Node.js 中，定义了一个`Buffer`类，该类用来创建一个**专门存放二进制数据的缓存区**。详细内容可以参考[官方文档](http://nodejs.cn/api/buffer.html#buffer)或者[更通俗易懂的解释](https://www.runoob.com/nodejs/nodejs-buffer.html)。

## `isArrayBuffer` 判断 `ArrayBuffer`

```js
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer')
```

关于 Blob、ArrayBuffer、Buffer 的区别，可以参考[这篇文章](https://zhuanlan.zhihu.com/p/97768916)。

## `isArrayBufferView` 判断值是否是 `ArrayBuffer` 的视图

```js
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val)
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer)
  }
  return result
}
```

## `isString` 判断字符串

```js
/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string')
```

## `isFunction` 判断函数

```js
/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function')
```

## `isNumber` 判断数字

```js
/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number')
```

## `isObject` 判断对象

```js
/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object'
```

## `isBoolean` 判断布尔值

```js
/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = (thing) => thing === true || thing === false
```

## `isPlainObject` 判断纯对象

纯对象：使用对象字面量`{}`或`new Object()`创建的对象。

```js
/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false
  }

  const prototype = getPrototypeOf(val)
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in val) &&
    !(Symbol.iterator in val)
  )
}
```

首先使用 `kindOf` 方法排除了返回值不为 `'object'` 的目标对象，其次判断目标对象的原型是不是 `null` 或 `Object.prototype`。
​

Vue3 源码中则是仅判断了第一项，及判断调用`toString`方法后返回的值是否是`'[object Object]'`：

```typescript
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'
```

看起来是 axios 的实现更严谨，排除了普通对象原型链被污染的特殊情况。

```js
const obj = Object.create(null)

// axios
isPlainObject(obj) // true
// vue
isPlainObject(obj) // true

// 为 obj 设置另一个原型对象
const prototype = { foo: 'bar' }
Object.setPrototypeOf(obj, prototype)

// 此时，通过原型链的作用，obj 已经获得了一些原型属性和方法
obj.foo // 'bar'
obj.constructor === Object // true
obj.toString() // '[object Object]'

// axios
isPlainObject(obj) // false
// vue
isPlainObject(obj) // true
```

## `isDate` 判断 `Date`

```js
/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date')
```

## `isFile` 判断 `File`

```js
/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File')
```

## `isBlob` 判断 `Blob`

```js
/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob')
```

[Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 来用于数据操作。

## `isFileList` 判断 `FileList`

```js
/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList')
```

## `isStream` 判断是否是流

```js
/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe)
```

## `isFormData` 判断 `FormData`

```js
/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind
  return (
    thing &&
    ((typeof FormData === 'function' && thing instanceof FormData) ||
      (isFunction(thing.append) &&
        ((kind = kindOf(thing)) === 'formdata' ||
          // detect form-data instance
          (kind === 'object' &&
            isFunction(thing.toString) &&
            thing.toString() === '[object FormData]'))))
  )
}
```

`instanceof` 操作符可以判断变量是否是给定类的实例。
​

比如下面这段代码：

```js
let d = new Date()
let a = []
let n = null
let r = /\d+/
alert(d instanceof Date) // true
alert(a instanceof Array) // true
alert(n instanceof Object) // false
alert(r instanceof RegExp) // true
```

需要注意的是，虽然 typeof null 的结果是 object ，但 null 并不是 Object 的实例，所以 null instanceof Object 的结果是 false 。

## `isURLSearchParams` 判断 `URLSearchParams`

```js
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams')
```

[URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) 接口定义了一些实用的方法来处理 URL 的查询字符串。例如：

```js
var paramsString = 'q=URLUtils.searchParams&topic=api'
var searchParams = new URLSearchParams(paramsString)

for (let [k, v] of searchParams) {
  console.log(k, v)
}

// 输出
// 'q', 'URLUtils.searchParams'
// 'topic', 'api'

searchParams.has('topic') // true
searchParams.get('topic') // 'api'
searchParams.getAll('topic') // ["api"]
searchParams.get('foo') // null
searchParams.append('topic', 'webdev')
searchParams.toString() // "q=URLUtils.searchParams&topic=api&topic=webdev"
searchParams.set('topic', 'More webdev')
searchParams.toString() // "q=URLUtils.searchParams&topic=More+webdev"
searchParams.delete('topic')
searchParams.toString() // "q=URLUtils.searchParams"
```

## `trim` 去除首尾空格

```js
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) =>
  str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
```

`String.prototype.trim()`方法不存在时，使用正则实现。

## `forEach` 遍历数组或对象

```js
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  let i
  let l

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj]
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj)
    const len = keys.length
    let key

    for (i = 0; i < len; i++) {
      key = keys[i]
      fn.call(null, obj[key], key, obj)
    }
  }
}
```

1. 如果入参是`null`或者`undefined`，函数直接退出，默认返回 `undefined`;
1. 如果入参不是对象类型（数组也是对象类型中的一种，`typeof [] === 'object'`），则包裹入参使其成为数组类型；
1. 如果是数组，回调函数将会传入每个元素的值，索引和源数组；
1. 如果是对象，回调函数将会传入每个**可枚举**属性的值，属性名和源对象。

​

`forEach`方法封装了数组和对象的遍历，感觉会很有用。看讨论说内部遍历数组不用原生`forEach`是为了兼容 IE11，但我查了下从 IE9 开始就可以使用了。不过论兼容性和性能的话，还是比不了 for 循环的吧。

## `findKey` 查找对象的键

```js
function findKey(obj, key) {
  key = key.toLowerCase()
  const keys = Object.keys(obj)
  let i = keys.length
  let _key
  while (i-- > 0) {
    _key = keys[i]
    if (key === _key.toLowerCase()) {
      return _key
    }
  }
  return null
}
```

1. 将键转换为小写；
2. 获取对象的所有键；
3. 从后往前遍历键，如果找到匹配的键，返回该键，否则返回 null。

## `_global` 获取全局对象

```js
const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== 'undefined') return globalThis
  return typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : global
})()
```

1. 先判断是否存在`globalThis`，存在则返回；
2. 判断是否存在`self`，存在则返回；
3. 判断是否存在`window`，存在则返回；
4. 以上都不存在，返回`global`。

## `isContextDefined` 判断上下文是否存在

```js
const isContextDefined = (context) => !isUndefined(context) && context !== _global
```

1. 判断上下文是否为`undefined`；
2. 判断上下文是否为全局对象。

## `merge` 合并对象

````js
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const { caseless } = (isContextDefined(this) && this) || {}
  const result = {}
  const assignValue = (val, key) => {
    const targetKey = (caseless && findKey(result, key)) || key
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val)
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val)
    } else if (isArray(val)) {
      result[targetKey] = val.slice()
    } else {
      result[targetKey] = val
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue)
  }
  return result
}
````

1. 声明`result`结果对象；
1. 声明`assignValue`回调处理函数；
1. `for`循环遍历传入的数个对象；
1. 再用上文的`forEach`方法遍历每个对象，调用回调函数`assignValue`；
1. 回调中`isPlainObject`判断当前属性值和结果对象中同名属性值是否都是纯对象，是则递归合并两者并为结果对象同名属性赋值，否则判断下一项；
1. 当前值为纯对象时，合并空对象和当前值，并赋值给结果对象；
1. 当前值为数组时，使用`Array.prototype.slice()`方法将当前值拷贝一份赋值给结果对象；
1. 不符合以上条件的值，直接赋值给结果对象；
1. 所有参数对象循环完毕，返回结果对象。

`merge({}, val)`中空对象好像没有什么意义，并不像`Object.assign()`一样作为目标对象，直接使用`merge(val)`也行……
​
原以为`merge()`有深拷贝的作用，但又看到对数组的处理是仅用`slice()`进行拷贝，那么如果入参是一个类似 `{foo: [{bar: 123}]}`的复杂对象，那么在合并后：

```js
const obj = { foo: [{ bar: 123 }] }
const result = merge(obj)

console.log(obj === result) // false
console.log(obj.foo === result.foo) // false
console.log(obj.foo[0] === result.foo[0]) // true
```

## `bind` 为函数绑定 `thisArg`

```js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments)
  }
}
```

## `extend` 继承对象

```js
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg)
      } else {
        a[key] = val
      }
    },
    { allOwnKeys },
  )
  return a
}
```

目标对象`a`将会继承源对象`b`的属性。如果要继承的属性值是一个函数，并且为`extend`函数提供了参数`thisArg`，那么`a`继承来的方法会已参数`thisArg`作为`this`来执行。

## `stripBOM` 删除 `UTF-8` 编码中的 `BOM`

> BOM（Byte Order Mark），字节顺序标记，出现在文本文件头部，Unicode 编码标准中用于标识文件是采用哪种格式的编码。

```js
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1)
  }
  return content
}
```
