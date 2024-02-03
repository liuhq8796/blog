# WebP 图片的优雅降级方案

## 方案一：`<picture>` + `<source>`

> HTML `<picture>` 元素通过包含零或多个 `<source>` 元素和一个 `<img>` 元素来为不同的显示/设备场景提供图像版本。浏览器会选择最匹配的子 `<source>` 元素，如果没有匹配的，就选择 `<img>` 元素的 src 属性中的 URL。然后，所选图像呈现在`<img>`元素占据的空间中。

```html
<picture>
  <source srcset="demo.webp" type="image/webp"/>
  <img src="demo.jpg" alt="" />
</picture>

```

## 方案二：检测支持 + 样式覆盖

如果需要替换背景图片，则可以先检测浏览器是否支持 WebP，不支持的话就在根节点上添加名为 `webp-not-supported` 的 class，之后通过这个 class 在不支持的浏览器中用兜底图片覆盖。

首先，通过 canvas 的 toDataURL 方法进行检测：

```js
const isSupportWebp = function () {
  try {
    return document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') === 0;
  } catch(err) {
    return false;
  }
}
```

判断检测结果，如果不支持则在根节点上添加名为 `webp-not-supported` 的 class：

```js
if (!isSupportWebp) {
    document.documentElement.classList.add('webp-not-supported')
}
```

最后，通过 `webp-not-supported` class 控制加载兜底图片。这里以使用了 Sass 预编译器的代码为例子，进一步简化代码：

```scss
@mixin webpBg($url) {
    background-image: url($url + '.webp')
    @at-root .webp-not-supported & {
        background-image: url($url + '.png')
    }
}
```

```html
<html class="webp-not-supported">
    <!-- 其他元素略 -->
    <div class="test-pic"></div>
</html>
```

```scss
.test-pic {
    @include webpBg('./image/test')
}
```