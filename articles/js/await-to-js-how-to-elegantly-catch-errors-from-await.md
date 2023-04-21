# await-to-js —— 如何优雅的捕获 await 的错误

## 前言

> 本文参加了由 [公众号@若川视野](https://lxchuan12.gitee.io/) 发起的每周源码共读活动，点击[了解详情](https://juejin.cn/post/7079706017579139102)一起参与。

> 这是源码共读的第 21 期，链接：[https://juejin.cn/post/7083109687591338021](https://juejin.cn/post/7083109687591338021)。

## 用法

<!-- prettier-ignore-start -->
```js
import to from 'await-to-js'

async function asyncTask() {
  let err, user, savedTask

  ;[err, user] = await to(UserModel.findById(1))
  if (!user) throw new CustomerError('No user found')

  ;[err, savedTask] = await to(TaskModel({ userId: user.id, name: 'Demo Task' }))
  if (err) throw new CustomError('Error occurred while saving task')

  if (user.notificationsEnabled) {
    const [err] = await to(NotificationService.sendNotification(user.id, 'Task Created'))
    if (err) console.error('Just log the error and continue flow')
  }
}
```
<!-- prettier-ignore-end -->

没有回调地狱，没有一个接着一个的链式调用，也没有大段大段的 try/catch，只有一个简单的 `await`。解构一下返回的结果，就可以很方便的捕获错误。

## 源码解读

```ts
// src\await-to-js.ts
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}

export default to
```

如果对 ts 不熟悉很可能会看晕，那么就来精简一下：

```js
export default function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => {
        if (errorExt) {
            var parsedError = Object.assign({}, err, errorExt);
            return [parsedError, undefined];
        }
        return [err，undefined]
    });
}
```

这样就好看多了。可以看到，`to` 函数返回了一个定义了 `then` 和 `catch` 方法的 `promise`。如果 `promise` 执行正确，那么 `then` 方法返回 `[null, data]`，如果 `promise` 执行错误，那么 `catch` 方法根据是否提供了额外的错误对象返回 `[err, undefined]` 或者 `[parsedError, undefined]`。

源码就是怎么简单，你看懂了吗？管你看没看懂，点赞就完了。

## 总结

原理就不总结了，看看源码就懂了。看完这个库的感受是，觉得自己以前写的代码好啰嗦，async/await 都没怎么用，到处是 promise 的链式调用，已经变成链式地狱了 2333，以后就用这个 await-to-js 了。

再一次感觉源码也没想象的那么难，好用的库不一定都是大而全，有时候一个好点子也能成为一个热门项目。

## 相关链接

- await-to-js Github: https://github.com/scopsy/await-to-js
- 官方文章：[How to write async await without try-catch blocks in Javascript](https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/)
