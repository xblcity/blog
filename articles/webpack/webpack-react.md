# 使用react从零配置react-ts SPA开发环境
没看过文档指南部分的同学可以先移步中文官方文档[指南](https://www.webpackjs.com/guides/)或英文文档[Guides](https://webpack.js.org/guides/)，文档挺好的，不过中文文档不是最新版，有些坑。

## 1.先从最基础的构建开始
小目标，将一个react-ts SPA首页打包，并可以在浏览器中访问  

实现它，我们需要把src文件夹的所有js文件打包出一个js文件，并在index.html中引入打包好的js文件

### 新建文件夹，并在文件夹内使用`npm init -y`初始化package.json文件

### 安装依赖项
需要保证全局安装了webpack以及webpack-cli
```js
// react@16.9.0
npm i -S react react-dom
// typescript@3.6.2
npm i -D typescript
// webpack@4.39.3，webpack-cli@3.3.7，webpack-cli是webpack的命令行工具
npm i -D webpack webpack-cli 
// babel，将es6转换为es5，@babel/core是babel-core的第七版，@babel/preset-env是babel-preset-env升级版，不需要安装babel-preset-stage-0
npm install -D babel-loader @babel/core @babel/preset-env
// @babel/preset-reacts是babel-preset-react升级版, 用于将jsx转换成js
npm install -D @babel/preset-react
// 安装ts-loader
npm install -D ts-loader
```

### 项目目录结构(没有则新建)
```js
-- dist // 用于存放打包后的文件
  -- index.html
  -- bundle.js // 打包后的js，配置生成
-- node_modules // 依赖包，自动生成
-- src // 开发时的source
  -- index.html
  -- index.tsx
  -- App.tsx
-- webpack.config.js // webpack配置
-- .babelrc // babel配置
-- tsconfig.json // ts配置，不可缺少，否则报错
-- package.json
```

### 配置webpack.config.js
用的是common.js的语法
```js
const path = require('path')

module.exports = {
  // 入口
  entry: {
    App: './src/index.tsx'
  },
  // 打包后的文件及目录
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  // 开发模式
  mode: 'development',
  // 配置基础的loader
  module: {
    rules: [
      {
        test: /\.tsx/,
        exclude: /(nodule_modules)/,
        loader: 'ts-loader'
      },
      {
        test: /\.tsx/,
        loader: 'babel-loader' // 由于已经在.babelrc配置了options,所以这里就不用写options了
      }
    ]
  }
}
```

### 配置package.json
在`script`属性添加一个键值对
```js
"scripts": {
  "build": "npx webpack --config webpack.config.js"
}
```

### 配置.babelrc(rc可以解为resource缩写)
```js
{
  presets:[
      '@babel/preset-env',
      '@babel/preset-react'
  ],
  plugins:[]
}
```

### 修改src下ts文件
```ts
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(
  <APP/>,
  document.getElementById('root')
)
```
```ts
// App.tsx
import React from 'react'

const App = () => {
  return(
    <div>这是一个react应用</div>
  )
}

export default App
```

### 运行
终端输入`npm run build`打包

## 2.在开发环境中使用

## 3.使用loader以及plugins

## 4.优化
### 对后缀名做处理

### 参考
- [中文指南](https://www.webpackjs.com/guides/)
- [English Guides](https://webpack.js.org/guides/)
- [使用webpack搭建自己的react开发环境](https://github.com/tobeapro/react-webpack-conf)