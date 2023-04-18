# 在 Nginx 中运行 JavaScript

## 目录

- 技术背景
- 初识
- NJS 的用例

## 技术背景

### 扩展 NGINX 功能的四种方式

C-Modules、Perl、Lua、JavaScript

![nginx-modules](./images/%E5%9C%A8%20Nginx%20%E4%B8%AD%E8%BF%90%E8%A1%8C%20JavaScript/nginx-modules.png)

### NJS 核心价值

使用脚本的方式扩展应用服务能力

- 减少开发投入：减少用户独立使用 C 语言开发特定场景的 nginx 模块的可能性。
- 降低使用难度：将 JavaScript 代码集成到 nginx HTTP 和流（TCP/UDP）模块的事件处理模型中。
- 提高产出效率：使用 JavaScript 代码扩展 nginx 配置语法，以实现复杂的配置解决方案。

### NJS 与 Node.js、JavaScript 的区别

一、运行时不同

Node.js 使用 Google V8 JavaScript 引擎，而 NGINX JavaScript 则是基于 ECMAScript 标准的定制化实现，专为 NGINX 设计。Node.js 在内存中有一个持久化的 JavaScript 虚拟机 (VM)，执行日常垃圾回收以管理内存；而 NGINX JavaScript 针对每个请求都会初始化一个新的 JavaScript VM 以及其所需的内存，并在请求完成时释放内存空间。

二、语言规范差异

JavaScript 的规范由 ECMAScript 标准定义。NGINX JavaScript 遵循 ECMAScript 5.1 和一些 ECMAScript 6 标准（面向数学函数）。通过实现自己的 JavaScript 运行时，njs 能够优先确保对服务器端用例的语言支持，忽略不需要的项目。

## 初识

### 安装 NJS 模块

以安装 njs 预编译模块为例，需要 nginx 版本是 1.9.11 或更高版本

1. 安装预构建包。
   - Ubuntu 和 Debian 系统：
     ```bash
     sudo apt-get install nginx-module-njs
     ```
   - RedHat、CentOS 和 Oracle Linux 系统：
     ```bash
     sudo yum install nginx-module-njs
     ```
2. 在 nginx.conf 配置文件的顶层（“main”）上下文（而非 http 或 stream 上下文）中添加一个 load_module 指令，以启用该模块。本例面向 HTTP 和 TCP/UDP 流量加载 JavaScript 模块。
   ```nginx
   load_module modules/ngx_http_js_module.so;
   load_module modules/ngx_stream_js_module.so;
   ```
3. 重新加载 NGINX，以便将 NGINX JavaScript 模块加载到运行实例中。
   ```bash
   sudo nginx -s reload
   ```

### NJS 基本使用入门

![njs-demo](./images/在%20Nginx%20中运行%20JavaScript/njs-demo.png)

1. 启用 njs 模块
2. 使用 js_import 引用 http.js 文件
3. 使用 js_content 引用 http 文件中的 hello 方法
4. 定义并导出 hello 方法

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

## NJS 的用例

### NJS 能做什么

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
- ......

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
