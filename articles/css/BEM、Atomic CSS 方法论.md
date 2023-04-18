# BEM、Atomic CSS 方法论

## 常规方式

简单说说我自己用的最多的两种常规方式吧，一种是学习前端一定都听说过的语义化命名，另一种是 Vue 提供的 CSS 作用域。

### 语义化命名

简单概述一下语义化命名就是：基于它*是*什么来命名，而不是基于它*像*什么或*能做*什么来命名。

举一个例子：

```html
<!-- layout -->
<div class="header"></div>
<div class="main"></div>
<div class="sidebar"></div>
<div class="footer"></div>

<!-- component -->
<div class="card">
  <img src="..." class="card-img-top" alt="..." />
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Card's content.</p>
  </div>
</div>
```

像这样的命名，一眼看过去就能知道每个元素它是什么，这就是典型的语义化命名。

这样做的好处显而易见：

- 更好的理解元素的作用，所见即所得

- 更容易查找元素。

  比如在自动化测试中就需要准确的定位元素，这时候这种命名法就会很有用。

但随着项目的发展，这种方法的缺点也越来越明显：

- 命名困难。

  在业务耦合的复杂场景下，很难为你的元素起一个符合语义化要求的类名，这对开发人员来说也是一个不小的心智负担，尤其是当你的词汇量还不是那么充足的情况下。

- 难以复用。

  有一种情况在开发中经常会出现：在不同的组件下写了很多大体类似但细节不同的类，例如：`card-title`、`nav-title`、`dialog-title` 等等，这些类很可能只是其中一条 css 规则不同，例如 `font-size`，但你仍然要为他们定义各自语义不同的类。

- css 文件大小膨胀。

  在无法得到复用的情况下，class 中包含大量重复的 css 属性，这会导致随着项目需求的增加，css 文件也变的越来越大。

因此，为了更好地支持大型项目，更优雅的编写 CSS，我们需要完成在编写 CSS 时维持统一性的工作。

好消息是，我们不必自己编写 CSS 的规则，可以选择接纳一个已经由社群设计、经由诸多项目检验的方法，并从中获益。而且因为这些体系许多都是被广泛使用的，其他的开发者更有可能理解你在使用的方式，会以相同的方式编写他们自己的代码。

## 介绍两种 CSS 方法论

### BEM

#### 什么是 BEM

BEM 即为块级(Block)、元素(Element)、修饰符(Modifier)的缩写，它是一种简单的 CSS 命名方式，它的目的是为了让 CSS 的样式更具可读性、可维护性。

该方法论有以下三部分组成：

- Block：尽量以元素的性质来命名对象，多个单词之间以 `-` 将其分割，例如 `.el-form-item`、`.van-button` 等等。
- Element：使用 `__` 两个下换线来连接 Block 对象，例如 `.el-form-item__label`、`.van-button__content` 等等。
- Modifier：使用 `--` 两个中横杠来连接 Block 或 Element 对象，例如 `.el-form-item--mini`、`.van-button--primary` 等等。

![BEM](./images/BEM%E3%80%81Atomic%20CSS%20%E6%96%B9%E6%B3%95%E8%AE%BA/01.png)

#### BEM 命名法的优势

BEM 的好处是，可以从 HTML 代码中很明显的看到其关联性，获得更多的描述和更加清晰的结构，从其名字可以知道某个标记的含义。

普通命名的示例：

```html
<template>
  <div class="card">
    <div class="header">
      <h3>标题</h3>
    </div>
    <div class="content">
      <button class="button-primary">确认</button>
      <button class="button-loading">取消</button>
    </div>
  </div>
</template>

<style>
  .card {
    // 卡片样式
  }
  .header {
    // 头部样式
  }
  .content {
    // 内容样式
  }
  .button-primary {
    // 按钮基础样式
    // primary 样式
  }
  .button-loading {
    // 按钮基础样式
    // loading 样式
  }
</style>
```

这种写法从 DOM 结构和类命名上也可以了解每个元素的意义，但是无法明确其真实的层级关系。

使用了 BEM 命名法的示例：

```html
<template>
  <div class="card">
    <div class="card__header">
      <h3>标题</h3>
    </div>
    <div class="card__content">
      <button class="button button--primary">确认</button>
      <button class="button button--loading">取消</button>
    </div>
  </div>
</template>

<style>
  .card {
    // 卡片样式
  }
  .card__header {
    // 卡片顶部样式
  }
  .card__content {
    // 卡片内容样式
  }
  .button {
    // 按钮基础样式
  }
  .button--primary {
    // primary 样式
  }
  .button--loading {
    // loading 样式
  }
</style>
```

