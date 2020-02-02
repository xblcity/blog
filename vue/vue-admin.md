# vue-admin的使用

使用的模板是vue-admin-template，并对其进行改造符合业务逻辑

首先，取消devSever的mock，以及改变api请求地址

更改vue.config.js中的webpack配置

```js
devServer: {
  port: port,
  open: true,
  overlay: {
    warnings: false,
    errors: true
  },
  // before: require('./mock/mock-server.js')
},
```

紧接着，更改axios封装的拦截器。设置符合业务的请求头与状态码以及State的判断。


