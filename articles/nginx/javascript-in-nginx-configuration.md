# Nginx 配置中的 JavaScript

## 前言

NJS 的目标是成为一个通用的 nginx 脚本框架，正如它的名字是 nginx 和 JavaScript 的混合词，NJS 结合了两者，成为了一个从头编写了 JavaScript 解释器的 nginx 模块。

- nginx 脚本化配置的历史
- NJS 的设计目标
- NJS 解释器
- 在 nginx 中使用 NJS

介绍下本文大纲，第一部分将谈论 nginx 脚本化配置的历史；第二章是关于 NJS 的设计目标是什么，为什么选择了 JavaScript，又为什么自己实现了一套 JS 解释器；下一章简单介绍下 NJS 解释器，这段会比较简略，因为参考的资料专业名词比较多，我看的不是太懂，里面还会包括 NJS 目前可用的功能；最后再展示一下如何在 nginx 中使用 NJS 的示例。

好了，大纲已经介绍完了，那么我们从 nginx 脚本化配置的历史开始。

## NGINX 脚本化配置的历史

想要了解 nginx 脚本化配置的历史，从 nginx 团队对理想中的原生脚本的想法入手显然很有用，所以让我们先来看看这些设想中的特性。

### 理想中的脚本特性

- 够快够轻量
  - 否则可以使用更高级的替代方案，例如 Node.js
- 与 nginx 的异步特性很好地集成
- 模块化
  - 不需要它的人可以禁用它来压榨更多的性能
- 流行的脚本语言
  - 帮助人们更快的编写他们的脚本

第一点也是重要的一点就是要够轻量够快，人类乐于使用 nginx 就是因为它速度快并且十分轻量，如果脚本做不到这一点那就没有在 nginx 中使用它的意义了，完全可以使用其他独立的更高级的代替方案，例如 Node.js

第二点，理想的脚本语法应该能与 nginx 的异步特性很好地集成，由 nginx 而不是其他东西来负责早期进程的主要事件循环。

下一点是关于模块化，它必须能够被禁用，以便不需要它的人可以禁用它来压榨更多的性能

最后，它应该是一种流行的脚本语言，可以帮助人们更快地编写他们的脚本，而不用去学习一门新语言，毕竟平时人们都有其他事情要做

### 关于 Perl

优势

- 可以使用现有的 Perl 库
- Perl 代码可以嵌入到 nginx 配置文件中

劣势

- 不支持非阻塞 IO
- Perl 解释器会退出工作进程

第一次尝试在 nginx 中实现原生脚本是在 2005 年，nginx 有了 perl 模块来支持你写一些复杂的逻辑，那么来了解一下 perl 与刚才提到的理想中的脚本语言有多少一致性

perl 模块第一大优势是可以使用现有的 Perl 库，这对于脚本来说是一个很大的优势。

第二点是 Perl 代码可以直接嵌入到 nginx 的配置文件中，这极大地提高了使用脚本的便利性。

再来看看使用 perl 的负面因素

首先是它不支持非阻塞 IO，这是因为 perl 的解释器不知道它是在 nginx 中工作的，所以它会阻塞操作，显然这点对 nginx 来说是不可接受的，这是使用 perl 模块时的很大的一个问题。

下一点是当 perl 脚本发生错误时会退出整个工作进程，这显然也是不可接受的。

## NJS 的设计目标

**现代化，快速的，针对 NGINX 运行时量身定制的高级脚本**

好，我们完成了 nginx 脚本化配置历史的部分，现在来继续第二部分，NJS 的目标是什么。

NJS 项目的最终目的是设计出一种现代化，快速的，针对 NGINX 运行时量身定制的高级脚本，那么为了达成最终目的，又分了以下几点。

- 快速和轻量

  - njs 不应该过度降低 nginx 的性能
  - 内存/CPU 开销不应很大

- 安全性/健壮性

  - 每个请求都应与其他请求隔离

- 流行的脚本语言

首先第一点，它应该是快速和轻量的，使用 njs 不能拖慢 nginx 本身的速度，所以它也不应该有很大的 CPU 和内存开销，只为了能够在单个工作进程中处理大量的请求，就像 nginx 本身一样。

