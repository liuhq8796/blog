# 介绍两种 CSS 方法论 (BEM、Atomic CSS)

## 大纲

- 现状
- 介绍两种 CSS 方法论
  - BEM —— 最流行
    - 什么是 BEM
    - BEM 命名法的优势
    - 在 CSS 预处理器中使用 BEM
    - 使用建议
  - Atomic CSS —— 最有潜力
    - 什么是 Atomic CSS
    - Atomic CSS 的优势
    - 目前存在的不足
- 我们能如何改进

## 现状

单纯的使用 Vue 单文件组件提供的 CSS 作用域能力来实现样式隔离。

当 `style` 标签带有 `scoped` 属性的时候，它的 CSS 只会应用到当前组件的元素上。它的实现方式是通过 PostCSS 将以下内容：

```html
<style scoped>
  .example {
    color: red;
  }
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换为：

```html
<style>
  .example[data-v-7a7a37b1] {
    color: red;
  }
</style>

<template>
  <div class="example" data-v-7a7a37b1>hi</div>
</template>
```

`scoped` 方式的优点是简单、易用、很灵活，拥有很低的学习成本，可以随意地更改样式，而不会影响到其他组件。

但这种方法也存在很多不足，比如：

- 你的样式不会污染别人，但别人可能会污染你。

  假如你的组件加了 `scoped` 并且定义了一个 `.footer` 类，外部也有人定义了 `.footer` 类但没加 `scoped`，那么他的这个样式就会作为全局样式污染你的组件。

- 如果想影响子组件的 CSS，需要额外添加 deep 语法进行穿透。

  当你的页面极为复杂、嵌套极深的时候，想要修改子孙组件的样式总是要添加 `deep` 语法，同时还可能面临优先级不够，要多加好几层类名才能生效的问题。

- 样式冗余，浪费性能。

  如果你的项目中有很多组件，每个组件都需要一份独立的样式，那么即使是同样的样式最终也会生成两套 CSS，你的项目就会变得很大。并且随着项目体积的增长，样式的数量也会增加。

- 过于依赖，导致开发者养成非常不好的命名习惯。

  过渡依赖 `scoped` 属性的话，大家都用那么些个常用的单词做类名，如果哪天脱离了 Vue，没有 `scoped` 了，沿用这种习惯写出来的样式就会直接打起来。

总的来说，`scoped` 方式更适合一些小型项目，但在制作大型项目的时候，这种方式就显得不够优雅了。因此，为了更好地支持大型项目，更优雅的编写 CSS，我们需要完成在编写 CSS 维持统一性的工作。

好消息是，我们不必自己编写 CSS 的规则，可以选择接纳一个已经由社群设计、经由诸多项目检验的方法，并从中获益。而且因为这些体系许多都是被广泛使用的，其他的开发者更有可能理解你在使用的方式，会以相同的方式编写他们自己的代码。

## 介绍两种 CSS 方法论

### BEM

#### 什么是 BEM

BEM 即为块级(Block)、元素(Element)、修饰符(Modifier)的缩写，它是一种简单的 CSS 命名方式，它的目的是为了让 CSS 的样式更具可读性、可维护性。该方法论有以下三部分组成：

- Block：尽量以元素的性质来命名对象，多个单词之间以 `-` 将其分割，例如 `.el-form-item`、`.van-button` 等等。
- Element：使用 `__` 两个下换线来连接 Block 对象，例如 `.el-form-item__label`、`.van-button__content` 等等。
- Modifier：使用 `--` 两个中横杠来连接 Block 或 Element 对象，例如 `.el-form-item--mini`、`.van-button--primary` 等等。

![BEM](<../imgs/%E4%BB%8B%E7%BB%8D%E4%B8%A4%E7%A7%8D%20CSS%20%E6%96%B9%E6%B3%95%E8%AE%BA%20(BEM%E3%80%81Atomic%20CSS).png>)

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
      <button class="button-primary"></button>
      <button class="button-default loading"></button>
    </div>
  </div>
</template>

<style>
  .card {
    // ...
  }
  .header {
    // ...
  }
  .content {
    // ...
  }
  .button-primary {
    // ...
  }
  .button-default {
    // ...
  }
  .loading {
    // ...
  }
</style>
```

这种写法从 DOM 结构和类命名上也可以了解每个元素的意义，但是无法明确其真实的层级关系。在定义 css 时，也必需依靠层级选择器来限定约束作用域，以避免样式污染。

使用了 BEM 命名法的示例：

```html
<template>
  <div class="card">
    <div class="card__header">
      <h3>标题</h3>
    </div>
    <div class="card__content">
      <button class="card__button--primary"></button>
      <button class="card__button--default"></button>
    </div>
  </div>
</template>

<style>
  .card {
    // ...
  }
  .card__header {
    // ...
  }
  .card__content {
    // ...
  }
  .card__button {
    // ...
  }
  .card__button--primary {
    // ...
  }
  .card__button--default {
    // ...
  }
  .card__button--loading {
    // ...
  }
</style>
```

通过 BEM 命名法，我们可以很清晰的看到每个元素的层级关系，并且 CSS 书写上也不必做过多的层级选择。严格按照 BEM 模式命名的话，甚至不需要 `scoped` 就能避免样式冲突。样式复用和减小体积也体现在了类的定义上，只需要定义好 Block 或 Element，在 Modifier 的定义中就可以只书写那些个存在部分差异的 css 属性了。

