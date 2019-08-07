# webpack配置

## webpack配置项

webpack配置选项一般包括下面几个选项
- entry
- output
- mode
- dev-tools
- devServer
- plugins
- loaders

```js
module.exports = {
  entry: {} | '', // 入口文件目录配置
  output: {}, // 打包出的文件目录配置
  mode: '', // 环境配置，生产环境or开发环境
  plugins: [], // 插件配置，如html-webpack-plugin
  loaders: {} // loader配置
  dev-tools: '', // map 文件时用到
  devServer: {} // 使用webpack-dev-server用到此选项
}
```

### entry
```js
module.exports = {
  // 单个入口文件，可以如下配置
  entry: './src/index.js'
  // entry 配置为一个对象,优点：易于扩展  
  // 单个项格式为 [entryChunkName: string]: string|Array<string>
  // 即 属性表达式： 文件名
  // 当有多个值，即多页面应用配置选项，有多个入口, 如下
  entry: {
    home: './src/index.js',  
    about: './src/about.js'
  }
}
```

### output
```js
const path = require('path') // 对文件目录的解析需要用到node内置模块‘path’
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // path.resolve(__dirname, 'dir') __dirname解析到的是绝对路径，并与第二个参数进行拼接
    filename: 'bundle.js' // 打包的js文件名字
  }
  // output选项使用[name] [hash] [hash: number]
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].[hash:8].js',
    publicPath: '/' // 打包至指定公共目录，如线上目录等？ 如 'https://cdn.example.com/assets/[hash]/'
    // 用到webpack-dev-server 配置此项
  }
}
```

### mode
配置mode的目的在于webpack会根据模式不同进行对应的优化
```js
module.exports = {
  mode: 'development' | 'production' | none
}
```

### dev-tools
development模式可以配置此项，尽管打包的文件发生错误，仍可以定位未打包的原始文件
```js
module.exports = {
  devtool: 'inline-source-map' // source map
}
```

### devServer
此选项需要配合 webpack-dev-server使用，需要在package.json配置一下
```js
module.exports = {
  contentBase: './dist'
}
```

### plugins
插件需要先引入，然后调用插件的构造函数，插件的配置项是个数组  
插件可以是第三方插件，或者是webpack的内置插件
```js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 每一次打包都会生成新的html
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 每一次打包都会清除之前的html文件
module.exports = {
  plugins: [
    new HtmlWebpackPlugin() // 或者
    new HtmlWebpackPlugin({title: 'Output Management'}) // 参数可以不传或者传一个对象,指定doc文档title是Output Management
    new CleanWebpackPlugin()
  ]
}
```

### loaders
loaders用于处理各种格式的文件
常见的loader有babel-loader, css-loader, file-loader 等等
```js
module.exports = {
  module: {
    rules: [
      // 单个loader配置项
      {
        test: /\.js$/, // 配置file的类型
        exclude: /node_modules/, // 排除的文件夹，也可以用 include
        loader: 'babel-loader' // 使用的loader
      }
      // 配置复杂的loader, use为Array类型易于拓展
      {
        test: /.\tsx$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          },
          {
            ...
          }
        ]
      }
      // 配置复杂loader
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ]
  }
}
```

## 其他配置
### webpack-dev-server&HMR
webpack-dev-server作用在于每次更改不用手动执行webpack命令  
HMR*即hot module replacement, 可以使文件更新变化的部分而不是整个更新*  
webpack-dev-server有三种配置方式，如下  
**1. webpack's watch mode**

只需要在package.json添加一个配置选项
```json
{
  "scripts": {
    "watch": "webpack --watch",
  },
}
```
随后使用`npm run watch`即可启动项目

**2. webpack-dev-server(最常用)** 

webpack.config.js配置
```js
devServer: {
  contentBase: './dist'
}
```
package.json
```json
{
  "scripts": {
    "start": "webpack-dev-server --open"
  },
}
```
使用`npm run start`或者`npm start`即可启动项目

***使用热更新***
webpack.config.js配置, devServer添加一项
```js
devServer: {
  contentBase: './dist',
  hot: true
}
```
当然，也可以直接使用webpack 的 cli命令，即在package.json修改start命令：`webpack-dev-server --open --hotOnly`

**3. webpack-dev-middleware**

webpack.config.js配置
```js
module.exports = {
  output: {
    ...,
    publicPath: '/'  // node配置项需要
  }
}
```
项目根目录新建server.js
```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js'); // 引入基本配置  
const compiler = webpack(config); // 基础配置

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath 
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
package.json
```json
{
  "scripts": {
    "start": "node server.js"
  },
}
```
`npm run server`即可启动项目  
***使用热更新***  
server.js，以下没有使用express以及webpack-dev-middleware
```js
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
```

### 参考
- [webpack中文文档](https://www.webpackjs.com/guides/)
- [webpack英文文档](https://webpack.js.org/guides/)


