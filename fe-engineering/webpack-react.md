# 使用webpack从零配置开发环境

使用的webpack版本是@4.39.3，不过@5 beta版已经发布了，emmmm...

## 1.实现对JSX, JS, PNG, LESS等文件进行打包

将JSX, LESS等文件进行打包成bundle.js，在HMTL中引入并可以在浏览器访问

[源码地址]()

### 1.1 初始化

- 新建first文件夹

- 在文件夹中使用`npm init -y`生成`package.json`文件

### 1.2 安装webpack

使用`npm`或者`yarn`安装下面依赖，本文全部使用的`yarn`

```js
yarn add webpack webpack-cli -D
```
> 注释: webpack-cli是webpack的命令行工具  -D 是 --save--dev的缩写， -S是 --save的缩写。版本号：webpack@4.39.3，webpack-cli@3.3.7

### 1.3 安装样式相关loader

```js
yarn add css-loader style-loader less less-loader -D
```
> 注释: css-loader可以配置css-module

### 1.4 安装babel,react相关loader，安装react相关依赖

安装babel

```js
yarn add babel-loader @babel/core @babel/preset-env -D
```
> 注释: babel，将es6转换为es5，@babel/core是babel-core的第七版，@babel/preset-env是babel-preset-env升级版，用于配置浏览器的兼容度以及使用最新ES6语法。不需要安装babel-preset-stage-0，因为preset-env已经集成了这几个stage的功能。但是preset-env不支持修饰器，动态引入，静态属性等等ES6最新的语法

安装babel-react

```js
yarn add @babel/preset-react -D
```
> 注释: @babel/preset-react是babel-preset-react升级版, 用于将jsx转换成js

安装react相关依赖

```js
yarn add react react-dom -S
```
> 注释, babel转换主要使用到的是react.createElement()方法

### 1.5 安装图片处理相关loader

```js
yarn add url-loader file-loader -D
```

### 1.6 项目目录结构

新建配置文件及开发文件

```js
-- dist // 用于存放打包后的文件
-- node_modules // 依赖包，自动生成
-- webpack.config.js // webpack配置
-- .babelrc // babel配置
-- src
  -- assets
    -- avatar.png
  -- index.jsx
  -- app.jsx
  -- app.less
  -- index.html
-- package.json
-- .gitignore // 设置git忽略文件
```

建议大家直接看源码，里面有注释[源码点击这里]()

可以按照这个顺序对文件进行配置与修改  `src/app.js` 以及 `src/app.less` ---> `src/index.jsx` ---> `webpack.config.js` ---> `.babelrc`

贴一下主要文件的一些内容吧

![webpack](./images/webpack-react/webpack1_1.png)
![webpack](./images/webpack-react/webpack1_2.png)
![webpack](./images/webpack-react/webpack1_3.png)
![webpack](./images/webpack-react/webpack1_4.png)
![webpack](./images/webpack-react/webpack1_5.png)

关于webpack的一些配置，可以参考上一篇的内容

### 1.7 踩坑点

- webpack配置文件需要使用Common.js模块规范(因为是node可执行文件)，ES6模块语法无法使用，但是其他文件如app.js可以使用ES6语法(因为有babel-loader可以进行转换)
- `index.tsx`，`ReactDOM.render(element, document.getElementById('app'))`要与`HTML`的节点`id`对应，其次,引入的`import ReactDOM from 'react-dom'`名字是不做严格区分的
- 构建完成的script文件要放在id为app的div下面

#### webpack配置文件容易出错的部分

- webpack容易写错的部分，output的是filename以及path，不是pathname
- webpack module rules 里面书写的是loader的规则
- 注意：rules之下的规则，test后面跟正则表达式，而不是加引号的字符串
- 添加mode，让webpack打包时进行相应的优化

#### 与react配置有关的注意事项

- 如果使用了babel-loader处理包含jsx语法的js文件，最好配置.babelrc(rc可以解为resource缩写)里面的presets配置项，preset-react，preset-env可以配置要兼容浏览器支持语法的程度。当然，.babelrc也可以配置plugins选项，这里并没有用到

### 1.8 进行打包

在`package.json`文件的`script`中添加 `"build": "webpack --config webpack.config.js"`这行代码即可，不明白的可以直接去看源码

命令行输入`yarn build`，可以看到在`build`目录多出了一个`bundle.js`文件，把`src`目录下的`index.html`在浏览器中打开，就可以看到我们实现的页面了

![打包成功](./images/webpack-react/webpack1_6.png)

## 2. 配置ts以及dev环境

如果每次改变一个文件，都要输入打包命令再去浏览器里面查看应用，开发会变得很麻烦，在开发环境下，我们可以使用基于express的webpack提供webpack-dev-server，帮助我们更好的在开发环境中开发。

在此之前，我们先配置一下ts-react开发环境。

新建目录second，全局安装`typescript`，目的是为了能够使用`tsc`命令

分别执行以下命令

```js
npm init -y // 生成package.json
tsc --init // 生成tsconfig.json
```

按照上一节的内容安装依赖

```js
yarn add webpack webpack-cli css-loader style-loader less less-loader babel-loader @babel/core @babel/preset-env @babel/preset-react url-loader file-loader -D

yarn add react react-dom -S
```

安装项目需要的typescript相关依赖
```js
yarn add typescript -D
yarn add @types/react-dom @types/react -D
```
> 注释：types依赖包含.d.ts声明文件，在react中用TS语法时，会自动对变量进行类型检测

```js
yarn add @babel/preset-typescript
```

因为要区分开发环境与正式环境的webpack配置，这里我们新建`base dev prod`对webpack进行配置

文件目录

```js
-- dist // 用于存放打包后的文件
-- node_modules // 依赖包，自动生成
-- webpack.config.base.js // webpack基础配置
-- webpack.config.dev.js // webpack开发环境配置
-- webpack.config.prod.js // webpack正式环境配置
-- .babelrc // babel配置
-- src
  -- assets
    -- avatar.png
  -- index.tsx
  -- app.tsx
  -- app.less
  -- index.html
-- package.json
-- tsconfig.json
-- .gitignore // 设置git忽略文件
```

## 3.ts-react开发环境

```js
// typescript@3.6.2
npm i typescript -D

// 安装ts-loader
npm install ts-loader -D
```

## 3.使用loader与plugins

loader用于帮我们处理不同类型的文件，plugins用于在打包过程中做优化  

在使用它们的时候，我们可以思考一下为什么出现了这些loader以及plugin，它们解决了前端的哪些问题


## 4.优化
### 对后缀名做处理
### 对CSS样式兼容postcss

### 更多部分见 [使用webpack定制开发环境](https://github.com/xblcity/web-learning/tree/master/webpack-learn)

## 参考

- [webpack文档指南](https://www.webpackjs.com/guides/)
- [深入浅出Webpack](https://webpack.wuhaolin.cn/)
- [从零搭建项目](https://www.jianshu.com/p/dd9037db20f5)
- [深度解锁Webpack系列](https://juejin.im/post/5e5c65fc6fb9a07cd00d8838)