通过 BEM 命名法，我们可以很清晰的看到每个元素的层级关系，并且 CSS 书写上也不必做过多的层级选择。

同时样式复用和减小体积在这里也有体现：只需要定义好 button 的基础样式，在不同的 Modifier 中就可以只定义那些个存在差异的 css 属性了。

#### 在 CSS 预处理器中使用 BEM

使用 BEM 的一个槽点是，命名方式长而难看。所以一般来说会通过搭配使用 SASS/LESS 等预处理器语言来编写 CSS，利用其语言特性来简化命名。

以 LESS 为例，上一个例子中的样式可以改为：

```less
.card {
  // ...
  &__header {
    // ...
  }
  &__content {
    // ...
  }
}

.button {
  // ...
  &--primary {
    // ...
  }
  &--loading {
    // ...
  }
}
```

#### 使用建议

- 并不是每个地方都应该使用 BEM 命名方式。当需要明确关联性模块的关系时，再使用 BEM 模式。

- 避免层级过深。在深层次嵌套的 DOM 结构下，应避免过长的样式名称定义，并且层级最好不要超过 3 层，类似 `.block__el1__el2` 的格式会增加阅读的难度。

- 如果只是一条公共的独立样式，就没有使用 BEM 模式的必要：

  ```css
  .hidden {
    display: none;
  }
  ```

### Atomic CSS

#### 什么是 Atomic CSS

首先，让我们为 Atomic CSS (原子化 CSS) 给出适当的定义：

John Polacek 在 文章 Let’s Define Exactly What Atomic CSS is 中写道：

> Atomic CSS is the approach to CSS architecture that favors small, single-purpose classes with names based on visual function.

译文：

> 原子化 CSS 是一种 CSS 的架构方式，它倾向于小巧且用途单一的 class，并且会以视觉效果进行命名。

有些人可能会称其为函数式 CSS，或者 CSS 实用工具。本质上，可以将原子化的 CSS 框架理解为这类 CSS 的统称：

```css
.m-0 {
  margin: 0;
}
.text-red {
  color: red;
}
/* ... */
```

市面上有不少实用至上的 CSS 框架，如 Tailwind CSS，Windi CSS。同时有些 UI 库也会附带一些 CSS 工具类作为框架的补充，如 Bootstrap。

CSS 框架满意度和使用率排名：https://2021.stateofcss.com/en-US/technologies/css-frameworks

目前已经在使用 Atomic CSS 的网站有：Facebook、Twitter、StackOverflow、segmentfault 等。

#### Atomic CSS 的优势

引用一个 Tailwind CSS 官网的例子：

<div class="semantic-css">
  <div class="chat-notification">
    <div class="chat-notification-logo-wrapper">
      <img class="chat-notification-logo" src="./images/BEM、Atomic%20CSS%20方法论/02.svg" alt="ChitChat Logo">
    </div>
    <div class="chat-notification-content">
      <h4 class="chat-notification-title">ChitChat</h4>
      <p class="chat-notification-message">You have a new message!</p>
    </div>
  </div>
  <br>
</div>

