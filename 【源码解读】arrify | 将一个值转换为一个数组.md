# 【源码解读】arrify | 将一个值转换为一个数组

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第33期，链接：https://juejin.cn/post/7100218384918249503。

## arrify 源码解读

### 前菜

首先打开 **package.json** 看看

```json
{
    "type": "module",
	"exports": "./index.js",
	"engines": {
		"node": ">=12"
	},
	"scripts": {
		"test": "xo && ava && tsd"
	},
	"files": [
		"index.js",
		"index.d.ts"
	],
	"devDependencies": {
		"ava": "^3.15.0",
		"tsd": "^0.14.0",
		"xo": "^0.39.1"
	}
}
```

- [`"type"`](https://nodejs.org/api/packages.html#type) 字段定义了 Node.js 用于以该 `package.json` 文件作为最近父级的所有 `.js` 文件的模块格式。
- [`"exports"`](https://nodejs.org/api/packages.html#exports) 字段提供了一种方法来为不同环境和 javascript 风格公开包模块，Node.js 12+ 支持它作为 [`"main"`](https://nodejs.org/api/packages.html#main) 的替代方案。
- [`"engines"`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines) 字段可以指定运行该包模块所需的 Node.js 版本(这里定为 12+ 应该是为了让 Node.js 能够识别 `exports` 字段)以及能够正确安装该包模块的 npm 版本。
- [`"files"`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) 字段描述了当该包模块作为依赖项安装时要包含的条目。

除此之外还有三个开发依赖：

- [**xo**](https://www.npmjs.com/package/xo)：JavaScript/TypeScript linter（ESLint 包装器）具有很好的默认值
- [**tsd**](https://www.npmjs.com/package/tsd)：该工具允许您通过创建扩展名为 `.test-d.ts` 的文件来为您的类型定义（即您的 `.d.ts` 文件）编写测试。
- [**ava**](https://www.npmjs.com/package/ava)：测试工具，用于测试模块的功能。运行后会执行根目录中的 `test.js` 的文件。

和一个测试启动脚本：`test: "xo && ava && tsd"`

- 先执行 **xo** 对源码进行检查
- 再执行 **ava** 跑 `test.js` 测试 index.js
- 最后执行 **tsd** 跑 `index.test-d.ts` 测试 index.d.ts

### 主菜

接下来就到了我们的主菜 `index.js`：

```js
export default function arrify(value) {
	if (value === null || value === undefined) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === 'string') {
		return [value];
	}

	if (typeof value[Symbol.iterator] === 'function') {
		return [...value];
	}

	return [value];
}
```

从这段源码中我们可以看到，`arrify` 函数的转换规则是：

- 如果 `value` 为 `null` 或 `undefined`，则返回空数组
- 如果 `value` 为数组，则返回该数组
- 如果 `value` 为字符串，则返回一个包含该字符串的数组
- 如果 `value` 为可遍历对象，则返回一个浅拷贝的包含该对象迭代结果的数组
- 否则返回一个包含该值的数组

另外，关于如 `arguments` 对象的**类数组对象**，作者在 https://github.com/sindresorhus/arrify/issues/2 中解释了不对其进行转换的原因：

> APIs should IMHO just accept Arrays. If you need to use an array like object it should be up to you to convert it. What if a user actually want the array-like object to be an element in the array. With ES6 this will be easy with `Array.from()`.

谷歌翻译了下，大意是：

“就我来说，API 应该只接受数组。如果您需要使用类似对象的数组，则应由您来转换它。如果用户实际上希望类数组对象成为数组中的一个元素怎么办。在 ES6 中，使用 Array.from() 会很容易。”

## 荤素搭配

看完函数实现，我们再来看看如何搭配 ts 类型定义：

```ts
// index.d.ts
export default function arrify<ValueType>(
	value: ValueType
): ValueType extends (null | undefined)
	? [] // eslint-disable-line  @typescript-eslint/ban-types
	: ValueType extends string
		? [string]
		: ValueType extends readonly unknown[]
			? ValueType
			: ValueType extends Iterable<infer T>
				? T[]
				: [ValueType];
```

可以看出，类型定义方式和上面 `arrify` 函数的实现方式是一致的：

- 如果泛型 `ValueType` 为 `null | undefined` 联合类型的子类，则返回空数组类型
- 如果泛型 `ValueType` 为字符串类型的子类，则返回一个字符串数组类型
- 如果泛型 `ValueType` 为数组类型的子类，则返回该数组类型
- 如果泛型 `ValueType` 为可遍历对象类型的子类，则返回一个包含该对象迭代结果的数组类型
- 否则返回一个包含该值的数组类型

## 餐后甜点

到这里正餐已经结束，但我们还可以品尝一些餐后甜点。

还记得那条测试脚本吗：`test: "xo && ava && tsd"`

**xo** 使用默认的配置，暂时不需要关心。**ava** 和 **tsd** 则需要我们添加测试脚本。

先来看功能测试的脚本 `test.js`：

```js
import test from 'ava';
import arrify from './index.js';

test('main', t => {
	t.deepEqual(arrify('foo'), ['foo']);
	t.deepEqual(arrify(new Map([[1, 2], ['a', 'b']])), [[1, 2], ['a', 'b']]);
	t.deepEqual(arrify(new Set([1, 2])), [1, 2]);
	t.deepEqual(arrify(null), []);
	t.deepEqual(arrify(undefined), []);

	const fooArray = ['foo'];
	t.is(arrify(fooArray), fooArray);
});
```

如作者所说，涵盖了除类数组外的常见情况。

然后是类型测试的脚本 `index.test-d.ts`：

```ts
/* eslint-disable  @typescript-eslint/ban-types */
import {expectType, expectError, expectAssignable} from 'tsd';
import arrify from './index.js';

expectType<[]>(arrify(null));
expectType<[]>(arrify(undefined));
expectType<[string]>(arrify('🦄'));
expectType<string[]>(arrify(['🦄']));
expectAssignable<[boolean]>(arrify(true));
expectType<[number]>(arrify(1));
expectAssignable<[Record<string, unknown>]>(arrify({}));
expectType<[number, string]>(arrify([1, 'foo']));
expectType<Array<string | boolean>>(
	arrify(new Set<string | boolean>(['🦄', true]))
);
expectType<number[]>(arrify(new Set([1, 2])));
expectError(arrify(['🦄'] as const).push(''));
expectType<[number, number] | []>(arrify(false ? [1, 2] : null));
expectType<[number, number] | []>(arrify(false ? [1, 2] : undefined));
expectType<[number, number] | [string]>(arrify(false ? [1, 2] : '🦄'));
expectType<[number, number] | [string]>(arrify(false ? [1, 2] : ['🦄']));
expectAssignable<number[] | [boolean]>(arrify(false ? [1, 2] : true));
expectAssignable<number[] | [number]>(arrify(false ? [1, 2] : 3));
expectAssignable<number[] | [Record<string, unknown>]>(arrify(false ? [1, 2] : {}));
expectAssignable<number[] | [number, string]>(
	arrify(false ? [1, 2] : [1, 'foo'])
);
expectAssignable<number[] | Array<string | boolean>>(
	arrify(false ? [1, 2] : new Set<string | boolean>(['🦄', true]))
);
expectAssignable<number[] | [boolean] | [string]>(
	arrify(false ? [1, 2] : (false ? true : '🦄'))
);
```

这类型测试的量比功能测试的多了不少啊，自从用了 ts 以后，还真是开发五分钟，定义两小时😂

## 吃饱后的闲聊

不愧是历史上最简单的一期，够简洁、够基础。

不过花了不少时间看明白 `package.json` 里的字段，以后再看其他包的时候好歹能看得懂这几个了。每次认识一两个，积少成多。

功能实现没几行代码，但是类型定义和测试的代码量估计得占了有4/5，不得不说是真的稳，想写出个 bug 都不容易。


