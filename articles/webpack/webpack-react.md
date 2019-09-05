# 使用react从零配置react-ts SPA开发环境

使用的webpack版本是@4.39.3，不过@5 beta版已经发布了，emmmm...

## 1.先从最基础的构建开始
小目标，将一个react-ts SPA首页打包，并可以在浏览器中访问  

实现它，我们需要把src文件夹的所有ts文件打包出一个js文件，并在index.html中引入打包好的js文件

### 新建文件夹，并在文件夹内使用`npm init -y`初始化package.json文件

### 安装依赖项
需要保证全局安装了webpack以及webpack-cli

使用`npm`或者`yarn`安装下面依赖
```js
// webpack@4.39.3，webpack-cli@3.3.7，webpack-cli是webpack的命令行工具
// -D 是 --save--dev的缩写， -S是 --save的缩写
npm i webpack webpack-cli -D

// react@16.9.0
npm i react react-dom -S
// typescript@3.6.2
npm i typescript -D

// babel，将es6转换为es5，@babel/core是babel-core的第七版，@babel/preset-env是babel-preset-env升级版，不需要安装babel-preset-stage-0
npm install babel-loader @babel/core @babel/preset-env -D
// @babel/preset-reacts是babel-preset-react升级版, 用于将jsx转换成js
npm install @babel/preset-react -D
// 安装ts-loader
npm install ts-loader -D
```

### 项目目录结构(没有则新建)
```js
-- dist // 用于存放打包后的文件
  -- index.html
-- node_modules // 依赖包，自动生成
-- src // 开发时的source
  -- index.tsx
  -- App.tsx
-- webpack.config.js // webpack配置
-- .babelrc // babel配置
-- tsconfig.json // ts配置，不可缺少，否则报错
-- package.json
```

源码请看这里[]()

### 配置webpack.config.js
配置中最重要的几个部分是`entry` `output` `loaders` `plugins`
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
  // 生产环境，初始不设置会报警告
  mode: 'production',
  // 配置基础的loader
  module: {
    // rules是一个数组，因为要配置多个loader
    rules: [
      {
        test: /\.ts(x?)/,
        exclude: /(nodule_modules)/,
        use: [ // use这里我们用了一个数组，意思是要有多个loader来处理 .ts后缀结尾的文件
          {
            'babel-loader'
          }
        ]
      }
    ]
  }
}
```
我们使用了babel-loader，ts-loader等多个loader来处理`.js|.jsx`结尾的文件

### 配置package.json
在`script`属性添加一个键值对
```js
"scripts": {
  "build": "webpack --config webpack.config.js"
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

然后我们既可以在浏览器中看到打包出的react应用啦~

## 2.在开发环境中使用
如果每次改变一个文件，都要输入打包命令再去浏览器里面查看应用，开发会变得很麻烦，在开发环境下，我们可以使用基于express的webpack提供webpack-dev-server，帮助我们更好的在开发环境中开发

## 3.使用loader与plugins
loader用于帮我们处理不同类型的文件，plugins用于在打包过程中做优化  

在使用它们的时候，我们可以思考一下为什么出现了这些loader以及plugin，它们解决了前端的哪些问题


## 4.优化
### 对后缀名做处理

### 参考
- [中文文档](https://www.webpackjs.com)
- [English Doc](https://webpack.js.org)
- [使用webpack搭建自己的react开发环境](https://github.com/tobeapro/react-webpack-conf)
- [Webpack优化——将你的构建效率提速翻倍](https://juejin.im/post/5d614dc96fb9a06ae3726b3e)