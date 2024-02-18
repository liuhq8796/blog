import{_ as a,o as e,c as r,a4 as t}from"./chunks/framework.uq-NsJpj.js";const g=JSON.parse('{"title":"设计原则——04.控制反转、依赖注入、依赖反转","description":"","frontmatter":{},"headers":[],"relativePath":"articles/programming/programming-principles-04.md","filePath":"articles/programming/programming-principles-04.md","lastUpdated":1708246838000}'),i={name:"articles/programming/programming-principles-04.md"},o=t('<h1 id="设计原则——04-控制反转、依赖注入、依赖反转" tabindex="-1">设计原则——04.控制反转、依赖注入、依赖反转 <a class="header-anchor" href="#设计原则——04-控制反转、依赖注入、依赖反转" aria-label="Permalink to &quot;设计原则——04.控制反转、依赖注入、依赖反转&quot;">​</a></h1><h2 id="控制反转" tabindex="-1">控制反转 <a class="header-anchor" href="#控制反转" aria-label="Permalink to &quot;控制反转&quot;">​</a></h2><p>实际上，控制反转是一个比较笼统的设计思想，并不是一种具体的实现方法，一般用来指导框架层面的设计。这里所说的“控制”指的是对程序执行流程的控制，而“反转”指的是在没有使用框架之前，程序员自己控制整个程序的执行。在使用框架之后，整个程序的执行流程通过框架来控制。流程的控制权从程序员“反转”给了框架。</p><h2 id="依赖注入" tabindex="-1">依赖注入 <a class="header-anchor" href="#依赖注入" aria-label="Permalink to &quot;依赖注入&quot;">​</a></h2><p>依赖注入和控制反转恰恰相反，它是一种具体的编码技巧。我们不通过 new 的方式在类内部创建依赖类的对象，而是将依赖的类对象在外部创建好之后，通过构造函数、函数参数等方式传递（或注入）给类来使用。</p><h2 id="依赖注入框架" tabindex="-1">依赖注入框架 <a class="header-anchor" href="#依赖注入框架" aria-label="Permalink to &quot;依赖注入框架&quot;">​</a></h2><p>我们通过依赖注入框架提供的扩展点，简单配置一下所有需要的类及其类与类之间依赖关系，就可以实现由框架来自动创建对象、管理对象的生命周期、依赖注入等原本需要程序员来做的事情。</p><h2 id="依赖反转原则" tabindex="-1">依赖反转原则 <a class="header-anchor" href="#依赖反转原则" aria-label="Permalink to &quot;依赖反转原则&quot;">​</a></h2><p>依赖反转原则也叫作依赖倒置原则。这条原则跟控制反转有点类似，主要用来指导框架层面的设计。高层模块不依赖低层模块，它们共同依赖同一个抽象。抽象不要依赖具体实现细节，具体实现细节依赖抽象。</p>',9),n=[o];function s(l,c,p,h,d,m){return e(),r("div",null,n)}const u=a(i,[["render",s]]);export{g as __pageData,u as default};
