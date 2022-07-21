# 【源码共读】axios 工具函数 | 来了解一下 axios 定义了哪些工具函数

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 19 期，链接：https://juejin.cn/post/7083113675879350309。

## axios 工具函数解读

### `toString` 转字符串

```javascript
// 定义变量指向 Object.prototype.toString
var toString = Object.prototype.toString;
```

`Object.prototype.toString`方法返回一个表示该对象的字符串。
​

它的返回是这样的：

```javascript
let d = new Date();
let a = [];
let r = /\d+/;
console.log(toString.call(d)); // [object Date]
console.log(toString.call(a)); // [object Array]
console.log(toString.call(r)); // [object RegExp]
```

### `isArray`判断数组

```javascript
/**a
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  // 原方法
  // return toString.call(val) === '[object Array]';

  // 现已改为
  return Array.isArray(val);
}
```

与这个改动相关的 PR 提到这是面向未来 ECMAScript 规范的更改，以及提供性能优势，并且通常更清晰。
​

看到这儿我倒是想起 Vue3 源码中类似的工具函数则是定义了一个变量直接指向 isArray，写法更简洁：

```typescript
export const isArray = Array.isArray;
```

### `isUndefined`判断`undefined`

```javascript
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === "undefined";
}
```

可以使用 typeof 操作符来检测变量的数据类型，它的结果肯定是一个小写的字符串。

```javascript
var abc; // 声明但未定义
typeof abc; // undefined
typeof true; // boolean
typeof 123; // number
typeof "abc"; // string
typeof Symbol(); // symbol
```

注意：

```javascript
typeof null; // object
```

### `isBuffer`判断`buffer`

```javascript
/**
 * Detefrmine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    typeof val.constructor.isBuffer === "function" &&
    val.constructor.isBuffer(val)
  );
}
```

先判断不是 `undefined`和`null`，再判断 `val`存在构造函数，因为`Buffer`本身是一个类，最后通过自身的 `isBuffer`方法判断。
​

因为 axios 不仅可以运行在浏览器中，还可以运行在 node 环境中，所以处理二进制数据是不可避免的。比如在处理像 TCP 流或文件流时，必须使用到二进制数据。
​

