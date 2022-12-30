# notebook

## 如何新增笔记

```sh
npm run new [type] [title] (order) (url)
```

- type: 必填，笔记类型。
  ```js
  {
    0: '无',
    1: '源码共读',
    2: '最佳实践',
    3: 'TS 类型体操'
  }
  ```
- title: 必填，笔记标题。
- order: 选填，若 type === 1，则为源码共读期数。
- url: 选填，若 type === 1，则为源码共读链接；若 type === 3，则为挑战链接。