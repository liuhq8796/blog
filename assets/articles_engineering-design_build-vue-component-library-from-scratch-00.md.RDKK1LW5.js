import{_ as s,o as i,c as a,U as t}from"./chunks/framework.2ESA56TH.js";const F=JSON.parse('{"title":"从零搭建Vue组件库——00.系列大纲","description":"","frontmatter":{},"headers":[],"relativePath":"articles/engineering-design/build-vue-component-library-from-scratch-00.md","filePath":"articles/engineering-design/build-vue-component-library-from-scratch-00.md","lastUpdated":1704714173000}'),n={name:"articles/engineering-design/build-vue-component-library-from-scratch-00.md"},l=t(`<h1 id="从零搭建vue组件库——00-系列大纲" tabindex="-1">从零搭建Vue组件库——00.系列大纲 <a class="header-anchor" href="#从零搭建vue组件库——00-系列大纲" aria-label="Permalink to &quot;从零搭建Vue组件库——00.系列大纲&quot;">​</a></h1><blockquote><p>本文参考了稀土掘金上蘑菇王的系列文章——<a href="https://juejin.cn/post/7254341178258505788" target="_blank" rel="noreferrer">《从 0 到 1 搭建 Vue 组件库框架》</a>，并通过 Github Copilot 的辅助编写功能进行了修改和补充。</p></blockquote><h2 id="系列内容导航" tabindex="-1">系列内容导航 <a class="header-anchor" href="#系列内容导航" aria-label="Permalink to &quot;系列内容导航&quot;">​</a></h2><p>本系列文章将会从零开始搭建一个 Vue 组件库，主要包括以下内容：</p><ul><li>[x] <a href="/blog/articles/engineering-design/build-vue-component-library-from-scratch-01.html">01.搭建 Monorepo 项目结构</a></li><li>[x] <a href="/blog/articles/engineering-design/build-vue-component-library-from-scratch-02-part-1.html">02.使用 Vite 搭建开发环境</a></li><li>[ ] 03.集成 Lint 代码检查</li><li>[ ] 04.Monorepo 下的模块打包</li><li>[ ] 05.组件库的样式方案设计</li><li>[ ] 06.建立可直接复用组件的文档网站</li><li>[ ] 07.接入单元测试与 E2E 测试</li><li>[ ] 08.版本管理和发布机制</li><li>[ ] 09.持续集成与持续部署</li></ul><h2 id="为什么要从零搭建组件库" tabindex="-1">为什么要从零搭建组件库 <a class="header-anchor" href="#为什么要从零搭建组件库" aria-label="Permalink to &quot;为什么要从零搭建组件库&quot;">​</a></h2><p>在日常开发中，我们可能会使用一些成熟的组件库，如 <a href="https://element-plus.org/#/zh-CN" target="_blank" rel="noreferrer">Element Plus</a>、<a href="https://2x.antdv.com/docs/vue/introduce-cn/" target="_blank" rel="noreferrer">Ant Design Vue</a> 等。这些组件库都是经过多个项目验证过的，可以直接拿来使用，非常方便。</p><p>那么既然有这么多成熟的组件库，为什么还要从零搭建组件库呢？</p><ul><li><strong>学习组件库的设计思想</strong>：组件库的设计思想是非常值得学习的，它们是如何设计组件的，如何设计组件的 API，如何设计组件的样式方案，如何设计组件的文档网站等等，这些都是非常值得我们学习的。</li><li><strong>提升自己的能力</strong>：从零搭建组件库，可以让我们学习到很多知识，如组件库的设计思想、Monorepo 的项目结构、组件库的打包、组件库的样式方案、组件库的文档网站、单元测试、E2E 测试、版本管理和发布机制、持续集成和持续部署等等，这些都是非常有用的知识，可以提升我们的能力。</li><li><strong>提升自己的影响力</strong>：从零搭建组件库，可以让我们在团队中提升自己的影响力，可以让我们更好地推动项目的发展。</li></ul><h2 id="技术选型" tabindex="-1">技术选型 <a class="header-anchor" href="#技术选型" aria-label="Permalink to &quot;技术选型&quot;">​</a></h2><p>本系列文章将使用以下技术：</p><ul><li><a href="https://pnpm.io/" target="_blank" rel="noreferrer">pnpm</a>：Monorepo 项目管理工具</li><li><a href="https://v3.cn.vuejs.org/" target="_blank" rel="noreferrer">Vue 3</a>：组件库基于 Vue 3 开发</li><li><a href="https://vitejs.dev/" target="_blank" rel="noreferrer">Vite</a>：开发环境搭建</li><li><a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">TypeScript</a>：提供类型支持</li><li><a href="https://vitepress.vuejs.org/" target="_blank" rel="noreferrer">VitePress</a>：文档网站搭建</li><li><a href="https://vitejs.dev/guide/api-test.html#vite-test" target="_blank" rel="noreferrer">Vitest</a>：处理单元测试</li><li><a href="https://playwright.dev/" target="_blank" rel="noreferrer">Playwright</a>：处理 E2E 测试</li><li><a href="https://eslint.org/" target="_blank" rel="noreferrer">ESLint</a>: 代码检查</li><li><a href="https://stylelint.io/" target="_blank" rel="noreferrer">Stylelint</a>: 样式检查</li><li><a href="https://prettier.io/" target="_blank" rel="noreferrer">Prettier</a>: 代码格式化</li><li><a href="https://commitlint.js.org/#/" target="_blank" rel="noreferrer">Commitlint</a>: 提交信息检查</li><li><a href="https://github.com/changesets/changesets" target="_blank" rel="noreferrer">Changesets</a>: 版本管理</li><li><a href="https://docs.github.com/cn/actions" target="_blank" rel="noreferrer">GitHub Actions</a>: 持续集成和持续部署</li></ul><h2 id="组件库基础设施" tabindex="-1">组件库基础设施 <a class="header-anchor" href="#组件库基础设施" aria-label="Permalink to &quot;组件库基础设施&quot;">​</a></h2><h3 id="目录结构" tabindex="-1">目录结构 <a class="header-anchor" href="#目录结构" aria-label="Permalink to &quot;目录结构&quot;">​</a></h3><p>在造轮子前，学习一下成熟的组件库的目录结构是非常有必要的，这里以 <a href="https://element-plus.org/#/zh-CN" target="_blank" rel="noreferrer">Element Plus</a> 的 packages 目录为例，它的目录结构如下：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">📦element-plus</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂...</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂packages</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂components</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         # 各种 UI 组件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂button</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂input</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂...</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┗</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📜package.json</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂utils</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">              # 公用方法包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┗</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📜package.json</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂theme-chalk</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 组件样式包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┗</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📜package.json</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📂element-plus</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # 组件统一出口</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┃</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ┗</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📜package.json</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ┣</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 📜...</span></span></code></pre></div><p>从目录结构中，我们可以看出，它是一个 Monorepo 项目，这也是目前比较流行的组件库项目结构。Monorepo 项目的好处是可以将多个相关的项目放在一个仓库中，方便管理，也方便开发者在多个项目之间切换(相关阅读：<a href="https://juejin.cn/post/7215886869199896637" target="_blank" rel="noreferrer">带你了解更全面的 Monorepo - 优劣、踩坑、选型</a>)。</p><h3 id="代码规范" tabindex="-1">代码规范 <a class="header-anchor" href="#代码规范" aria-label="Permalink to &quot;代码规范&quot;">​</a></h3><p>在开源多人协作的项目中，代码规范是非常重要的，它可以让代码更加规范，也可以让代码更加易读，从而提高项目的可维护性。在本系列文章中，我们将使用以下工具来规范代码：</p><ul><li><a href="https://eslint.org/" target="_blank" rel="noreferrer">ESLint</a>：检查 JavaScript 代码</li><li><a href="https://stylelint.io/" target="_blank" rel="noreferrer">Stylelint</a>：检查样式代码</li><li><a href="https://prettier.io/" target="_blank" rel="noreferrer">Prettier</a>：格式化代码</li><li><a href="https://commitlint.js.org/#/" target="_blank" rel="noreferrer">Commitlint</a>：检查提交信息</li></ul><p>在后续的系列文章中，将会详细介绍如何配置这些工具。</p><h3 id="打包构建" tabindex="-1">打包构建 <a class="header-anchor" href="#打包构建" aria-label="Permalink to &quot;打包构建&quot;">​</a></h3><p>从<a href="https://element-plus.org/#/zh-CN" target="_blank" rel="noreferrer">Element Plus</a>的 internal/build 目录中可以找到它的打包构建脚本，是基于 <a href="https://rollupjs.org/guide/en/" target="_blank" rel="noreferrer">Rollup</a> API 实现的自定义构建脚本。</p><p>这样做的好处是：一方面可以更好地管理打包流程，另一方面是为了生成可用性尽可能高的产物。可以从 package.json 看出 element-plus 到底构建出了多少不同规格的产物。</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 摘自 element-plus 的 package.json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // cjs 入口</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;main&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;lib/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // esm 标准入口</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;module&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;es/index.mjs&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // d.ts 类型声明入口</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;es/index.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;exports&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/index.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;import&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/index.mjs&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;require&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/index.js&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./es&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/index.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;import&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/index.mjs&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./lib&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/index.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;require&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/index.js&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./es/*.mjs&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/*.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;import&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/*.mjs&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./es/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/*.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/*/index.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;import&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./es/*.mjs&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./lib/*.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/*.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;require&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/*.js&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./lib/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;types&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/*.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/*/index.d.ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;require&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./lib/*.js&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;./*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./*&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 为 &lt;script&gt; 直接引入提供的全量版本，上传到 unpkg 和 jsdelivr cdn。</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;unpkg&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;dist/index.full.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;jsdelivr&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;dist/index.full.js&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>前端的运行环境是复杂的，最大限度地保证产物的可用性并不是一件容易的事情(相关阅读：<a href="https://juejin.cn/post/7052271542000074782" target="_blank" rel="noreferrer">Monorepo 下的模块包设计实践</a>)。</p><h3 id="样式" tabindex="-1">样式 <a class="header-anchor" href="#样式" aria-label="Permalink to &quot;样式&quot;">​</a></h3><p>element-plus 的 packages/theme-chalk 目录，使用 Sass 预处理器构建了一套主题预设方案，使得用户可以个性化地修改组件的主题样式。 我们为自己的组件库制定样式方案时，也会基于以下几个角度思考：</p><ul><li>“换肤能力”称得上是当下组件库的标配，我们的方案能支持主题切换功能吗？</li><li>如何尽可能地减少组件库样式与用户样式的冲突？</li><li>如何让用户方便地修改微调组件样式？</li></ul><h3 id="文档" tabindex="-1">文档 <a class="header-anchor" href="#文档" aria-label="Permalink to &quot;文档&quot;">​</a></h3><p>文档是否友好也是评价一个组件库是否好用的重要标准。element-plus 有全面完善的官方文档，兼具组件效果展示、代码展示、甚至还有对网络环境要求不那么高的在线演示 Playground。 做好组件库的文档并不是一件简单的事情，其中也有很多值得思考的问题：</p><ul><li>用什么工具能够兼顾搭建效率与定制的灵活性？</li><li>组件源码怎样直接复用到文档中？</li><li>能不能尽可能地提高自动化生成内容的比例，避免频繁地手动维护，比如组件 API 说明有没有可能通过源码自动生成？</li><li>如何搭建在线演示 Playground？</li></ul><h3 id="测试" tabindex="-1">测试 <a class="header-anchor" href="#测试" aria-label="Permalink to &quot;测试&quot;">​</a></h3><p>测试完善度是我们是否选用一款组件库的重要指标，element-plus 拥有 84% 的测试覆盖率，足以说明其作为开源软件是相对成熟可靠的。</p><p>完善的单元测试也极大地提高了项目的可靠性，集成到 CI 系统后，在每次合并代码前进行单元测试检查，可以提前识别重构或变更带来的风险。</p><p>除了单元测试之外，我们还会对端到端的 UI 测试进行一些探索，从用户交互的角度补充一些测试用例，让项目的可靠性防护更加扎实。</p><h3 id="发布" tabindex="-1">发布 <a class="header-anchor" href="#发布" aria-label="Permalink to &quot;发布&quot;">​</a></h3><p>我们注意到 element-plus 的版本发布，或者说成熟项目的版本发布都有着一套连贯的流程。</p><ul><li>将新版本构建出的产物发布到 npm 仓库。</li><li>基于发布分支，用版本号给代码仓打 tag。</li><li>CHANGELOG 文件会自动根据 github 相关信息，生成特性更新条目。</li></ul><p>实现这些能力，需要我们了解 npm 组件发布的优秀实践，并集成一款成熟的发布工具。</p><h3 id="持续集成" tabindex="-1">持续集成 <a class="header-anchor" href="#持续集成" aria-label="Permalink to &quot;持续集成&quot;">​</a></h3><p>element-plus 的 .github/workflows 目录下存放了各种各样的 Github Actions 剧本。Github Actions 为绝大多数开源项目提供了便捷的持续集成功能，将原本零散的构建、规范检查、测试、发布等流程以流水线的方式串联起来。</p><p>我们会以下面三个最关键的场景为核心，去实践持续集成：</p><ul><li>代码合并门禁检查。</li><li>自动测试。</li><li>发布 / 部署流水线。</li></ul><h2 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h2><p>本系列涉及到的相关资料汇总如下：</p><p>官网与文档：</p><ul><li><a href="https://v3.cn.vuejs.org/" target="_blank" rel="noreferrer">前端框架 Vue 官网</a></li><li><a href="https://rollupjs.org/guide/zh/" target="_blank" rel="noreferrer">构建工具 Rollup 官方文档</a></li><li><a href="https://cn.vitejs.dev/" target="_blank" rel="noreferrer">构建工具 Vite 官方文档</a></li><li><a href="https://www.typescriptlang.org/zh/" target="_blank" rel="noreferrer">TypeScript 官网</a></li><li><a href="https://www.npmjs.com/" target="_blank" rel="noreferrer">NPM 官网</a></li><li><a href="https://element-plus.org/#/zh-CN" target="_blank" rel="noreferrer">UI 组件库 Element Plus 官网</a></li><li><a href="https://eslint.org/" target="_blank" rel="noreferrer">规范工具 ESLint</a></li><li><a href="https://stylelint.io/" target="_blank" rel="noreferrer">规范工具 Stylelint</a></li><li><a href="https://commitlint.js.org/#/" target="_blank" rel="noreferrer">规范工具 commitlint</a></li><li><a href="https://prettier.io/" target="_blank" rel="noreferrer">代码风格工具 Prettier</a></li><li><a href="https://vitepress.vuejs.org/" target="_blank" rel="noreferrer">单元测试框架 VitePress</a></li><li><a href="https://playwright.dev/" target="_blank" rel="noreferrer">E2E 测试框架 Playwright</a></li><li><a href="https://github.com/changesets/changesets" target="_blank" rel="noreferrer">版本发布工具 Changesets</a></li><li><a href="https://docs.github.com/cn/actions" target="_blank" rel="noreferrer">Github Actions</a></li></ul><p>分享博文：</p><ul><li><a href="https://juejin.cn/post/7215886869199896637" target="_blank" rel="noreferrer">带你了解更全面的 Monorepo - 优劣、踩坑、选型</a></li><li><a href="https://juejin.cn/post/7052271542000074782" target="_blank" rel="noreferrer">Monorepo 下的模块包设计实践</a></li></ul>`,50),e=[l];function h(r,p,k,o,g,d){return i(),a("div",null,e)}const u=s(n,[["render",h]]);export{F as __pageData,u as default};