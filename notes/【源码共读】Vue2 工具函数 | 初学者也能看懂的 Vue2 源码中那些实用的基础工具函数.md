# 【源码共读】Vue2 工具函数 | 初学者也能看懂的 Vue2 源码中那些实用的基础工具函数

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第24期，链接：https://juejin.cn/post/7024276020731592741。

## Vue2 工具函数解读

### emptyObject

```js
var emptyObject = Object.freeze({});
```

冻结对象，第一层无法修改。`Object` 对象中也有判断是否冻结的方法：

```js
Object.isFrozen(emptyObject); // true
```

### `isUndef`是否是未定义

```js
// These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }
```

### `isDef`是否是已经定义

见名知意。

```js
function isDef(v) {
  return v !== undefined && v !== null
}
```

除此之外，Vue2 源码中还封装了 `isDef`、`isTrue`、`isFalse` 函数来准确判断。

### `isTrue`是否是 true

见名知意。

```js
function isTrue (v) {
  return v === true
}
```

### `isFalse`是否是 false

见名知意。

```js
function isFalse (v) {
  return v === false
}
```

### `isPrimitive`是否是原始值

判断是否是字符串、数字、布尔值或者 Symbol。

```js
/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

### `isObject`是否是对象

排除了 `typeof null` 返回 `'object'` 的情况。

```js
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

// 例子:
isObject({}); // true
isObject([]) // true 有时不需要严格区分数组和对象
isObject(function () {}); // true
isObject(null); // false
```

### `toRawType`转换成原始类型

[`Object.prototype.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法返回一个表示该对象的字符串。

```js
/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

// 例子：
toRawType({}); // 'Object'
toRawType([]); // 'Array'
toRawType(function () {}); // 'Function'
toRawType(null); // 'Null'
toRawType(undefined); // 'Undefined'
toRawType(new Date()); // 'Date'
```

### `isPlainObject`是否是纯对象

```js
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

// 例子：
isPlainObject({}) // true
isPlainObject([]) // false
isPlainObject(new Date()); // false
```

### `isRegExp`是否是正则表达式

```js
function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

// 例子：
isRegExp(/abc/); // true
```

### `isValidArrayIndex`是否是有效的数组索引

```js
/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
```

该全局 [`isFinite()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isFinite) 函数用来判断被传入的参数值是否为一个有限数值（finite number）。在必要情况下，参数会首先转为一个数值

### `isPromise`是否是 Promise 对象

```js
function isPromise (val) {
    return {
        isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function'
    }
}

// 例子：
isPromise(new Promise(() => {})); // true
isPromise(Promise.resolve()); // true
isPromise(Promise.reject()); // true
isPromise(Promise.all([])); // true
```

这里用 `isObject` 代替 `isDef` 其实会更严谨，毕竟在 Vue3 里他们就这样做了。

### `toString`转换成字符串

如果是数组，或者是没有修改过原型链上 `toString` 方法的纯对象，则会调用 `JSON.stringify()` 转换

```js
/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}
```

### `toNumber`转数字

转换成数字，如果转换失败则返回输入值。

```js
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

toNumber('a') // 'a'
toNumber('1') // 1
toNumber('1a') // 1
toNumber('a1') // 'a1'
```

### makeMap 生成一个 map (对象)

传入一个以逗号分隔的字符串，生成一个 `map` 键值对对象，并返回一个函数检测 `key` 值在不在这个 `map` 中。第二个参数时小写选项。

```js
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}
```

只看实现不理解有什么作用，还是要结合后两个函数的实际应用来看。

### `isBuiltInTag`是否是内置的tag

```js
/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

console.log(isBuiltInTag('slot'))  // true
console.log(isBuiltInTag('component')) // true
console.log(isBuiltInTag('Slot'))  // true
console.log(isBuiltInTag('Component'))  // true
```

### `isReservedAttribute`是否是保留的属性

```js
/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
 
 console.log(isReservedAttribute('key'))// true
 console.log(isReservedAttribute('ref')) // true
 console.log(isReservedAttribute('slot')) // true
 console.log(isReservedAttribute('slot-scope')) // true
 console.log(isReservedAttribute('is') )// true
 console.log(isReservedAttribute('IS') )// undefined
```

### `remove`移除数组中的一项

```js
/**
 * Remove an item from an array.
 */
