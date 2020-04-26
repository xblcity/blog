# http 知识体系

## http 报文结构

http 报文结构一般是`起始行 + 头部 + 空行 + 实体`。http 请求报文和响应报文有一定区别。

### 客户端发送的 http 请求头

```js
Request URL:  /
Request Method: GET
User-Agent: xx

Content-Type: // 要发送的数据类型，服务端会根据不同类型做不同处理，常见类型见下面

Accept: /  // 客户端能接收的资源类型
Host:   // 连接的目标主机和端口号

If-Modified-Since:    // 对应Last-Modified:
If-None-Match:  //  对应Etag
Accept-Encoding: gzip  // 告诉服务端可以接受的数据格式
Accept-Language: zh-CN,zh; q=0.9  // 告诉服务端客户端接受的语言

Origin:  //
Referer:   // 告诉服务器我来自哪里，referer表示请求文件的网址，请求时会携带。为了防止自己网站的文件被外网直接引用，可以通过比较referer，即请求的地址，与本地地址比较，设置防盗链。
```

常见 `Content-Type`

`Content-Type` 参数一般包含 `media-type、charset、boundary` 三部分。`boundary` 用于 指明请求体中每部分的分隔符

```js
Content-Type: text/html; charset=utf-8

Content-Type: multipart/form-data; boundary=something // 文件的提交，前端要 new - FormData()生成实例，并 append 文件 name 以及值

Content-Type: application/json

Content-Type: application/javascript

Content-Type: application/x-www-form-urlencoded;charset=utf-8 // 这个是 form 表单自带的 Content-Type
```

### 服务端发送的 http 响应头

在 linux 命令行输入`curl -v www.baidu.com`，可以看到 response headers，每个网站响应头可能有小的差异

```js
HTTP/1.1 200 OK // 起始行

Content-Type: application/json; charset=utf-8  // 响应文件的类型

Last-Modified: Tue, 16 Feb 2016 07:44:59 GMT // 资源上次更改的时间

Etag: "Fr6FTw9wdkmOgi9FyBjKPDIY4zd8.gz" //  http的Entity Tag，标识文件资源的版本号

Server: Microsoft-IIS/8.0 // 用的何种服务器
```

对于使用了 CORS 的服务器端，还会有下面几个响应头字段：

```js
Access-Control-Allow-Headers: Authorization,content-type,token,grant_type
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true  // 是否允许设置cookie
Access-Control-Max-Age: 86400  // 每隔多久发送一次预检请求(OPTIONS)
```

## 常见 http 状态码

- 200 OK 是见得最多的成功状态码。通常在响应体中放有数据。

- 301 Moved Permanently 即永久重定向，比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回 301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。

- 302 Found，即临时重定向。浏览器并不会做缓存优化。

- 304 Not Modified: 当协商缓存命中时会返回这个状态码。

- 400 Bad Request: 一般是参数传递有误。

- 401 Unauthorized: 用户没有访问权限。一般需要用户登录的接口可能会出现此错误

- 403 Forbidden: 这实际上并不是请求报文出错，而是服务器禁止访问，原因有很多，比如法律禁止、信息敏感。

- 404 Not Found: 资源未找到，表示没在服务器上找到相应的资源。

- 405 Method Not Allowed: 请求方法不被服务器端允许。

- 500 Internal Server Error: 服务器出错。

## 参考

- [http 请求头与响应头的应用](https://juejin.im/post/5b854ddef265da43635d9302)
- [http 请求常见的请求头和相应头](https://www.jianshu.com/p/908e51e9ccd2)
- [巩固你的 HTTP 知识体系](https://juejin.im/post/5e76bd516fb9a07cce750746)
