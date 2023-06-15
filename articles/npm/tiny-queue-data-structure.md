# 微小的队列数据结构

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 32 期，链接：[https://juejin.cn/post/7090769807804956679](https://juejin.cn/post/7090769807804956679)。

## yocto-queue

> You should use this package instead of an array if you do a lot of Array#push() and Array#shift() on large arrays, since Array#shift() has linear time complexity O(n) while Queue#dequeue() has constant time complexity O(1). That makes a huge difference for large arrays.

从上面摘抄自官方仓库的描述可以看到，yocto-queue 是用来给大型的队列数据结构的 `shift` 方法做优化的。在队列数据结构先进先出的场景下，数组 `shift` 方法的时间复杂度是 O(n)，因为后面的元素都需要向前移动一位。而 yocto-queue 的 `dequeue` 方法通过链表的实现方式将复杂度降到 O(1)，从而优化该场景下的性能。

## 源码解读

### 实现 Node 节点

```js
class Node {
    value; // 存储当前节点的值
    next; // 存储下一个节点的引用

    constructor(value) {
        this.value = value;
    }
}
```

### 整体 API

```js
export default class Queue {
    #head; // 存储队列的头节点
    #tail; // 存储队列的尾节点
    #size; // 当前队列元素的个数

    constructor() {
        this.clear();
    }

    // 入队
    enqueue(val) {}

    // 出队
    dequeue() {}

    // 清空
    clear() {}

    // 获取队列的长度
    get size() {}

    // 实现队列的遍历
    *[Symbol.iterator]() {}
}
```

### 队列 API 实现

#### enqueue

```js
enqueue(val) {
    const node = new Node(val)

    if (this.#head) {
        // 如果队列不为空，则将新节点挂在队列的尾部
        this.#tail.next = node
        // 再将尾部节点的引用指向新节点
        this.#tail = node
    } else {
        // 如果队列为空，则将头节点指向新节点
        this.#head = node
        // 将尾节点也指向新节点
        this.#tail = node
    }

    // 将队列的元素个数加 1
    this.#size++
}
```

#### dequeue

```js
dequeue() {
    // 获取头结点
    const current = this.#head
    // 如果队列为空，直接返回
    if (!current) {
        return
    }
    // 将头结点的引用指向下一个节点
    this.#head = this.#head.next
    // 队列元素个数减 1
    this.#size--
    // 返回出队的节点的值
    return current.value
}
```

#### clear

```js
clear() {
    // 清空头结点和尾结点的引用，并将队列的元素个数置为 0
    this.#head = undefined;
    this.#tail = undefined;
    this.#size = 0;
}
```

#### size

```js
get size() {
    // 返回队列的元素个数
    return this.#size
}
```

#### Symbol.iterator 的使用

Symbol.iterator 为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。

```js
* [Symbol.iterator]() {
    let current = this.#head;
    // 通过循环，不断挪动指针获取到值
    while (current) {
            yield current.value;
            current = current.next;
    }
}
```

举个例子：

```js
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log([...queue]); // [1, 2]
```

### 测试一下

yocto-queue 使用了 ava 测试工具，可以在 `test.js` 中进行测试。

```js
import test from 'ava';
import Queue from './index.js';

test('.enqueue()', (t) => {
    const queue = new Queue();
    queue.enqueue('🦄');
    t.is(queue.dequeue(), '🦄');
    queue.enqueue('🌈');
    queue.enqueue('❤️');
    t.is(queue.dequeue(), '🌈');
    t.is(queue.dequeue(), '❤️');
});

test('.dequeue()', (t) => {
    const queue = new Queue();
    t.is(queue.dequeue(), undefined);
    t.is(queue.dequeue(), undefined);
    queue.enqueue('🦄');
    t.is(queue.dequeue(), '🦄');
    t.is(queue.dequeue(), undefined);
});

test('.clear()', (t) => {
    const queue = new Queue();
    queue.clear();
    queue.enqueue(1);
    queue.clear();
    t.is(queue.size, 0);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    queue.clear();
    t.is(queue.size, 0);
});

test('.size', (t) => {
    const queue = new Queue();
    t.is(queue.size, 0);
    queue.clear();
    t.is(queue.size, 0);
    queue.enqueue('🦄');
    t.is(queue.size, 1);
    queue.enqueue('🦄');
    t.is(queue.size, 2);
    queue.dequeue();
    t.is(queue.size, 1);
    queue.dequeue();
    t.is(queue.size, 0);
    queue.dequeue();
    t.is(queue.size, 0);
});

test('iterable', (t) => {
    const queue = new Queue();
    queue.enqueue('🦄');
    queue.enqueue('🌈');
    t.deepEqual([...queue], ['🦄', '🌈']);
});
```

## 总结

学习到了如何实现一个链表以及如何使用 Symbol.iterator 来实现链表的迭代。