第二点是关于安全性和健壮性，这个想法意味着每个请求都应该在它自己的与其他请求隔离的上下文中执行，做这件事至少有两个目的，第一个是关于安全性，为了让你的代码与其他人在不同位置编写的代码相隔离。第二点关于健壮性，如果你有一个独立的上下文，那么你可以毫无负担地处理给定连接的特殊情况而不会影响其他连接。

最后再次提到的一点是要用流行的脚本语言，因为当你想要解决一些特定问题的时候，人们不想把时间花在学习新语言上。以他们最终选择的 JS 来说，潜台词就是当你需要解决问题的时候，在你的项目团队里抓一个会 JS 的人，比抓一个会 C、会 Perl 或者会 Lua 的人要方便得多。

### 为什么是 JavaScript？

那为什么会选择 JS 做为脚本语言呢，当然是因为 JS 是世界上最好的语言啦！这是开玩笑的说法哈，正经来说肯定是因为将 JS 用作 nginx 脚本是有很多优点的。

- 现代通用语言
  - 因此，人们可以快速地理解它
- 类 C 语法
  - 与 nginx 配置文件良好匹配
- 事件驱动对于 JavaScript 来说是很自然的
  - 与 nginx 运行时完美匹配

JS 的第一个大优点是 JS 是一种现代化的通用语言，如果不是这一点，很可能就不会用 JS 来扩展 nginx 了。

第二个优点是，JS 有类似 C 的语法，这对于许多开发人员和 DevOps 来说是非常熟悉的。另外，对于 JS 来说额外的一大优点是 JS 有花括号来标记块，所以它与 nginx 配置的编写方式是很匹配的，所以在未来 JS 也许可以直接注入到 nginx 配置文件中，这可能会成为一个很有用的特性。

最后一点要提到的是 JS 是为浏览器编写的，所以事件驱动对于 JS 来说是很自然的，它内置于 JS 中，因此该特性与 nginx 运行时完美匹配，因为 nginx 本身也是与事件循环、回调以及类似的东西相关的。

### 为什么要自己实现解释器

既然选择了以最流行的 JS 作为基础，那 NJS 为什么不选择市面上已经成熟的 JS 引擎，而是选择自己实现了一套 JS 解释器呢？

- V8/SpiderMonkey 在 nginx 中使用的话太重了
  - 复杂的引擎，对 nginx 来说有太多不必要的开销
- Duktape 对于 nginx 内部的任务来说不够快
  - 具有不同的优先级，更重视内存占用和 ECMAScript 规范一致性，而不是性能
- 自定义解释器可以针对 nginx 运行时进行定制

第一个原因是是，因为现有的 JavaScript 引擎，像 V8 和 SpiderMokey 一样先进的 JS 引擎都太重了，而不能在 nginx 中使用它们。很明显他们是为不同的任务而设计的，他们被设计为在浏览器中执行，他们有各种各样的 JIT 引擎、垃圾收集器等等现代浏览器需要的所有东西，这类东西非常多，而在 nginx 上的服务器端配置中，并不需要这些额外的东西。

第二个代替方案是 Duktape，它是一个可以嵌入的 JS 的引擎，可以嵌入到 C 和 C++ 语言中，他非常成熟，具有很多功能。但 Duktape 的问题在于它具有不同的优先级，更重视内存占用和 ECMAScript 规范一致性以及所有在它的优先级中比性能更重要的东西。这个对 nginx 来说不是一件好事，因为对于 nginx 我们更想要的是速度。

最后一种方案就是自己实现解释器，这样就可以根据执行环境对其进行定制，这是一件非常有用的事情，因为当你拥有自己的解释器时，你可以对其进行自定义。至于自定义可以做什么，以下面这张图为例子。

**每秒创建上下文次数**

![每秒创建上下文次数](./images/javascript-in-nginx-configuration/created-contexts-sec.png)

这是每秒创建上下文的数量对比，截图来自 2018 年 nginx 团队的分享，当时是 0.2 版本，现在已经到 0.7 版本了。可以看到 NJS 创建上下文的速度至少比其他引擎快了两个个数量级。

原因很简单，就是 NJS 被设计为针对上下文创建时间进行了优化。对于 V8 和 SpiderMonkey 这样的浏览器引擎来说，因为要处理 JS 代码例如运行 JIT 编译器而引入一些延迟是完全可以接受的，但对于运行在服务器端的 NJS 来说情况完全不同，对于一个给定的请求路径，他所要运行的代码是相同的，因此可以预编译代码，可以剥离任何不需要的功能，可以优化上下文创建时间，这就是为什么我们看到这样的数字。

