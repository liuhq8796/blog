import{_ as s,o as i,c as a,a4 as e}from"./chunks/framework.uq-NsJpj.js";const t="/blog/assets/img-error.Gt1m6ZVp.png",E=JSON.parse('{"title":"隐藏 img 为空时的图裂效果","description":"","frontmatter":{},"headers":[],"relativePath":"articles/css/hides-the-crack-effect-when-the-img-is-empty.md","filePath":"articles/css/hides-the-crack-effect-when-the-img-is-empty.md","lastUpdated":1708246838000}'),h={name:"articles/css/hides-the-crack-effect-when-the-img-is-empty.md"},n=e('<h1 id="隐藏-img-为空时的图裂效果" tabindex="-1">隐藏 img 为空时的图裂效果 <a class="header-anchor" href="#隐藏-img-为空时的图裂效果" aria-label="Permalink to &quot;隐藏 img 为空时的图裂效果&quot;">​</a></h1><h2 id="问题" tabindex="-1">问题 <a class="header-anchor" href="#问题" aria-label="Permalink to &quot;问题&quot;">​</a></h2><p>当 img 标签的 src 为空时，网页中会出现图裂的图标，非常的不美观，如下所示：</p><p><img src="'+t+`" alt="图裂"></p><h2 id="解决方案" tabindex="-1">解决方案 <a class="header-anchor" href="#解决方案" aria-label="Permalink to &quot;解决方案&quot;">​</a></h2><p>可以为其添加以下代码，即当 img 元素为空时，设置元素透明度为 0，则此时图裂图标也被隐藏起来了。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">img</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">src</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">img</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">:not</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">src</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  opacity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,7),l=[n];function p(r,c,k,d,o,g){return i(),a("div",null,l)}const _=s(h,[["render",p]]);export{E as __pageData,_ as default};
