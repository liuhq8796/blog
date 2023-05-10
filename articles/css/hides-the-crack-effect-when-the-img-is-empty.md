# 隐藏 img 为空时的图裂效果

## 问题

当 img 标签的 src 为空时，网页中会出现图裂的图标，非常的不美观，如下所示：

![图裂](./images/hides-the-crack-effect-when-the-img-is-empty/img-error.png)

## 解决方案

可以为其添加以下代码，即当 img 元素为空时，设置元素透明度为 0，则此时图裂图标也被隐藏起来了。

```css
img[src=''],
img:not([src]) {
  opacity: 0;
}
```
