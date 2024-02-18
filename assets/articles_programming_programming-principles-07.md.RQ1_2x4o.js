import{_ as e,o as a,c as t,a4 as r}from"./chunks/framework.uq-NsJpj.js";const _=JSON.parse('{"title":"设计原则——07.迪米特法则","description":"","frontmatter":{},"headers":[],"relativePath":"articles/programming/programming-principles-07.md","filePath":"articles/programming/programming-principles-07.md","lastUpdated":1708246838000}'),o={name:"articles/programming/programming-principles-07.md"},n=r('<h1 id="设计原则——07-迪米特法则" tabindex="-1">设计原则——07.迪米特法则 <a class="header-anchor" href="#设计原则——07-迪米特法则" aria-label="Permalink to &quot;设计原则——07.迪米特法则&quot;">​</a></h1><h2 id="迪米特法则-理论描述" tabindex="-1">“迪米特法则”理论描述 <a class="header-anchor" href="#迪米特法则-理论描述" aria-label="Permalink to &quot;“迪米特法则”理论描述&quot;">​</a></h2><p>迪米特法则的英文翻译是：Law of Demeter，缩写是 LOD。单从这个名字上来看，我们完全猜不出这个原则讲的是什么。不过，它还有另外一个更加达意的名字，叫作最小知识原则，英文翻译为：The Least Knowledge Principle。</p><p>关于这个设计原则，我们先来看一下它最原汁原味的英文定义：</p><blockquote><p>Each unit should have only limited knowledge about other units: only units “closely” related to the current unit. Or: Each unit should only talk to its friends; Don’t talk to strangers.</p></blockquote><p>我们把它直译成中文，就是下面这个样子：</p><blockquote><p>每个模块（unit）只应该了解那些与它关系密切的模块（units: only units “closely” related to the current unit）的有限知识（knowledge）。或者说，每个模块只和自己的朋友“说话”（talk），不和陌生人“说话”（talk）。</p></blockquote><h2 id="如何理解-迪米特法则" tabindex="-1">如何理解“迪米特法则”？ <a class="header-anchor" href="#如何理解-迪米特法则" aria-label="Permalink to &quot;如何理解“迪米特法则”？&quot;">​</a></h2><p>不该有直接依赖关系的类之间，不要有依赖；有依赖关系的类之间，尽量只依赖必要的接口。迪米特法则是希望减少类之间的耦合，让类越独立越好。每个类都应该少了解系统的其他部分。一旦发生变化，需要了解这一变化的类就会比较少。</p><h2 id="如何理解-高内聚、松耦合" tabindex="-1">如何理解“高内聚、松耦合”？ <a class="header-anchor" href="#如何理解-高内聚、松耦合" aria-label="Permalink to &quot;如何理解“高内聚、松耦合”？&quot;">​</a></h2><p>“高内聚、松耦合”是一个非常重要的设计思想，能够有效提高代码的可读性和可维护性，缩小功能改动导致的代码改动范围。“高内聚”用来指导类本身的设计，“松耦合”用来指导类与类之间依赖关系的设计。</p><p>所谓高内聚，就是指相近的功能应该放到同一个类中，不相近的功能不要放到同一类中。相近的功能往往会被同时修改，放到同一个类中，修改会比较集中。所谓松耦合指的是，在代码中，类与类之间的依赖关系简单清晰。即使两个类有依赖关系，一个类的代码改动也不会或者很少导致依赖类的代码改动。</p>',12),i=[n];function l(s,c,p,d,h,u){return a(),t("div",null,i)}const g=e(o,[["render",l]]);export{_ as __pageData,g as default};
