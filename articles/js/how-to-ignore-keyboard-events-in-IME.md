# 如何忽略输入法中的键盘事件

## 前言

通常我们在写 input 或 textarea 的时候，会监听键盘事件，比如监听回车键，然后触发提交表单的操作。但是当我们希望回车确认英文的时候，同时也会触发表单的提交，这个时候就需要忽略输入法中的键盘事件。

## 结论先行

```js
const input = document.querySelector('input')
input.addEventListener('keydown', (event) => {
  // 判断事件是否是输入法中的键盘事件
  if (event.isComposing || event.keyCode === 229) {
    return
  }
  if (event.key === 'Enter') {
    // do something
  }
})
```

## 实现原理

`KeyboardEvent.isComposing` 是一个只读属性，返回一个 Boolean 值，表示该事件是否在 [`compositionstart`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionstart_event) 之后和 [`compositionend`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionend_event) 之前被触发。

我们可以通过判断 `event.isComposing` 来判断是否是输入法中的键盘事件，如果是，就忽略掉。

```js
const input = document.querySelector('input')
input.addEventListener('keydown', (event) => {
  if (event.isComposing) {
    return
  }
  if (event.key === 'Enter') {
    // do something
  }
})
```

这种方法简洁有效但兼容性稍差，可以使用 `event.keyCode` 来辅助判断，原理是当中文输入法开启的时候，你按下任意键，`event.keyCode` 的值都是 `229`，所以我们可以通过判断 `event.keyCode` 是否等于 `229` 来判断是否是输入法中的键盘事件。

```js
const input = document.querySelector('input')
input.addEventListener('keydown', (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return
  }
  if (event.key === 'Enter') {
    // do something
  }
})
```