而 JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。因此在 Node.js 中，定义了一个`Buffer`类，该类用来创建一个**专门存放二进制数据的缓存区**。详细内容可以参考[官方文档](http://nodejs.cn/api/buffer.html#buffer)或者[更通俗易懂的解释](https://www.runoob.com/nodejs/nodejs-buffer.html)。

### `isFormData`判断`FormData`

```javascript
/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  // 原方法
  // return (typeof FormData !== 'undefined') && (val instanceof FormData);

  // 现已改为
  return toString.call(val) === "[object FormData]";
}
```

instanceof 操作符可以判断变量是否是给定类的实例。
​

比如下面这段代码：

```javascript
let d = new Date();
let a = [];
let n = null;
let r = /\d+/;
alert(d instanceof Date); // true
alert(a instanceof Array); // true
alert(n instanceof Object); // false
alert(r instanceof RegExp); // true
```

需要注意的是，虽然 typeof null 的结果是 object ，但 null 并不是 Object 的实例，所以 null instanceof Object 的结果是 false 。

### `isString`判断字符串

```javascript
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === "string";
}
```

### `isNumber`判断数字

```javascript
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === "number";
}
```

### `isObject`判断对象

```javascript
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === "object";
}
```

### `isPlainObject`判断纯对象

纯对象：使用对象字面量`{}`或`new Object()`创建的对象。

```javascript
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== "[object Object]") {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
```

首先使用`toString`方法排除了返回值不为`'[object Object]'`的目标对象，其次判断目标对象的原型是不是`null`或`Object.prototype`。
​

Vue3 源码中则是仅判断了第一项，及判断调用`toString`方法后返回的值是否是`'[object Object]'`：

```typescript
export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string =>
  objectToString.call(value);

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === "[object Object]";
```

看起来是 axios 的实现更严谨，排除了普通对象原型链被污染的特殊情况。

```javascript
const obj = Object.create(null);

// axios
isPlainObject(obj); // true
// vue
isPlainObject(obj); // true

// 为 obj 设置另一个原型对象
const prototype = { foo: "bar" };
Object.setPrototypeOf(obj, prototype);

// 此时，通过原型链的作用，obj 已经获得了一些原型属性和方法
obj.foo; // 'bar'
obj.constructor === Object; // true
obj.toString(); // '[object Object]'

// axios
isPlainObject(obj); // false
// vue
isPlainObject(obj); // true
```

### `isDate`判断`Date`

```javascript
/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === "[object Date]";
}
```

### `isFile`判断`File`

```javascript
/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === "[object File]";
}
```

### `isBlob`判断`Blob`

```javascript
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === "[object Blob]";
}
```

[Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 来用于数据操作。

### `isFunction`判断函数

```javascript
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}
```

### `isStream`判断是否是流

```javascript
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
```

### `isURLSearchParams`判断`URLSearchParams`

```javascript
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === "[object URLSearchParams]";
}
```

[URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) 接口定义了一些实用的方法来处理 URL 的查询字符串。例如：

```javascript
var paramsString = "q=URLUtils.searchParams&topic=api";
var searchParams = new URLSearchParams(paramsString);

for (let [k, v] of searchParams) {
  console.log(k, v);
}

// 输出
// 'q', 'URLUtils.searchParams'
// 'topic', 'api'

searchParams.has("topic"); // true
searchParams.get("topic"); // 'api'
searchParams.getAll("topic"); // ["api"]
searchParams.get("foo"); // null
searchParams.append("topic", "webdev");
searchParams.toString(); // "q=URLUtils.searchParams&topic=api&topic=webdev"
searchParams.set("topic", "More webdev");
searchParams.toString(); // "q=URLUtils.searchParams&topic=More+webdev"
searchParams.delete("topic");
searchParams.toString(); // "q=URLUtils.searchParams"
```

### `trim`去除首尾空格

```javascript
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
```

`String.prototype.trime()`方法不存在时，使用正则实现。

### `isStandardBrowserEnv`判断浏览器环境

```javascript
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (
    typeof navigator !== "undefined" &&
    (navigator.product === "ReactNative" ||
      navigator.product === "NativeScript" ||
      navigator.product === "NS")
  ) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}
```

在 web workers 中：

- `typeof window`->`undefined`
- `typeof document`->`undefined`

在 react-native 中：

- `navigator.product`->`'ReactNative'`

在 nativescript 中：

- `navigator.product`->`'NativeScript'`或`'NS'`

​

另外，官方已废弃`navigator.product`属性。

> Deprecated: This feature is no longer recommended. Though some browsers might still support it, it may have already been removed from the relevant web standards, may be in the process of being dropped, or may only be kept for compatibility purposes. Avoid using it, and update existing code if possible; see the compatibility table at the bottom of this page to guide your decision. Be aware that this feature may cease to work at any time.

在任何浏览器中，**Navigator.product** 属性始终返回 'Gecko'。保留这个属性只是出于兼容性目的。

### `forEach`遍历数组或对象

```javascript
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
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== "object") {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
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

### `merge`合并对象

````javascript
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
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
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

​

`merge({}, val)`中空对象好像没有什么意义，并不像`Object.assign()`一样作为目标对象，直接使用`merge(val)`也行……
​

原以为`merge()`有深拷贝的作用，但又看到对数组的处理是仅用`slice()`进行拷贝，那么如果入参是一个类似 `{foo: [{bar: 123}]}`的复杂对象，那么在合并后：

```javascript
const obj = { foo: [{ bar: 123 }] };
const result = merge(obj);

console.log(obj === result); // false
console.log(obj.foo === result.foo); // false
console.log(obj.foo[0] === result.foo[0]); // true
```

### `bind`为函数绑定 `thisArg`

```javascript
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}
```

和其他专门实现`bind`函数的文章比起来显得简陋许多，没有什么参数类型判断，支持函数柯里化等等。
​

还有一点不同的是提取`args`的方式。这里是先声明一个`arguments.length`长度的不包含任何实际元素的数组，再为数组的每一个索引位置赋值。其他实现则是以`Array.prototype.slice.call(arguemnts)`方法居多，不太清楚两者的区别……

### `extend`继承对象

```javascript
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
```

目标对象`a`将会继承源对象`b`的属性。如果要继承的属性值是一个函数，并且为`extend`函数提供了参数`thisArg`，那么`a`继承来的方法会已参数`thisArg`作为`this`来执行。

### `stripBOM`删除`UTF-8`编码中的`BOM`

> BOM（Byte Order Mark），字节顺序标记，出现在文本文件头部，Unicode 编码标准中用于标识文件是采用哪种格式的编码。

```javascript
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  return content;
}
```

## 总结

大部分方法比较基础和通用，在其他库中也能看到类似的实现，还认识了`Buffer`、`URLSearchParams`和 `Byte Order Mark`，【奇怪的知识增加了.jpg】。
​

本人拖延症晚期，但好在有开了坑就要填完的习惯，花了三天断断续续写完。希望能从中获得一些经验和灵感，能在日常工作中体现出来吧。