## NJS 解释器

那么接下来就将展示 NJS 如何实现前面描述的目标。

### 为什么 NJS 这么快

**NGINX modules**

- 在启动时进行字节码编译
- 为每个请求克隆一份已编译的虚拟机
  - 快速创建和销毁虚拟机
- 没有 JIT 编译

第一点是在 nginx 开始运行时，NJS 代码就会被编译成字节码，而不是像浏览器引擎一样一边解释一边执行，因此速度上有很大提升。

我想提一下复制和写入的含义是正确的。他以为这曾经是一个孩子和最近的实例，更改了全局对象。该更改仅对特定请求可见，因此这意味着我们共享大量不可变代码的很大一部分。减少 CPU 和内存开销。

最后我想提的一点是我们 jit 两个原因，第 1 个原因是关于可以置信。飘逸变异。如果你可以编译代码，那么你可以运行它，而对于 GT 变异情况并非如此。那个原因是 Git 引擎在 NG x 环境中并没有给你带来很多性能优势。因为大多数你是在 n 这个词本身内部没有大量计算而不是受到 x 本身的限制，而是引擎和 NG 是本身受到通常你的限制。我调用几个本身的外部 IP，你会受到他的限制。

**解释器**

- 基于寄存器的虚拟机
  - 内存占用小
- 使用 UTF-8 编码的字符串
  - ECMAScript 规范要求 UTF-16
- 不进行垃圾回收
  - 而是立即销毁克隆的虚拟机

是关于 NG x 解释器的实现方式。这是基于寄存器的虚拟机机器，并根据基于堆栈的虚拟机的比较，我们在那里注册基于虚拟机的内存占用量较小。典型的。那是小势力，你在那里大约有几千自己的内存。第 2 点是根据以下买一条本规范。应该使用 tf16 编码处理字符串，但显然这不是。你想挤出性能，这不是一个好主意，因为您必须为任何过失数据块分配至少两倍以上的资金。因此按键是使用由 tf8 字符串。能够显著减少 CPU 中的内存。提到的一点是关于垃圾收集的操作开销，因为你们中大多数人都知道现代语言，高级语言，例如 Java JavaScript，他们采用某种形式的垃圾收集算法。必须处理的特殊过程，手机不再使用的数据，但该进程本身引用技术的进程和垃圾收集器的进程停止，它们引入可测量的开销和测量的延迟而不是 NG4 岁适合本身的不同策略。

大多数 NG 模块都是编写的。 NDS 从内存池中分配内存，该内存此时链接到当前请求。数据请求完成，NG.克隆的虚拟机会被整体销毁。为该 NG 实例的操作非常便宜。显然他对于短期请求非常有效。会为长期存在的请求引入过多的内存消耗。而我们计划引入可选的垃圾手机引擎。来应对此类任务。

### NJS 不打算做的事

- nginx + NJS 不是应用程序服务器
  - 不是“Node.js”的替代品
- 严格的 ECMAScript 规范一致性
  - 大量的工作要做，优先级不高

那最后我想再次重申，我们是尝试做什么和我们不想做的事情。所以第 1 点是 NG s 和 n 级 s 不是。用程序服务器。所以我们不会替换 note gs。例如 note gs 就很好，这绝对是我们想要的。要做的事。在 NG x 本身内部添加额外的脚本功能。我要扩展，这个是引擎配置，将它们设置为两个以使用使它们更灵活而不是。替换 note gs。

只关于以三维脚本规范的一致性。它是关于现代和高级代理的编写方式，因此他们确认我们是。定的。我脚本规范。对我们来说优先级比较低，因为这是一项巨大的工作要做而且该规范的一些怪癖，不允许我们进行一些额外的优化。这就是为什么最终我们准备好看的。

### 目前可用的功能

https://nginx.org/en/docs/njs/compatibility.html

https://nginx.org/en/docs/njs/reference.html

- Boolean, Number, String, Object, Array, Function, Regexp, JSON, Math, Promise
- exceptions 异常
- 闭包和箭头函数
- let (0.6.0), const (0.6.0), async (0.7.0), await (0.7.0)
- 内置模块：fs, querystring, Crypto

