# webpack配置
本篇仅仅是对官网Guide的总结，用于查阅，webpack版本@4.39.3(第四版最后一版)

## webpack核心配置项
核心配置包括以下几个选项
```js
module.exports = {
  entry: {} | '', // 入口文件目录配置

  output: {}, // 打包出的文件目录配置
  
  plugins: [], // 插件配置

  loaders: {}, // loader配置

  optimization: {} // webpack打包的相关优化

  mode: '', // 环境配置，生产环境or开发环境，webpack进行对应优化

  devtool: '', // 定位错误
}
```

### entry
```js
module.exports = {
  // 单个入口，但是入口没有名字
  entry: './src/index.js'

  // 多个入口，有name，由于打包后可选的文件标识
  entry: {
    app: './src/index.js',  
    another: './src/about.js'
  }
}
```

### output
```js
const path = require('path') // 对文件目录的解析需要用到node内置模块‘path’
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 解析到绝对路径，并与文件夹名字进行拼接
    filename: 'bundle.js' // 打包的js文件名字
    publicPath: '/' // 打包至指定公共目录，暂时可以不管
  }
  // output选项可以使用[name] [hash] [hash: number] [contenthash] 等变量
}
```

### mode
配置mode的目的在于webpack会根据模式不同进行对应的优化，没有此项，webpack打包会报警告，默认是`production`  

优化：如`development`模式下报错的时候会显示是哪个原始文件报的错，而`production`只会显示打包的文件报的错，并且在`production`模式下会默认开启uglifyPlugin
```js
module.exports = {
  mode: 'development' | 'production' | none
}
```

### dev-tools
配置此项，可以更准确的定位错误，在development不加影响也不大，development环境本身也可以定位错误，在production模式可以使用这项来调试错误
```js
module.exports = {
  devtool: 'inline-source-map' // source map
}
```

### plugins
插件需要先引入，然后调用插件的构造函数 
插件可以是第三方插件，或者是webpack的内置插件,插件会参与webpack打包的整个过程    
常用的两个插件如`html-webpack-plugin``clean-webpack-plugin`,前者用于每次打包都会生成新的html文件，后者每次打包都会先清理dist文件夹
```js
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 

module.exports = {
  plugins: [
    new HtmlWebpackPlugin() // 可选传参数，如 {title: 'Output Management'} 指定文档document的title
    new CleanWebpackPlugin()
  ]
}
```
### loaders
loaders用于处理各种格式的文件
常见的loader有babel-loader, css-loader, style-loader, file-loader 等等
```js
module.exports = {
  module: {
    rules: [
      // 单个loader处理文件
      {
        test: /\.css$/, // 配置file的类型
        exclude: /node_modules/, // 排除的文件夹，也可以用 include
        loader: 'css-loader', // 使用的loader
        options: {}
      }
      
      // 单个loader也可以使用下面这种方式
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

      // 多个loader处理同一种文件，处理顺序从后至前，下面这个例子是先用less-loader处理，再用css-loader处理
      {
        test: /.\less$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              ...
            }
          },
          {
            loader: 'less-loader',
            options: {
              ...
            }
          }
        ]
      }
    ]
  }
}
```

## 打包的优化

### 代码分割(code splitting)

代码分割，可以简单的理解为将app打包为多个文件，可以方便管理，异步加载也得益于此，代码分割由三种方式  

1. 配置多个entry  
2. 使用SplitChunkPlugin(旧版本@3用的是CommonChunkPlugin),常用~  
```js
module.exports = {
  optimization: {
    splitChunks: 'all'
  }
}
```
3. 动态引入，使用es6 Promise语法或者使用webpack提供的require.ensure()，个人觉得使用起来比较麻烦~

### tree-shaking
把不用的代码剔除，在项目中使用es6模块语法动态引入的部分会被打包，而未被引入的部分会被剔除
```js
```

### 开启缓存
对于缓存像react, lodash这种不变的包，我们不希望每次都重新打包，那么我们可以使用缓存
output`[hash]`更换成`[contenthash]`这样每个包都有不同的hash名字  

加入`runtimeChunk`选项，会生成一个运行时的Bundle  
加入`moduleIds`选项，生成hash标识  

### 加入环境标识
`webpack --env.NODE_ENV=local --env.production --progress` 指定环境变量而引用不同配置，做不同优化，这是一种指令方式，当然使用`mode`也可以

### 修改代码后自动编译代码

#### 1. webpack watch mode
开启watch模式，webpack会监听文件的改动，并重新打包  
只需要在package.json添加一个配置选项
```json
{
  "scripts": {
    "watch": "webpack --watch",
  },
}
```
随后使用`npm run watch`即可启动项目，监听修改，并自动进行重新打包  

缺点：需要手动刷新浏览器，才能看到重新打包后的效果

#### 2. webpack-dev-server(添加HMR,最常用)
热更新，HMR，即hot module replacement, 可以使文件更新变化的部分而不是整个更新  

需要先安装依赖包 `npm i -D webpack-dev-server`  
webpack-dev-server 提供了一个简单的web服务器，并且能够实时重新加载(live reloading)  

webpack.config.js配置，告诉devServer在哪里查找文件，不过webpack默认更新的就是dist的index文件，可以不配置
```js
devServer: {
  contentBase: './dist'，
  hot: true  // 开启热更新
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

当然，也可以直接使用webpack 的 cli命令，即在package.json修改start命令：`webpack-dev-server --open --hotOnly`

#### 3. webpack-dev-middleware
webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 webpack-dev-server 在内部使用了它，同时，它也可以作为一个单独的包来使用，以便进行更多自定义设置来实现更多的需求。  
缺点：需要对node了解，并自行配置

## 更多loader

## 更多plugin
生成打包文件关系图的plugin，打包完毕的时候自动再浏览器8888端口生成
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

### 参考
- [webpack中文文档](https://www.webpackjs.com/guides/)
- [webpack英文文档](https://webpack.js.org/guides/)