#### 在 CSS 预处理器中使用 BEM

使用 BEM 的一个槽点是，命名方式长而难看。所以一般来说会通过搭配使用 SASS/LESS 等预处理器语言来编写 CSS，利用其语言特性来简化命名。

以 LESS 为例，上一个例子中的样式可以改为：

```less
.card {
  .&__header {
    // ...
  }
  .&__content {
    // ...
  }
  .&__button {
    // ...
    &--primary {
      // ...
    }
    &--default {
      // ...
    }
    &--loading {
      // ...
    }
  }
}
```

#### 使用建议

- 并不是每个地方都应该使用 BEM 命名方式。当需要明确关联性模块的关系时，再使用 BEM 模式。

- 避免层级过深。在深层次嵌套的 DOM 结构下，应避免过长的样式名称定义，并且层级最好不要超过 3 层，类似 `.block_el1_el2` 的格式会增加阅读的难度。

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

#### Atomic CSS 的优势

在谈 Atomic CSS 的优势之前，先来看看相对的 Semantic CSS (语义化 CSS) 通常会遇到的问题：

- 命名困难。越来越多的相似场景下，很难为你的元素起一个符合语义化要求的类名，这对开发人员来说也是一个不小的心智负担。
- 难以复用。如果你的 CSS 样式采用的是语义化命名，那么在不同的组件下，可能会出现一些大体类似但细节不同的类，例如：`nav-title`、`card-title`、`dialog-title` 等等，这些类很可能只是其中一条 css 规则不同，例如 `font-size`。
- css 文件大小膨胀。每个 class 都包含大量重复的 css 样式，无法解决复用性。这会导致随着项目需求的增加，css 文件变的越来越大。

那么，Atomic CSS 是如何解决这些问题的呢？引用一个 Tailwind CSS 官网的例子：

<div class="semantic-css">
  <div class="chat-notification">
    <div class="chat-notification-logo-wrapper">
      <img class="chat-notification-logo" src="../imgs/介绍两种 CSS 方法论 (BEM、Atomic CSS)(1).svg" alt="ChitChat Logo">
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
    <img
      class="chat-notification-logo"
      src="/img/logo.svg"
      alt="ChitChat Logo"
    />
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

而使用原子化 CSS 框架 tailwindcss 的话就可以改造成下面这样：

```html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-mg flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-slate-500">You have a new message!</p>
  </div>
</div>
```

一个很明显的变化是——CSS 样式定义不见了！

准确来说并不是不见了，而是框架将他们作为全局样式替你定义好了，不需要我们再在组件里定义了，也就不需要你绞尽脑汁的想一个符合语境的类名，只要写你需要的样式就可以了。

在上面的示例中，我们使用了：

- 使用了 **flexbox** 和 **padding** 功能类(`flex`, `flex-shrink-0`, 和 `p-6`)来控制整体的卡片布局
- 使用 **max-width** 和 **margin** 功能类(`max-w-sm`, `mx-auto`)来设置卡片的宽度和水平居中
- 使用 **background color**，**border radius**，和 **box-shadow** 功能类(`bg-white`, `rounded-xl`, 和 `shadow-md`)设置卡片的外观样式
- 使用 width 和 height 功能类(`w-12`, `h-12`)来设置 logo 图片的大小
- 使用 space-between 功能类(`space-x-4`)来处理 logo 和文本之间的间距
- 使用 font size, text color, 和 font-weight 功能类(`text-xl`, `text-black`, `font-medium` 等等)给卡片文字设置样式

除了解决了命名麻烦的问题，同时还解决了另外两个问题：难以复用和css文件大小膨胀。当你完成了这个卡片进入到下一个组件的开发中时，即使是另一个完全不同的组件，这些样式作为全局样式依然是可以复用的。而因为解决了样式复用的问题，你就不会再有或很少有新的独立样式生成，长此以往就能够大大减小项目里css文件的大小。

当然，即使是不使用类似的框架，我们按自己的规则定义一套通用的样式的话，这些优势也依然存在。

#### 目前存在的不足

除了对比传统方式的优势，Atomic CSS 作为一个正在发展方法论还是存在一些不足：

- HTML 变的十分丑陋。作为一个开发者，我想谁也不会愿意在自己的代码里到处复制和维护这样的一串代码：

  ```html
  <button class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
  Click me
  </button>
  ```

  所以在事情发展的更加不可收拾之前，将他们提取成组件是个好主意。

  封装组件的时候需要注意，记得提供让使用者添加自定义类名的入口，以便使用者可以覆盖组件的默认样式，毕竟这类组件并没有能让你准确定位到它的类名。

- 学习成本。虽然作为例子的 Tailwind CSS 在类名定义的直觉性上已经做的很好了，类名基本上能做到见名知意，但当你想用某个 css 属性的时候，仍然不可避免的需要去查阅文档。

  这部分问题框架也在积极解决，Tailwind CSS 和 Windi CSS 就已经发布了 vscode 智能提示插件来辅助你找到正确的类名。

- 精确控制受到框架的限制。虽然大部分样式都由框架代劳了，但是一些极其定制化的要求，比如精确的颜色控制、元素大小、背景图片等，框架还不能做到或者需要额外的配置。如果你期望更加新颖的 css 能力，那么你可能需要等框架更新或者自己手动实现。
