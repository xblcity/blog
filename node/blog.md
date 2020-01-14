# 博客的后端实现

- [使用Koa2与TypeORM](#使用Koa2与TypeORM)

## 使用Koa2与TypeORM

使用`Node.js`框架`Koa2`与`TypeORM`操作数据库，更为简单的实现博客后端功能

项目使用了`TypeScript`

### mysql数据库需要的表

- user 用户
- article 文章
- comment 评论
- reply 回复
- tag 标签，每个标签对应不同的文章列表

具体的表见[这里]()

### 路由

#### 登录/注册

- /api/register
- /api/login

#### 用户

- /api/user/list 用户列表
- /api/user/delete 删除某一用户

#### 文章

- /api/article/create  创建文章
- /api/article/list 文章列表
- /api/article/detail 文章详情
- /api/article/delete 删除文章
- /api/article/update 更新文章

#### 标签

- /api/tag/list 标签对应文章列表

#### 评论与回复

- /api/discuss/publish 发布评论
- /api/discuss/delete 删除评论
- /api/discuss/reply 回复评论
- /api/discuss/reply/delete 删除回复评论

具体的路由见[这里]()

### controller处理

根据路由进行控制层的书写

controller层，处理逻辑相关

#### user

user部分有更详细的注释，[点击这里进行查看]()

#### article

#### tag

#### comment

#### reply




===========================


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
