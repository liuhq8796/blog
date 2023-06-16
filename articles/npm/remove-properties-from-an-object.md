# 剔除对象中的属性

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 36 期，链接：[https://juejin.cn/post/7118782469360320542](https://juejin.cn/post/7118782469360320542)。

## 用法

```js
var omit = require('omit.js');
omit({ name: 'Benjy', age: 18 }, ['name']); // => { age: 18 }
```

用途极其简单，只是剔除对象中的某些属性，返回剔除后的对象。不过值得注意的是，omit 方法并不会修改原对象，而是做了一层浅拷贝之后再在拷贝的对象上进行剔除并返回。

做拷贝的意义在于可以保留源对象，否则剔除之后对象中就没有这个属性了，万一下一次还有用就尴尬了，这也是一种常见的情况。一般来说，碰到这种情况的时候，我们自己手动拷贝一次再剔除属性也花不了几行代码，但既然有个写好的方法让我们用，何乐而不为呢，再说能节约几行代码也是一件好事。

## 源码解读

### 主文件

```js
function omit(obj, fields) {
    // eslint-disable-next-line prefer-object-spread
    const shallowCopy = Object.assign({}, obj);
    for (let i = 0; i < fields.length; i += 1) {
        const key = fields[i];
        delete shallowCopy[key];
    }
    return shallowCopy;
}

export default omit;
```

用 Object.assign 做浅拷贝，然后再用 for 循环删除指定的属性，解读完毕。

### 测试文件

```js
import assert from 'assert';
import omit from '../src';

describe('omit', () => {
    it('should create a shallow copy', () => {
        // 定义对象
        const benjy = { name: 'Benjy' };
        // 不做剔除仅接收返回对象
        const copy = omit(benjy, []);
        // 确认两个对象内部的属性是否相同 copy.name === benjy.name
        assert.deepEqual(copy, benjy);
        // 确认两个对象不相等 copy !== benjy
        assert.notEqual(copy, benjy);
    });

    it('should drop fields which are passed in', () => {
        const benjy = { name: 'Benjy', age: 18 };
        assert.deepEqual(omit(benjy, ['age']), { name: 'Benjy' });
        assert.deepEqual(omit(benjy, ['name', 'age']), {});
    });
});
```

两端测试的目的也很明确，第一段测试用例是测试源对象是否被拷贝，第二段测试用例是测试剔除的属性是否被剔除。

## 总结

这总结写什么好呢，感觉学到了，又感觉不对劲，可能比起功能实现，作者的编译打包、发包工具更值得探究一下，实际使用的话应该不会单独安装一个包来用，更可能在项目中实现一遍或者直接用 lodash 的 omit 方法，毕竟 lodash 也是一个很值得学习的库。
