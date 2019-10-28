# http客户端与服务端的请求头与请求体

## 通用--

## 客户端发送的http请求头
Request URL:  
Request Method:  
User-Agent: 
Content-Type: 要发送的数据类型，服务端会根据不同类型做不同处理，常见类型有...
```js
// Content-Type参数一般media-type、charset、boundary三种。boundary指明请求体中每部分的分隔符
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something  // 文件的提交，前端要new FormData()生成实例，并append文件name以及值
Content-Type: application/json
Content-Type: application/javascript
Content-Type: application/x-www-form-urlencoded;charset=utf-8 // 这个是form表单自带的Content-Type
```
Accept: /  // 客户端能接收的资源类型
Host:   // 连接的目标主机和端口号

If-Modified-Since:    // 对应Last-Modified: 
If-None-Match:  //  对应Etag
Accept-Encoding: gzip  // 告诉服务端可以接受的数据格式
Accept-Language: zh-CN,zh; q=0.9  // 告诉服务端客户端接受的语言

Origin:  //
Referer:   // 告诉服务器我来自哪里，referer表示请求文件的网址，请求时会携带。为了防止自己网站的文件被外网直接引用，可以通过比较referer，即请求的地址，与本地地址比较，设置防盗链。

## 服务端发送的http响应头
在linux命令行输入`curl -v www.baidu.com`，可以看到response headers，每个网站响应头可能有小的差异

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8  // 响应文件的类型
Last-Modified: Tue, 16 Feb 2016 07:44:59 GMT // 资源上次更改的时间
Etag: "Fr6FTw9wdkmOgi9FyBjKPDIY4zd8.gz" //  http的Entity Tag，标识文件资源的版本号
Server: Microsoft-IIS/8.0 // 用的何种服务器

对于使用了CORS的服务器端，还会有下面几个响应头字段： 
Access-Control-Allow-Headers: Authorization,content-type,token,grant_type
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true  // 是否允许设置cookie
Access-Control-Max-Age: 86400  // 每隔多久发送一次预检请求(OPTIONS)


## 参考
- [http请求头与响应头的应用](https://juejin.im/post/5b854ddef265da43635d9302)
- [http请求常见的请求头和相应头](https://www.jianshu.com/p/908e51e9ccd2)


