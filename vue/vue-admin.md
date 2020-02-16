# vue-element-admin的使用

## 项目的目录

```js
├── src/
|   ├── api 用户请求的api都放在这个目录下
|   ├── assets 项目中使用的图片等静态资源
|   ├── components 
|   ├── directive 
|   ├── filters 
|   ├── icons svg图标
|   ├── components 
|   ├── layout 
|   ├── router 路由
|   ├── store vuex
|   ├── styles
|   ├── utils
|   ├── views 页面文件
|   ├── App.vue
|   ├── main.js
|   ├── permission.js
|   └── settings.js
├── build/
├── mock/
├── public/
├── tests/
├── .env.development
├── .env.production
└── vue.config.js
```

## 初始化

因为后台接口已经写好了，所以需要取消mock，并更改api地址。这里使用的是`vue-admin-template`，在其基础上进行更改

`vue.config.js`注释webpack的devServer配置项的`before`项

`.env.development`修改api请求地址

发现启动项目的时候会打开两次浏览器，将webpack配置项devServer的`open:true`改为`false`，并在`package.json`文件的dev命令后面加上`--open`。

## 登录及权限管理




