# 【源码共读】为什么 Vue2 中 this 能够直接获取到 data 和 methods ?

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 23 期，链接：https://juejin.cn/post/7092564785161568293。

## 示例：this 能够直接获取到 data 和 methods

知周所众，Vue2 的 this 可以直接获取到 data 和 methods。但多数人只知道可以这样用，不知道为什么可以这样用。

```js
const vm = new Vue({
  data: {
    name: "Lucas",
  },
  methods: {
    sayName() {
      console.log(this.name);
    },
  },
});

console.log(vm.name); // Lucas
vm.sayName(); // Lucas
```

`vm` 对象为什么能够直接获取到 `data` 里的数据和 `methods` 里的方法呢？

## 源码解读

### Vue 构造函数

```js
function Vue(options) {
  if (!(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
```

### \_init 初始化函数

`_init` 函数是在上述 `initMixin` 函数中被添加到 Vue 构造函数的原型上的。

```js
// 代码有删减
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }

    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, "beforeCreate");
    initInjections(vm); // resolve injections before data/props
    //  初始化状态
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created");
  };
}
```

### initState 初始化状态

```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  // 有传入 methods，初始化方法
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  // 有传入 data，初始化 data
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

从内部调用的函数名猜测，这个函数的主要功能是：

1. 初始化 `props`
2. 初始化 `methods`
3. 初始化 `data`
4. 初始化 `computed`
5. 初始化 `watch`

### initMethods 初始化方法

```js
function initMethods(vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (typeof methods[key] !== "function") {
        warn(
          'Method "' +
            key +
            '" has type "' +
            typeof methods[key] +
            '" in the component definition. ' +
            "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn('Method "' + key + '" has already been defined as a prop.', vm);
      }
      if (key in vm && isReserved(key)) {
        warn(
          'Method "' +
            key +
            '" conflicts with an existing Vue instance method. ' +
            "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] =
      typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
  }
}
```

`initMethods` 函数的逻辑是：

1. 判断 methods 中的每一项是否是函数，如果不是，则警告
2. 判断 methods 中的每一项是否和 props 中的属性冲突了，如果是，则警告
3. 判断 methods 中的每一项是否和 Vue 的实例方法冲突，并且方法名是以保留字符 `_`、`$` 开头的(在 JS 中一般用来标识内部变量)，如果是，则警告
4. 如果通过了上述所有的判断，则将 methods 中的每一项挂载到 vm 上，并使用 bind 方法绑定函数的 this 指向 vm

**这就是为什么我们可以用过 `this` 直接访问到 `methods` 里面的函数的原因**。

上述 `initMethods` 函数中用到了一些 Vue 内部的工具函数 `hasOwn`检测是否是自己的属性、`noop`空函数、`bind`的 polyfill、`isReserved`是否是内部私有保留的字符串$ 和 \_ 开头，这些函数的实现统一放到 `initData` 方法后的章节来展示。

### initData 初始化 data

```js
function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn(
      "data functions should return an object:\n" +
        "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          'Method "' + key + '" has already been defined as a data property.',
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      warn(
        'The data property "' +
          key +
          '" is already declared as a prop. ' +
          "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```

`initData` 函数的逻辑是：

1. 判断 `data` 是否是函数，如果是，则调用 `getData` 函数，并将返回值赋值给 `vm._data` 和临时变量 `data`
2. 判断最终获取到的 `data` 是否是对象，如果不是，则警告
3. 判断 `data` 中的每一项是否和 `methods` 中的方法冲突了，如果是，则警告
4. 判断 `data` 中的每一项是否和 `props` 中的属性冲突了，如果是，则警告
5. 判断 `data` 中的每一项是否是以保留字符 `_`、`$` 开头的(在 JS 中一般用来标识内部变量)，如果是，不做处理；如果不是，则将 `data` 中的每一项做一层代理，代理到 vm 的 `_data` 上
6. 最后监测 data，使之成为响应式的数据。这个涉及到 Vue 的响应式原理，和本篇文章讨论的内容相关性不大，暂时不做详细的讨论。

**这就是为什么我们可以用过 `this` 直接访问到 `data` 里面的属性的原因**。

上述 `initMethods` 函数中用到了 Vue 内部的工具函数 `getData`获取数据、`proxy`代理，包括前一个章节用到的工具函数，现在就来看看这些函数的实现。

### 工具函数

#### `hasOwn`检测是否是自己的属性

```js
/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

hasOwn({ a: undefined }, "a"); // true
hasOwn({}, "a"); // false
hasOwn({}, "hasOwnProperty"); // false
hasOwn({}, "toString"); // false
// 是自己的本身拥有的属性，不是通过原型链向上查找的。
```

#### `noop` 空函数

常用来初始化赋值。

```js
/* eslint-disable no-unused-vars */
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) {}
```

#### `polyfillBind` bind 的 polyfill

```js
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;

// 用例
var a = 1;
function logA() {
  console.log(this.a);
}
var obj = { a: 2 };
bind(logA, obj)();
// 2
```

兼容了老版本不支持原生的 `bind` 函数，如果 `Function.prototype` 上有 `bind` 方法，则使用方法；否则使用定义的 `polyfillBind`。

`polyfillBind` 在实现上区分了 `call` 和 `apply`，据说是因为性能问题。`call` 用于在无参数或仅有单个参数时绑定 `this`，`apply` 用于绑定 this 和多个参数。

#### isReserved 是否是内部私有保留的字符串$ 和 \_ 开头

```js
/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
  var c = (str + "").charCodeAt(0);
  return c === 0x24 || c === 0x5f;
}
isReserved("_data"); // true
isReserved("$options"); // true
isReserved("data"); // false
isReserved("options"); // false
```

#### getData 获取数据

当 data 属性是函数时，调用该函数获取数据。

```js
function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}
```

#### proxy 代理

其实就是 `Object.defineProperty` 的一个封装，这里的用途是通过 `this.xxx` 访问到 `this._data.xxx`。

```js
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) {}
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

#### 其他内置的工具函数

其他工具函数的实现可以看看另一篇文章 [【源码共读】Vue2 工具函数 | 初学者也能看懂的 Vue2 源码中那些实用的基础工具函数](./%E3%80%90%E6%BA%90%E7%A0%81%E5%85%B1%E8%AF%BB%E3%80%91Vue2%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0_%E5%88%9D%E5%AD%A6%E8%80%85%E4%B9%9F%E8%83%BD%E7%9C%8B%E6%87%82%E7%9A%84Vue2%E6%BA%90%E7%A0%81%E4%B8%AD%E9%82%A3%E4%BA%9B%E5%AE%9E%E7%94%A8%E7%9A%84%E5%9F%BA%E7%A1%80%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0.md)。

## 实现一个简化版

```js
function noop(a, b, c) {}
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};
function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
function initData(vm) {
  const data = (vm._data = vm.$options.data);
  const keys = Object.keys(data);
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    proxy(vm, "_data", key);
  }
}
function initMethods(vm, methods) {
  for (var key in methods) {
    vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm);
  }
}

function Person(options) {
  let vm = this;
  vm.$options = options;
  var opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
}

// 实现效果
const p = new Person({
  data: {
    name: "Lucas",
  },
  methods: {
    sayName() {
      console.log(this.name);
    },
  },
});

console.log(p.name); // Lucas
p.sayName(); // Lucas
```

## 总结

本文涉及到的许多 JS 的基础支持，如：

1. 构造函数
2. `this` 指向
3. `call`、`apply`、`bind`
4. `Object.defineProperty`
5. 等等

回答文章标题的提问，能通过 `this` 直接获取到 `data` 和 methods 里面的属性和方法的原因是：

`data`里的属性最终会存储到 new Vue 的实例（vm）上的 `_data`对象中，访问 `this.xxx`，是访问`Object.defineProperty`代理后的 `this._data.xxx`。

而`methods`里的方法通过 `bind` 指定了`this`为 new Vue 的实例(vm)。

这种设计的好处在于便于获取，但也会使 `props`、`data`、`methods` 三者容易产生冲突。

这部分的源码难度不大，看过了之后就会觉得原来 Vue 的源码也没想象中的那么难，至少有一部分是能看懂的。