要提到的第 1 件事是 JavaScript 中所有的原生对象都符合 ECMAScript 5.1 规范，例如 Boolean, Number, String, Object, Array 等等

第二点是关于异常的，你可以以通常的方式抛出和捕获他们。

你可以使用闭包和箭头函数，这些当然都是支持的，还有最近两个版本刚支持的一些 ES6 语法，例如 let/const、async/await

另外，你还可以使用 NJS 内置的一些模块，比如 fs 文件系统模块、querystring 参数解析模块和加密模块，他们就和在 node.js 中使用是一样的。

当然，还有一些是目前 NJS 中不支持的

下面是关于什么在 NJS 中不可用

- eval()
- 将 NJS 直接嵌入到 nginx 配置文件中
- 兼容性文档中未提到的 API

例如 eval() 操作不可用，因为性能和安全性的原因，nginx 团队并不打算实现它。

以及将 NJS 直接嵌入到 nginx 配置文件中这个功能仍在计划中还未实现。

另外，在官方兼容性文档中没有提到的 API 均还未受到支持，例如截止到 NJS 0.7.8 版本，循环语句中还有 for of 没有得到实现，其他像 for 循环、for in、while、do while 都是文档里提到有的。其实如果时间再往前推两年，像 let/const、async/await 也在待实现的队伍中，而现在大部分你熟悉的 API 都已经实现了，所以这点不用太担心。

## 在 NGINX 中使用 NJS

### 安装并启用 NJS

1. 安装预构建包。
   - Ubuntu 和 Debian 系统：
     ```bash
     sudo apt-get install nginx-module-njs
     ```
   - RedHat、CentOS 和 Oracle Linux 系统：
     ```bash
     sudo yum install nginx-module-njs
     ```
2. 在 nginx.conf 配置文件的顶层（“main”）上下文（而非 http 或 stream 上下文）中添加一个 load_module 指令，以启用该模块。本例启用了 NJS 的 http 模块，另外还有 stream 模块用来控制 TCP/UDP 协议的流量。
   ```nginx
   load_module modules/ngx_http_js_module.so;
   ```
3. 重新加载 NGINX，以便将 NGINX JavaScript 模块加载到运行实例中。
   ```bash
   sudo nginx -s reload
   ```

终于我们要开始看 NJS 如何使用了，首先我们必须安装它，以安装 njs 预编译模块为例，需要 nginx 版本是 1.9.11 或更高版本，你要做的事很简单，就是使用 apt-get 安装 njs 模块，然后在 nginx.conf 配置文件的顶层（“main”）上下文（而非 http 或 stream 上下文）中使用 load_module 指令引入 njs 模块，引入之后我们就可以在其余配置中使用 njs 指令了。本例启用了 NJS 的 http 模块，另外还有 stream 模块用来控制 TCP/UDP 协议的流量。最后重新加载 NGINX，以便将 NGINX JavaScript 模块加载到运行实例中。

如果你只是想简单查看 NJS 的运行情况，那么也可以使用 docker 容器配合下面链接中的例子来查看。

https://github.com/nginx/njs-examples

https://github.com/f5devcentral/nginx-njs-usecases

这些示例中包含工作中可能需要的各个方面的功能，例如：

- 授权
  - 生成 JWT 令牌
  - 根据请求正文内容授权请求
- 代理
  - 将多个子请求的结果异步合并到单个回复中
  - 链式访问多个子请求
- 修改响应
  - 修改或删除上游服务器发送的 Cookie
  - 将响应正文字符转换为小写
- 记录
  - 使用 json 格式记录日志
  - 记录每个客户端的请求数

等等。

### Hello World

![Hello World](./images/javascript-in-nginx-configuration/njs-demo.png)

1. 启用 njs 模块
2. 使用 js_import 引用 http.js 文件
3. 使用 js_content 引用 http.js 文件中导出的 hello 方法
4. 定义并导出 hello 方法

https://nginx.org/en/docs/njs/reference.html#http

在看上一页那些复杂的例子之前，按照编程界的惯例，我们先来实现一个最简单的示例 hello world。

你要做的第 1 件事就是在 nginx.conf 文件中用 load_module 加载 njs 模块

