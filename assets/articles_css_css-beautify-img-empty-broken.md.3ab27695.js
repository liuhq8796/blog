import{_ as s,c as a,o as e,O as n}from"./chunks/framework.b9480850.js";const o="/blog/assets/img-error.6e5724ee.png",F=JSON.parse('{"title":"美化 img 为空时的图裂效果","description":"","frontmatter":{},"headers":[],"relativePath":"articles/css/css-beautify-img-empty-broken.md","filePath":"articles/css/css-beautify-img-empty-broken.md","lastUpdated":1683534090000}'),t={name:"articles/css/css-beautify-img-empty-broken.md"},l=n('<h1 id="美化-img-为空时的图裂效果" tabindex="-1">美化 img 为空时的图裂效果 <a class="header-anchor" href="#美化-img-为空时的图裂效果" aria-label="Permalink to &quot;美化 img 为空时的图裂效果&quot;">​</a></h1><h2 id="问题" tabindex="-1">问题 <a class="header-anchor" href="#问题" aria-label="Permalink to &quot;问题&quot;">​</a></h2><p>当 img 标签的 src 为空时，网页中会出现图裂的图标，非常的不美观，如下所示：</p><p><img src="'+o+`" alt="图裂"></p><h2 id="解决方案" tabindex="-1">解决方案 <a class="header-anchor" href="#解决方案" aria-label="Permalink to &quot;解决方案&quot;">​</a></h2><p>可以为其添加以下代码，即当 img 元素为空时，设置元素透明度为 0，则此时图裂图标也被隐藏起来了。</p><div class="language-css"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">img</span><span style="color:#89DDFF;">[</span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&#39;&#39;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#FFCB6B;">img</span><span style="color:#89DDFF;">:</span><span style="color:#C792EA;">not</span><span style="color:#89DDFF;">([</span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">])</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#B2CCD6;">opacity</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div>`,7),p=[l];function c(r,i,m,y,d,_){return e(),a("div",null,p)}const h=s(t,[["render",c]]);export{F as __pageData,h as default};
