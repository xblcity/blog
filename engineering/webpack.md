# webpack 配置及优化

## webpack 做了什么

webpack，即 web 的 pack，网页应用的打包，webpack 是实现前端工程化的一个重要工具。

webpack 可以对依赖进行处理，对代码进行分割与整合。开发人员可以更关注开发本身。

**本文不会进行渐进性配置，而是罗列用到的配置及依赖并进行说明。**

渐进式配置 react-ts 开发环境，可以参考 [上一篇](https://github.com/xblcity/blog/blob/master/fe-engineering/webpack-react.md)

## 概览

如何去使用？可以参照官方的[guide](https://webpack.js.org/guides/)进行一步步的配置，以下是一些配置的使用及总结。

webpack 主要分两种环境，一是**开发环境**(development)，第二种是**生产环境**(production)。开发环境中，我们会**不断的新增更改**文件的内容，我们会更关注调试，热更新等提升开发效率方面的东西。在生产环境中，我们应用的是已经成熟经过测试的代码，文件内容不会动态变化，更注重代码的精简等等。

webpack 的开发环境和生产环境大部分配置可以通用，只有少部分需要单独配置。

webpack 核心的几个配置

```js
module.exports = {
  mode: '', // 环境配置，生产环境or开发环境，webpack进行对应优化

  entry: {} | '', // 入口文件目录配置

  output: {}, // 打包出的文件目录配置

  plugins: [], // 插件配置

  loaders: {}, // loader配置

  devServer: {}, // 开发环境中必备的配置

  resolve: {}, // 解析模块可选项

  optimization: {}, // webpack打包的相关优化

  devtool: '' // 定位错误
}
```

内容最多且最重要当属 loaders 以及 plugin 部分，loaders 负责参与制定文件的编译，比如.js, .less, .png 文件的解析编译等。plugins 一般会全程参与打包，比如`html-webpack-plugin, clean-webpack-plugin`等

## 配置

比如，我们想要搭建一个 react 的开发环境，我们需要考虑哪些事情？

1. 如何把 JSX 语法转换成 JS 语法，把 ES6 语法转换为 ES5 语法
2. 如何把 less 文件转换为 css 文件，并把样式插入到 html 中
3. 如何解决 png 等图片的解析问题，如何把小图片转换为 base64 编码
4. 浏览器实时更新改变后的代码
5. 错误信息可以直接定位到原代码的文件

等等多方面考虑

我们将从核心配置的`mode, dev-tools, entry, output, resolve, loaders, plugins`等几个方面进行讲解配置。

### mode

```js
mode: 'development'
```

mode 配置为`development`有什么作用呢？webpack 会根据`mode`为`development`进行哪些优化呢？

如`development`模式下报错的时候会显示是哪个原始文件报的错，而`production`只会显示打包的文件报的错，并且在`production`模式下会默认开启 uglifyPlugin 等等

### devtool

```js
devtool: 'inline-source-map'
```

有多个值可供选择，`inline-source-map`可以使得开发者在调试工具直接看到 source 源代码。在`prodcution`模式中也可以配置此项

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

### loader

最出名的当属`babel-loader`了，它可以将 ES6+的语法转换为低版本浏览器支持的语法。需要安装一下插件`babel-loader @babel/core`(必须)，非必须的依赖比如`@babel/preset-env` `@babel/plugin-transform-runtime` `@babel/runtime`

loader 的配置在**modules.rules**中，rule 是一个数组

比如 babel-loader 的配置。其中 test 是要用 Loader 进行处理的文件，是**正则表达式**

```js
rules: [
  {
    test:  /\.jsx?$/,
    exclude: /node_modules/，
    use: {
      loader: 'babel-loader',
      options: {
        // ...等同于.babelrc中的内容
      }
    }
  }
]
```

关于 babel 的配置推荐在根目录新建.babelrc 进行配置, .babelrc 配置

`less-loader, css-loader, style-loader` 用于处理 css 样式问题

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
        test: /\.js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            // ...
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

### plugins

插件需要先引入，然后调用插件的构造函数

插件可以是第三方插件，或者是 webpack 的内置插件,插件会参与 webpack 打包的整个过程

常用的两个插件如` html-webpack-plugin``clean-webpack-plugin `,前者用于每次打包都会生成新的 html 文件，后者每次打包都会先清理 dist 文件夹

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

### resolve

开发环境中还是比较重要的

```js
module.exports = {
  resolve: {
    extensions: ['.js', 'jsx'],  // 省略文件类型，webpack自动查找，在node中，省略文件类型只会自动查找js与json
    alias: {
      @: './src' // 通过别名来把原导入路径映射成一个新的导入路径
    }，
  }
}
```

在 vs-code 中，如果想要编辑器识别这种别名路径，需要在项目根目录配置 jsconfig.json 文件或者 tsconfig.json

### devServer

热更新，HMR，即 hot module replacement, 可以使文件更新变化的部分而不是整个更新，使用devServer并添加配置可以达到这个效果

需要先安装依赖包 `npm i -D webpack-dev-server`  
webpack-dev-server 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)

webpack.config.js 配置，告诉 devServer 在哪里查找文件，不过 webpack 默认更新的就是 dist 的 index 文件，可以不配置

### optimization

#### 代码分割(code splitting)

代码分割，可以简单的理解为将 app 打包为多个文件，可以方便管理，异步加载也得益于此，代码分割由三种方式

1. 配置多个 entry
2. 使用 SplitChunkPlugin(旧版本@3 用的是 CommonChunkPlugin),常用~

```js
module.exports = {
  optimization: {
    splitChunks: 'all'
  }
}
```

3. 动态引入，使用 es6 Promise 语法或者使用 webpack 提供的 require.ensure()，个人觉得使用起来比较麻烦~

### tree-shaking

把不用的代码剔除，在项目中使用 es6 模块语法动态引入的部分会被打包，而未被引入的部分会被剔除

## 其他方面

### 加入环境标识

安装`cross-env`用于加入环境标识

### webpack watch mode(推荐使用webpack-dev-server)

开启 watch 模式，webpack 会监听文件的改动，并重新打包  
只需要在 package.json 添加一个配置选项

```json
{
  "scripts": {
    "watch": "webpack --watch"
  }
}
```

随后使用`npm run watch`即可启动项目，监听修改，并自动进行重新打包

缺点：需要手动刷新浏览器，才能看到重新打包后的效果。推荐使用`webpack-dev-server`

### 开启缓存

对于缓存像 react, lodash 这种不变的包，我们不希望每次都重新打包，那么我们可以使用缓存
output`[hash]`更换成`[contenthash]`这样每个包都有不同的 hash 名字

加入`runtimeChunk`选项，会生成一个运行时的 Bundle  
加入`moduleIds`选项，生成 hash 标识

## 更多 loader

## 更多 plugin

生成打包文件关系图的 plugin，打包完毕的时候自动再浏览器 8888 端口生成

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
}
```

## 参考

- [带你深度解锁 Webpack 系列](https://juejin.im/post/5e5c65fc6fb9a07cd00d8838)
- [中文文档](https://www.webpackjs.com/guides/)
- [English Doc](https://webpack.js.org/guides/)
- 学习 webpack 的英文文章[webpack-forward](https://survivejs.com/webpack/foreword/)
- [使用 webpack 搭建自己的 react 开发环境](https://github.com/tobeapro/react-webpack-conf)
- [Webpack 优化——将你的构建效率提速翻倍](https://juejin.im/post/5d614dc96fb9a06ae3726b3e)
- [ts 官网 React & Webpack](http://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
