# 重置 box-sizing 的最佳实践

先说结论：

```css
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

/**
 * 如果有需要在 content-box 模式下使用的组件
 * 通过如下操作可以使其内部元素的盒模型都修改为 content-box
 */
.my-component {
  box-sizing: content-box;
}
```

## “老”办法

最早的重置盒模型的方法就像这样：

```css
* {
  box-sizing: border-box;
}
```

这种方法遗漏了伪元素，可能会导致一些意想不到的结果。于是，另一个涵盖伪元素的修改方案很快出现了：

## 通用方法

```css
*,
*:before,
*:after {
  box-sizing: border-box;
}
```

这种方法包含了伪元素，加强了重置盒模型的效果。但是，`*`选择器使开发人员很难在其他地方使用 content-box。于是，新的最佳实践就出现了：

## 最佳实践（目前）

```css
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
```

这种重置方法为您提供了比它的前辈们更多的灵活性——您可以随意使用 content-box，而不必担心通用选择器会覆盖您的 CSS。

进一步解释一下，假设您有一个组件，它被设计为只使用默认的 content-box 盒模型，那么您可以重置它的盒模型：

```css
.my-component {
  /* 被设计为在默认盒模型下使用，你可以将它重置为 content-box */
  box-sizing: content-box;
}
```

<!-- prettier-ignore-start -->
```html
<div> <!-- border-box -->
  <header></header> <!-- border-box -->
</div>
<div class="my-component"> <!-- content-box -->
  <header></header> <!-- content-box -->
</div>
```
<!-- prettier-ignore-end -->

对于这个方法潜在的抱怨点是 box-sizing 通常是不继承的，所以它是一种特殊的行为，和你通常重置的东西不太一样。
