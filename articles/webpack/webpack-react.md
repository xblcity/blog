# 使用react从零配置react-ts SPA开发环境

## 新建文件夹，并在文件夹内使用`npm init -y`初始化package.json文件

## 安装依赖项
```js
// react
npm i -S react react-dom
// typescript
npm i -D typescript
// webpack
npm i -D webpack webpack-cli 
// 安装热更新模块
npm i -D webpack-dev-server
// babel，将es6转换为es5
npm install -D babel-loader @babel/core @babel/preset-env
// 安装ts-loader
npm install -D ts-loader
```

## 项目目录结构(部分需新建)
```js
-- dist
-- src 
  -- index.tsx
  -- App.tsx
-- webpack.config.js
-- package.json
```

## 配置webpack.config.js
用的是common.js的语法
```js
const path = require('path')

module.exports = {
  entry: {
    App: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].chunk.[hash:8].js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx/,
        // exclude: nodule_modules,
        loader: 'ts-loader'
      },
      {
        test: /\.tsx/,
        loader: 'babel-loader'
      }
    ]
  }
}
```

## 配置package.json
在`script`属性添加一个键值对
```js
"scripts": {
  "dev": "webpack-dev-server --open"
}
```

## 修改src下ts文件
```ts
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

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

## 运行
终端输入`npm run dev`命令启动项目
