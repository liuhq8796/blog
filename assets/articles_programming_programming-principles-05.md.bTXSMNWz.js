import{_ as a,o as i,c as e,a4 as r}from"./chunks/framework.uq-NsJpj.js";const _=JSON.parse('{"title":"设计原则——05.KISS 原则与 YAGNI 原则","description":"","frontmatter":{},"headers":[],"relativePath":"articles/programming/programming-principles-05.md","filePath":"articles/programming/programming-principles-05.md","lastUpdated":1708246838000}'),t={name:"articles/programming/programming-principles-05.md"},l=r('<h1 id="设计原则——05-kiss-原则与-yagni-原则" tabindex="-1">设计原则——05.KISS 原则与 YAGNI 原则 <a class="header-anchor" href="#设计原则——05-kiss-原则与-yagni-原则" aria-label="Permalink to &quot;设计原则——05.KISS 原则与 YAGNI 原则&quot;">​</a></h1><h2 id="如何理解-kiss-原则" tabindex="-1">如何理解 KISS 原则 <a class="header-anchor" href="#如何理解-kiss-原则" aria-label="Permalink to &quot;如何理解 KISS 原则&quot;">​</a></h2><p>KISS 原则的英文描述有好几个版本，比如下面这几个。</p><ul><li>Keep It Simple and Stupid.</li><li>Keep It Short and Simple.</li><li>Keep It Simple and Straightforward.</li></ul><p>不过，仔细看你就会发现，它们要表达的意思其实差不多，翻译成中文就是：尽量保持简单。</p><p>KISS 原则是保持代码可读和可维护的重要手段。KISS 原则中的“简单”并不是以代码行数来考量的。代码行数越少并不代表代码越简单，我们还要考虑逻辑复杂度、实现难度、代码的可读性等。而且，本身就复杂的问题，用复杂的方法解决，并不违背 KISS 原则。除此之外，同样的代码，在某个业务场景下满足 KISS 原则，换一个应用场景可能就不满足了。</p><p>对于如何写出满足 KISS 原则的代码，我还总结了下面几条指导原则：</p><ul><li>不要使用同事可能不懂的技术来实现代码；</li><li>不要重复造轮子，要善于使用已经有的工具类库；</li><li>不要过度优化。</li></ul><h2 id="yagni-跟-kiss-说的是一回事吗" tabindex="-1">YAGNI 跟 KISS 说的是一回事吗？ <a class="header-anchor" href="#yagni-跟-kiss-说的是一回事吗" aria-label="Permalink to &quot;YAGNI 跟 KISS 说的是一回事吗？&quot;">​</a></h2><p>YAGNI 原则的英文全称是：You Ain’t Gonna Need It。直译就是：你不会需要它。这条原则也算是万金油了。当用在软件开发中的时候，它的意思是：不要去设计当前用不到的功能；不要去编写当前用不到的代码。实际上，这条原则的核心思想就是：不要做过度设计。</p><p>当然，这并不是说我们就不需要考虑代码的扩展性。我们还是要预留好扩展点，等到需要的时候再做扩展。</p><p>KISS 原则讲的是“如何做”的问题（尽量保持简单），而 YAGNI 原则说的是“要不要做”的问题（当前不需要的就不要做）。</p>',12),n=[l];function p(s,o,S,c,d,m){return i(),e("div",null,n)}const h=a(t,[["render",p]]);export{_ as __pageData,h as default};