然后我们使用了第一个 NJS 指令 js_import，它的作用很简单，就是引入你编写的 js 文件，在这里就是引入了 http.js 文件；再使用第二个 NJS 指令 js_content，它的作用也很简单，就是将这个特定位置的内容处理程序更改为 NJS 脚本，在这里就是指从 http.js 文件中导出的 hello 方法。

最后再来看一看 http.js 文件，我们在这里编写名为 hello 的标准 JS 函数，其参数通常被命名为 r，代表 nginx 当前正在服务的请求。从官方文档中可以查看 r 有许多成员变量和方法可以用来操作请求。这里我们使用 return 方法，它和 nginx 本身的 return 非常相似，向用户返回 200 的状态码和文本 hello world。

现在示例已经完成了，只剩下最后一步，启动 nginx 并 curl http://localhost，这样就可以看到刚刚 hello 方法所返回的 Hello World 了。

### NJS 异步方法

```js
// 初始化连接
ngx
  .fetch('http://nginx.org/en/docs/njs')

  // 当url返回时
  .then((reply) => reply.text())

  // 当正文读取完成时
  .then((body) => r.return(200, body.toString()))

  // 如果出现了问题，就执行这里
  .catch((e) => r.return(501, e.message))
```

### 子请求功能

```nginx
# nginx.conf

js_import main from http/join_subrequests.js;

location /join {
    js_content main.join;
}

location /foo {
    proxy_pass http://backend1;
}

location /bar {
    proxy_pass http://backend2;
}
```

```js
// example.js

async function join(r) {
  join_subrequests(r, ['/foo', '/bar'])
}

async function join_subrequests(r, subs) {
  let results = await Promise.all(subs.map((uri) => r.subrequest(uri)))

  let response = results.map((reply) => ({
    uri: reply.uri,
    code: reply.status,
    body: reply.responseBody,
  }))

  r.return(200, JSON.stringify(response))
}

export default { join }
```

第二个示例将向您展示 NJS HTTP 模块的子请求方法聚合并发接口的功能。在此示例中，我们将向该示例后端中的至少两个接口发出多个同步子请求。并且我们将收集他们的返回，将联合结果同步返回给客户端。

从配置文件中我们可以看到，我们使用了 js_import 指令将 js 文件导入，并使用了别名的功能将导入的模块命名为 main，我们可以在其余配置用别名来引用它。然后使用 js_content 指令将 main 对象中的 join 方法作为 join 接口的处理函数。

然后来看看 js 文件中的内容，我们在 join 方法中使用了一个发起子请求的辅助函数，该辅助函数需要一个请求对象和子请求列表。

在辅助函数内部通过 Promise.all 和 r 对象上的 subrequest 子请求方法并行执行多个子请求调用，在所有子请求完成后拼装所有返回内容，并将其序列化后返回给 join 请求。

### 真实案例 - 使用 json 格式记录日志

默认情况下 Nginx 打印出的日志是包含各种字段值的字符串，就像下面这样：

```
172.23.0.1 - - [27/Oct/2022:12:24:45 +0000] "GET / HTTP/1.1" 200 10 "-" "curl/7.79.1" "-"
```

这样的格式存在一些缺点：

- 它本身是一种自定义格式 - 如果你想要读取它，需要编写特定的日志解析器
- 条目可能很长，让人难以阅读
- 无法记录存在不确定性的值，例如“所有请求头”

我们可以通过使用 NGINX JavaScript 模块（njs）以结构化格式（如 JSON）编写日志条目来解决这些问题。

此示例的 NGINX 配置非常简单。

```nginx
# nginx.conf
http {
    js_import   scripts/logging.js;                 # 从这里加载 js 代码
    js_set      $access_log logging.loggingJson;    # 用 js 方法为变量赋值
    log_format  json $access_log;                   # 定义特殊的日志格式

    server {
        listen 80;
        access_log /var/log/nginx/access_json.log json;
        return 200 'hello NJS\n';
    }
}
```

