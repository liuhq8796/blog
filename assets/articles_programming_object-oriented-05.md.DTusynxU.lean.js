import{_ as e,c as t,a2 as r,o}from"./chunks/framework.GBc956F4.js";const m=JSON.parse('{"title":"面向对象——05.多用组合少用继承","description":"","frontmatter":{},"headers":[],"relativePath":"articles/programming/object-oriented-05.md","filePath":"articles/programming/object-oriented-05.md","lastUpdated":1732121706000}'),i={name:"articles/programming/object-oriented-05.md"};function n(s,a,d,l,c,h){return o(),t("div",null,a[0]||(a[0]=[r('<h1 id="面向对象——05-多用组合少用继承" tabindex="-1">面向对象——05.多用组合少用继承 <a class="header-anchor" href="#面向对象——05-多用组合少用继承" aria-label="Permalink to &quot;面向对象——05.多用组合少用继承&quot;">​</a></h1><h2 id="为什么不推荐使用继承" tabindex="-1">为什么不推荐使用继承？ <a class="header-anchor" href="#为什么不推荐使用继承" aria-label="Permalink to &quot;为什么不推荐使用继承？&quot;">​</a></h2><p>继承是面向对象的四大特性之一，用来表示类之间的 is-a 关系，可以解决代码复用的问题。虽然继承有诸多作用，但继承层次过深、过复杂，也会影响到代码的可维护性。在这种情况下，我们应该尽量少用，甚至不用继承。</p><h2 id="组合相比继承有哪些优势" tabindex="-1">组合相比继承有哪些优势？ <a class="header-anchor" href="#组合相比继承有哪些优势" aria-label="Permalink to &quot;组合相比继承有哪些优势？&quot;">​</a></h2><p>继承主要有三个作用：表示 is-a 关系，支持多态特性，代码复用。而这三个作用都可以通过组合、接口、委托三个技术手段来达成。除此之外，利用组合还能解决层次过深、过复杂的继承关系影响代码可维护性的问题。</p><h2 id="如何判断改用组合还是继承" tabindex="-1">如何判断改用组合还是继承？ <a class="header-anchor" href="#如何判断改用组合还是继承" aria-label="Permalink to &quot;如何判断改用组合还是继承？&quot;">​</a></h2><p>尽管我们鼓励多用组合少用继承，但组合也并不是完美的，继承也并非一无是处。在实际的项目开发中，我们还是要根据具体的情况，来选择该用继承还是组合。如果类之间的继承结构稳定，层次比较浅，关系不复杂，我们就可以大胆地使用继承。反之，我们就尽量使用组合来替代继承。除此之外，还有一些设计模式、特殊的应用场景，会固定使用继承或者组合。</p>',7)]))}const u=e(i,[["render",n]]);export{m as __pageData,u as default};
