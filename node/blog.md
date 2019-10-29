# blog网站实现思路

## 原生node.js

- 访问日志记录

- 设置返回数据类型，`res.setHeader('Content-Type', 'application/json')`

- 路径pathname解析，query参数解析，cookie解析/session解析，post请求body请求体数据的解析。。解析之后的解决分别挂载到`req.path, req.query, req.cookie/req.sessionId, req.body`

- 上述操作完成后，处理路由，如果请求的`pathname`是`blog`相关的路径，则由`blog`路由处理，如果请求的`pathname`是`user`相关的路径，则由`user`路由处理

- `user`相关操作，即登录，登录成功，需要用`redis`设置`session`

- `blog`相关操作(这里没有使用Restful Api)：获取博客列表(get)，获取博客详情(get)，新建博客(post)，更新博客(post)，删除博客(post)

- `post`请求校验`session`，即登录状态，校验成功返回数据，不成功抛错

- 对于`redis`以及`MySQL`的取值操作都要由对应的错误处理

- 在路由中涉及数据库操作写在`controller`里面以供调用

- 对于内容部分，使用`xss`模块对内容进行转义
