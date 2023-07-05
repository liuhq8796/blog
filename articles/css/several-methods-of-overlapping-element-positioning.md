# 元素重叠定位的几种方法

## 前言

在网页中，常常会出现元素重叠的情况，例如下面这张图片，它的下面有一段表示这张图片内容的描述，这种定位方式在网页中经常会用到，比如轮播图、弹窗等等。

<figure :class="$style.figure">
    <img :class="$style.img" src="./images/several-methods-of-overlapping-element-positioning/ryan-hutton-Jztmx9yqjBw-unsplash.jpg">
    <figcaption :class="$style.figcaption">Trees against purple night sky</figcaption>
</figure>

本文将介绍几种常用的元素重叠定位的方法。

## 绝对定位

首先第一种方法——绝对定位，非常常用的方法，不展开介绍了。

```html
<figure>
  <img src="./night-sky.jpg" />
  <figcaption>Trees against purple night sky</figcaption>
</figure>
```

```css
figure {
  position: relative;
  display: inline-block;
}
figcaption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #0009;
  color: white;
  text-align: center;
  line-height: 2;
}
```

## margin 负值

第二种方法是使用负值的 margin，也比较简单，不展开。

```html
<figure>
  <img src="./night-sky.jpg" />
  <figcaption>Trees against purple night sky</figcaption>
</figure>
```

```css
figure {
  display: inline-block;
}
figcaption {
  background-color: #0009;
  color: white;
  text-align: center;
  line-height: 2;
  margin-top: -2rem;
  /* 背景层叠顺序较低 */
  position: relative;
}
```

## Grid 布局

重点讲一下第三种方法——使用 Grid 布局，这种是比较推荐的方法。

我们给容器设置为 display: inline-grid 或者 grid，然后 grid 子项的网格区域设置为同一个区域，它们就会自然而然的重叠在一起了。

```html
<figure>
  <img src="./night-sky.jpg" />
  <figcaption>Trees against purple night sky</figcaption>
</figure>
```

```css
figure {
  display: inline-grid;
}
figure > img,
figure > figcaption {
  /* 还可以简写为 grid-area: 1 / 2 */
  grid-area: 1 / 1 / 2 / 2;
}
figcaption {
  align-self: end;
  text-align: center;
  background-color: #0009;
  color: white;
  line-height: 2;
}
```

### 原理

grid 子项都占用同一个网格就会重叠

### 优点

- 控制方便

  比如说我希望黑色蒙层覆盖整个图片，我们设置为 align-self: stretch，就可以了。

  ```css
  figcaption {
    align-self: stretch;
  }
  ```

    <figure :class="$style.figure1">
        <img :class="$style.img1" src="./images/several-methods-of-overlapping-element-positioning/ryan-hutton-Jztmx9yqjBw-unsplash.jpg">
        <figcaption :class="$style.figcaption1">Trees against purple night sky</figcaption>
    </figure>

- 层叠上下文关系和包含块关系没有变化

  第二个优点是相比于之前的绝对定位，其容器元素的层叠上下文关系和包含块关系是没有任何变化的，在某些场景下这个就特别的适用。

## container 方法

第四种方法叫 container 方法，这个估计没几个人知道。

它的结构是这样的：

```html
<figure>
  <span><img src="./night-sky.jpg" /></span>
  <figcaption>Trees against purple night sky</figcaption>
</figure>
```

```css
figure {
  display: inline-flex;
}
figure > span {
  container-type: inline-size;
}
figcaption {
  width: 256px;
  align-self: end;
  text-align: center;
  background-color: #0009;
  color: white;
  line-height: 2;
  z-index: 1;
}
```

我们把图片通过一个 span 元素包起来，然后设置它的 container-type 为 inline-size，这个时候，它就能自然重叠了。

### 原理

所有具有尺寸收缩特性的元素，设置为容器元素后，其宽度尺寸都会变为 0。

例如任意 display 是 inline-\* 的元素，浮动元素，绝对定位元素，flex 子项，或 width: fit-content 元素等。

凡是满足这样条件的元素，设置 container-type 为 inline-size 后，那宽度都是 0。我们利用了这个特性，实现了重叠效果。

## 总结

最后总结一下各个方法的适用场景：

通常没有意外的话我们就使用这个绝对定位方法，兼容性更好。

margin 负值它适用于不能绝对定位，但同时尺寸已知的场景。

如果既不能使用绝对定位，尺寸又不是固定的，我们可以使用 Grid 布局，同时还有一种场景就是如果你的项目不需要考虑到兼容性的场景，然后又想展示自己在 CSS 这块的功力，就是所谓的“装逼”给同事、领导看，我们也可以使用 Grid 布局。

container 容器元素因为兼容性还不是特别的好，目前只适合用在学习场景中。

<style module>
.figure {
    position: relative;
    display: inline-block;
}
.figcaption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #0009;
    color: white;
    text-align: center;
    line-height: 2;
}

.figure {
    display: inline-block;
}
.figcaption {
    background-color: #0009;
    color: white;
    text-align: center;
    line-height: 2;
    margin-top: -2rem;
    /* 背景层叠顺序较低 */
    position: relative;
}

.figure {
    display: inline-grid;
}
.figure > .img,
.figure > .figcaption {
    /* 还可以简写为 grid-area: 1 / 2 */
    grid-area: 1 / 1 / 2 / 2;
}
.figcaption {
    align-self: end;
    text-align: center;
    background-color: #0009;
    color: white;
    line-height: 2;
}

.figure1 {
    display: inline-grid;
}
.figure1 > .img1,
.figure1 > .figcaption1 {
    /* 还可以简写为 grid-area: 1 / 2 */
    grid-area: 1 / 1 / 2 / 2;
}
.figcaption1 {
    align-self: stretch;
    text-align: center;
    background-color: #0009;
    color: white;
    line-height: 2;
}
</style>
