# node 知识点

记录一些产生困惑的Node知识点

## 原生 Node

### res.setHeader 与 res.writeHead

简言之，setHeader 只可以设置一个 header，但是 writeHead 可以设置多个 headers，其中第一个是状态码，第二个是包含 headers 的对象。

当使用 response.setHeader() 设置响应头时，它们将与传给 response.writeHead() 的任何响应头合并，其中 response.writeHead() 的响应头优先。

### req 的 data 事件，chunk 参数

- chunk 可以理解为流数据中的一块数据，对可读流它是 Stream 读取的数据块，对可写流它是 Stream 写入的数据块。chunk 数据块类型有两种模式，一个是常规模式 regularMode，一个是 objectMode，在创建 Stream 时可以指 objectMode。这里说明一下两种模式的区别：在 regularMode 时，chunk 只能是 String, Buffer, Null, Undefined 类型；而在 objectMode 时，chunk 可以是任意类型。值得注意的是，regularMode 消耗的是字节，而 objectMode 消耗的是 object。

### buffer 与 stream 的关系

- buffer，为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据。stream，是对 buffer 对象的高级封装，其操作的底层还是 buffer 对象，stream 可以设置为可读、可写，或者即可读也可写，在 nodejs 中继承了 EventEmitter 接口，可以监听读入、写入的过程。具体实现有文件流，httpresponse 等

## 参考

- [Difference between response.setHeader and response.writeHead?](https://stackoverflow.com/questions/28094192/difference-between-response-setheader-and-response-writehead)
- [response.setHeader(name, value)](http://nodejs.cn/api/http.html#http_response_setheader_name_value)
- [response.writeHead(statusCode[, statusMessage][, headers])](http://nodejs.cn/api/http.html#http_response_writehead_statuscode_statusmessage_headers)
