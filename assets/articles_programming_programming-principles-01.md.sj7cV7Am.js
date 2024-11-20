import{_ as e,c as r,a2 as t,o as i}from"./chunks/framework.GBc956F4.js";const h=JSON.parse('{"title":"设计原则——01.开闭原则","description":"","frontmatter":{},"headers":[],"relativePath":"articles/programming/programming-principles-01.md","filePath":"articles/programming/programming-principles-01.md","lastUpdated":1732121706000}'),o={name:"articles/programming/programming-principles-01.md"};function n(s,a,l,p,c,d){return i(),r("div",null,a[0]||(a[0]=[t('<h1 id="设计原则——01-开闭原则" tabindex="-1">设计原则——01.开闭原则 <a class="header-anchor" href="#设计原则——01-开闭原则" aria-label="Permalink to &quot;设计原则——01.开闭原则&quot;">​</a></h1><h2 id="如何理解-对扩展开放、修改关闭" tabindex="-1">如何理解“对扩展开放、修改关闭”？ <a class="header-anchor" href="#如何理解-对扩展开放、修改关闭" aria-label="Permalink to &quot;如何理解“对扩展开放、修改关闭”？&quot;">​</a></h2><p>开闭原则的英文全称是 Open Closed Principle，简写为 OCP。它的英文描述是：software entities (modules, classes, functions, etc.) should be open for extension , but closed for modification。我们把它翻译成中文就是：软件实体（模块、类、方法等）应该“对扩展开放、对修改关闭”。</p><p>添加一个新的功能，应该是通过在已有代码基础上扩展代码（新增模块、类、方法、属性等），而非修改已有代码（修改模块、类、方法、属性等）的方式来完成。</p><h2 id="修改代码就意味着违背开闭原则吗" tabindex="-1">修改代码就意味着违背开闭原则吗？ <a class="header-anchor" href="#修改代码就意味着违背开闭原则吗" aria-label="Permalink to &quot;修改代码就意味着违背开闭原则吗？&quot;">​</a></h2><p>我们要认识到，添加一个新功能，不可能任何模块、类、方法的代码都不“修改”，这个是做不到的。类需要创建、组装、并且做一些初始化操作，才能构建成可运行的的程序，这部分代码的修改是在所难免的。我们要做的是尽量让修改操作更集中、更少、更上层，尽量让最核心、最复杂的那部分逻辑代码满足开闭原则。</p><h2 id="如何做到-对扩展开放、对修改关闭" tabindex="-1">如何做到“对扩展开放、对修改关闭”？ <a class="header-anchor" href="#如何做到-对扩展开放、对修改关闭" aria-label="Permalink to &quot;如何做到“对扩展开放、对修改关闭”？&quot;">​</a></h2><p>我们要时刻具备扩展意识、抽象意识、封装意识。在写代码的时候，我们要多花点时间思考一下，这段代码未来可能有哪些需求变更，如何设计代码结构，事先留好扩展点，以便在未来需求变更的时候，在不改动代码整体结构、做到最小代码改动的情况下，将新的代码灵活地插入到扩展点上。</p>',8)]))}const f=e(o,[["render",n]]);export{h as __pageData,f as default};