可以见到，NGINX JavaScript 代码并不内嵌在配置语法内。相反，我们使用 [js_import](https://nginx.org/en/docs/http/ngx_http_js_module.html#js_import) 指令来导入包含了所有 JavaScript 代码的文件。[js_set](https://nginx.org/en/docs/http/ngx_http_js_module.html#js_set) 指令定义了一个新的 NGINX 变量 `$access_log`，后面是为变量赋值的 JavaScript 函数。[log_format](https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format) 指令定义了一种名为 json 的新格式，它能够将 `$access_log` 的值写入每个日志行。

[server](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) 块定义了一个简单的 HTTP 服务器，监听 80 端口。
[access_log](https://nginx.org/en/docs/http/ngx_http_log_module.html#access_log) 指令指定了日志文件路径以及所有请求均采用 json 格式进行记录。

现在，来看看日志处理的 JavaScript 代码。

```js
function loggingJson(r) {
  var log = {}
  var indexes = [
    'remote_addr',
    'remote_user',
    'time_local',
    'request',
    'status',
    'body_bytes_sent',
    'http_referer',
    'http_user_agent',
  ]
  for (var n in indexes) {
    var key = indexes[n]
    log[key] = r.variables[key]
  }

  var headerTypes = ['headersIn', 'headersOut']
  for (var m in headerTypes) {
    var type = headerTypes[m]
    log[type] = {}
    var headers = r[type]
    for (var n in headers) {
      log[type][n] = headers[n]
    }
  }

  var logStr = JSON.stringify(log)

  while (logStr.indexOf('"') != -1) {
    logStr = logStr.replace('"', "'")
  }
  return logStr
}

export default { loggingJson }
```

NGINX 变量只有在被需要的时候才会进行求值计算，这意味着 js_set 定义的 JavaScript 函数只在需要该变量的值时才执行。在此示例中，由于 $access_log 被用于 [log_format](https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format) 指令，因此 json() 在日志记录时执行。

以下是本示例的真实日志:

```bash
$ tail -1 /var/log/nginx/access_json.log

{'remote_addr':'172.27.0.1','time_local':'28/Oct/2022:03:31:20 +0000','request':'GET / HTTP/1.1','status':'200','body_bytes_sent':'10','http_user_agent':'curl/7.79.1','headersIn':{'Host':'localhost:8095','User-Agent':'curl/7.79.1','Accept':'*/*'},'headersOut':{'Content-Type':'text/plain','Content-Length':'10'}}
```

其实如果是正常的日志没必要做这么详细的记录，我们还可以实现仅在遇到错误时再生成这样的数据，记录到单独的日志文件中，方便我们进行故障排除。不过那就需要更多额外的 nginx 配置，这里就不展开了。

## 准备好使用 NJS 了吗？

**nginx 和 NJS 可能已经在这里了**

NJS 已经包含在 nginx 官方 docker 镜像中了，并且作为动态模块可以很容易地安装到其他上下文中。

- nginx 可能已经存在于许多的基础设施中
- 大多数团队都会有一些具备 JavaScript 知识的人
- 在适当的情况下维护简单的逻辑
- NJS 与 nginx 深度融合

如果你的团队使用的是 nginx 官方的 docker 镜像，那么 NJS 已经包含在其中了，如果没有使用镜像，那么 NJS 作为动态模块也是非常容易安装的。

nginx 作为最流行的 web 服务器可能已经存在于你的基础设施中，而大多数团队都会有一些具备 JavaScript 知识的人，这意味着进一步降低了使用 NJS 的门槛，尤其是当你需要在适当的情况下维护一些简单的逻辑时。

**NJS 可让您灵活地进行输入和输出**

我们使用简单的模式展示了这些示例程序，但相同的模式可以应用于实际问题

**Node.js 生态系统可用（如果你关心这一点的话）**

尽管许多包需要转译才能与 NJS 兼容，转译的性能和维护问题的确存在，但你确实可以使用 npm 包了，它真实地提供了一个大型生态系统。

## 结语

在 njs 之前，Nginx+Lua 生态虽然已经十分成熟，但 Nginx 毕竟是一个 Web 服务器，JavaScript 作为 Web 开发的最流行的语言，用 JavaScript 生态来扩展 Nginx 的功能，可能会做出更多具有想象力的事情。

## 相关链接

NJS 文档：

http://nginx.org/en/docs/njs/

应用示例：

https://github.com/nginx/njs-examples

https://github.com/f5devcentral/nginx-njs-usecases

博客：

https://nginx.com/blog/tag/javascript

源代码：

https://github.com/nginx/njs