<style>
  .semantic-css .chat-notification {
    display: flex !important;
    max-width: 24rem !important;
    margin: 0 auto !important;
    padding: 1.5rem !important;
    border-radius: 0.5rem !important;
    background-color: #fff !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  }
  .semantic-css .chat-notification-logo-wrapper {
    flex-shrink: 0 !important;
  }
  .semantic-css .chat-notification-logo {
    height: 3rem !important;
    width: 3rem !important;
  }
  .semantic-css .chat-notification-content {
    margin-left: 1.5rem !important;
    padding-top: 0.25rem !important;
  }
  .semantic-css .chat-notification-title {
    margin: 0 !important;
    color: #1a202c !important;
    font-size: 1.25rem !important;
    line-height: 1.25 !important;
  }
  .semantic-css .chat-notification-message {
    color: #718096 !important;
    font-size: 1rem !important;
    line-height: 1.5 !important;
  }
</style>

用语义化的类名实现一个上面的卡片需要这样写：

```html
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo" />
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message!</p>
  </div>
</div>

<style>
  .chat-notification {
    display: flex;
    max-width: 24rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .chat-notification-logo-wrapper {
    flex-shrink: 0;
  }
  .chat-notification-logo {
    height: 3rem;
    width: 3rem;
  }
  .chat-notification-content {
    margin-left: 1.5rem;
    padding-top: 0.25rem;
  }
  .chat-notification-title {
    color: #1a202c;
    font-size: 1.25rem;
    line-height: 1.25;
  }
  .chat-notification-message {
    color: #718096;
    font-size: 1rem;
    line-height: 1.5;
  }
</style>
```

而使用原子化 CSS 框架 Tailwind CSS 的话就可以改造成下面这样：

```html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo" />
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-slate-500">You have a new message!</p>
  </div>
</div>
```

一个很明显的变化是——CSS 样式定义不见了！准确来说并不是不见了，而是框架将他们作为全局样式替你定义好了。

在上面的示例中，我们使用了：

- 使用了 **flexbox** 和 **padding** 功能类(`flex`, `flex-shrink-0`, 和 `p-6`)来控制整体的卡片布局
- 使用 **max-width** 和 **margin** 功能类(`max-w-sm`, `mx-auto`)来设置卡片的宽度和水平居中
- 使用 **background color**，**border radius**，和 **box-shadow** 功能类(`bg-white`, `rounded-xl`, 和 `shadow-lg`)设置卡片的外观样式
- 使用 **space-between** 功能类(`space-x-4`)来处理 logo 和文本之间的间距
- 使用 **width** 和 **height** 功能类(`w-12`, `h-12`)来设置 logo 图片的大小
- 使用 **font size**, **text color**, 和 **font-weight** 功能类(`text-xl`, `text-black`, `font-medium` 等等)给卡片文字设置样式

像这样将 css 属性拆分成小巧单一的 class，不仅解决了命名麻烦的问题，同时还解决了难以复用和 css 文件大小膨胀的问题。

即使是另一个完全不同的组件，作为全局样式这些 class 依然是可以复用的。而因为你用的一直是同一份全局 css，你就不会再有或很少有新的独立样式生成，长此以往就能够大大减小项目里 css 文件的大小。

当然，即使是不使用类似的框架，我们按自己的规则定义一套通用的样式的话，这些优势也依然存在。

#### 目前存在的不足

Atomic CSS 也不是不存在缺点，作为一个正在发展方法论还是存在一些不足：

- 命名麻烦，你需要为所有用到的 CSS 属性定义好类名。

  但好在现在已经出现了很多 Atomic CSS 框架代替我们做了这部分工作，即使是不适合中途增加新框架的项目，只参考他们的类名写法也可以减少很大的工作量。

- HTML 变的十分丑陋。

  作为一个开发者，我想谁也不会愿意在自己的代码里到处复制和维护这样的一个 button：

  ```html
  <button
    class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
  >
    Click me
  </button>
  ```

  所以在事情发展的更加不可收拾之前，将他们提取成组件是个好主意。

- 学习成本。

  虽然作为例子的 Tailwind CSS 在类名定义的直觉性上已经做的很好了，基本上能做到见名知意，但当你想用某个 css 属性的时候，仍然不可避免的需要去查阅文档进行确认。

- 精确控制受到框架的限制。

  虽然大部分样式都由框架代劳了，但是一些极其定制化的要求，比如精确的颜色控制、元素大小、背景图片等，框架还需要需要额外且复杂的配置。

## 关于如何选择两种方法论的个人看法

如果是对于已有项目的改进，我个人更倾向于主体采用 BEM 模式，添加常用的功能类辅助布局。

- 以 BEM 的思想作为命名规范，虽然复用性明显弱于 Atomic CSS，但是可以获得更多的描述信息和更加清晰的结构，可读性更高。同时也能避免当需要父组件控制子孙组件的样式时，找不到一个准确的类名来定位。

- 不建议引入 Atomic CSS 框架的原因在于，引入新框架就会引入新问题，无论是学习成本还是和当前所使用的框架的兼容性都有待考量，不适合在已上线的大型项目中添加。

- 虽然整体使用 Atomic CSS 的学习成本很高，但只是添加常用的功能类(例如 `flex`、`items-center`、`w-full` 等等)来辅助布局应该还是可以接收的，并且他们确实能够为复用性带来极大的提升。

如果是小型的或者是自己的项目，那么我强烈建议试一试 Atomic CSS，用过一次就会觉得用得很爽，不用再去考虑起什么类名，不用再自己去定义样式，你的代码里甚至都不会出现一行 CSS。这种体验是十分新奇的，有机会一定要试一试。