function remove (arr, item) {
    if (arr.length) {
        var index = arr.indexOf(item);
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
this.handlers = [];

// 移除
if (this.handlers[id]) {
  this.handlers[id] = null;
}

// 执行
if (h !== null) {
  fn(h);
}
```

### `hasOwn`检测是否是自己的属性

```js
/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}
```

### `cached`缓存

利用闭包特性，缓存数据

```js
/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}
```

### `camelize`连字符转小驼峰

```js
/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

// 例子：
console.log(camelize('on-click')) // 'onClick'
```

### `capitalize`首字母转大写

```js
/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});
```

### `hyphenate`小驼峰转连字符

```js
/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

// 例子：
console.log(hyphenate('onClick')) // 'on-click'
```

### `polyfillBind` bind 的 polyfill
  
```js
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

// 用例
var a = 1
function logA() {
	console.log(this.a)
}
var obj = {a:2}
bind(logA,obj)()
// 2
```

如果 `Function.prototype` 上有 `bind` 方法，则使用方法；否则使用定义的 `polyfillBind`。

`polyfillBind` 在实现上区分了 `call` 和 `apply`，`call` 用于在无参数或仅有单个参数时绑定 `this`，`apply` 用于绑定 this 和多个参数。

### `toArray` 将类数组转为数组

把类数组转换为数组，支持指定从哪个位置开始，默认从 0 开始。

```js
/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

// 例子：
function fn(){
  var arr1 = toArray(arguments);
  console.log(arr1);
  var arr2 = toArray(arguments, 2);
  console.log(arr2);
}

fn(1,2,3,4,5);
// [1, 2, 3, 4, 5]
// [3, 4, 5]
```

### `extend` 对象合并

```js
/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

// 例子：
const data = { name: '哆啦A梦' };
const data2 = extend(data, { desc: '蓝色机器猫', name: '是哆啦A梦' });
console.log(data); // { name: '是哆啦A梦', desc: '蓝色机器猫' }
console.log(data2); // { name: '是哆啦A梦', desc: '蓝色机器猫' }
console.log(data === data2); // true
```

### `toObject` 转对象

将对象数组合并到一个对象中。

```js
/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

var obj = {a:1,b:2}
var obj2 = {a: 'hello', c: 3}
const res =  toObject([obj, obj2])
console.log(res)
// {a: 'hello', b: 2, c: 3}
```

### `noop` 空函数

常用来初始化赋值。

```js
/* eslint-disable no-unused-vars */
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}
```

### `no` 永远返回 false

```js
/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };
/* eslint-enable no-unused-vars */
```

### `identity` 返回参数本身

```js
/**
 * Return the same value.
 */
var identity = function (_) { return _; };
```

### `genStaticKeys` 生成静态属性

```js
/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}
```

### `looseEqual` 宽松相等

因为对象、数组等都是引用类型，所以两个内容看起来是相等的值，实际上并不是严格相等的。

```js
var a = {};
var b = {};
a === b; // false
a == b; // false
```

所以该函数是对数组、日期、对象进行递归比对。如果内容完全相等则宽松相等。

```js
/** 
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}
```

### `looseIndexOf` 宽松的 indexOf

该函数实现的是宽松相等，原生的 `indexOf` 是严格相等的。

```js
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}
```

### `once` 确保函数只执行一次

利用闭包特性，存储状态

```js
/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}


const fn1 = once(function(){
  console.log('哎嘿，无论你怎么调用，我只执行一次');
});

fn1(); // '哎嘿，无论你怎么调用，我只执行一次'
fn1(); // 我不输出
fn1(); // 我还不输出
fn1(); // 我就不输出
```

### 生命周期等

最后是 Vue2 里内置的一些属性、资源类型、生命周期集合。

```js
var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];
```

[Vue 生命周期](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)

## 总结

工具函数不像核心逻辑一样需要理解他的思想，而是非常基础的JS函数，还是比较容易看懂的。比较麻烦的一点是不清楚这些函数的使用场景，还需要一点一点摸索。

几个比较有意思的方法都包含了一些知识点的细节，比如缓存和once用到了闭包特性，了解了如何用call和apply实现一个bind方法等，这些都是很有意思的实现，又能加深对知识点的理解。

每天进步一点，积跬步，至千里。