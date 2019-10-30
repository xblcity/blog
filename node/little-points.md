# node知识点

### res.setHeader与res.writeHead

简言之，setHeader只可以设置一个header，但是writeHead可以设置多个headers，其中第一个是状态码，第二个是包含headers的对象。  
当使用 response.setHeader() 设置响应头时，它们将与传给 response.writeHead() 的任何响应头合并，其中 response.writeHead() 的响应头优先。

##### 参考
  - [Difference between response.setHeader and response.writeHead?](https://stackoverflow.com/questions/28094192/difference-between-response-setheader-and-response-writehead)
  - [response.setHeader(name, value)](http://nodejs.cn/api/http.html#http_response_setheader_name_value)
  - [response.writeHead(statusCode[, statusMessage][, headers])](http://nodejs.cn/api/http.html#http_response_writehead_statuscode_statusmessage_headers)

### req的data事件，chunk参数

  - chunk可以理解为流数据中的一块数据，对可读流它是Stream读取的数据块，对可写流它是Stream写入的数据块。chunk数据块类型有两种模式，一个是常规模式regularMode，一个是objectMode，在创建Stream时可以指objectMode。这里说明一下两种模式的区别：在regularMode时，chunk只能是String, Buffer, Null, Undefined类型；而在objectMode时，chunk可以是任意类型。值得注意的是，regularMode消耗的是字节，而objectMode消耗的是object。

### buffer与stream的关系

  - buffer，为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据。stream，是对buffer对象的高级封装，其操作的底层还是buffer对象，stream可以设置为可读、可写，或者即可读也可写，在nodejs中继承了EventEmitter接口，可以监听读入、写入的过程。具体实现有文件流，httpresponse等