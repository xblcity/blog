# JS/TS/网络相关

- [常规面试题上](https://juejin.cn/post/6844903815053852685)
- [常规面试题中](https://juejin.cn/post/6844903828093927431)
- [面试30sJS/React](https://github.com/Yangfan2016/learn-translate/blob/master/3-30secondsofinterviews_zh.md)
- [js常见面试题](https://juejin.cn/post/6844903776512393224)

## 一些重要的基础

### 变量类型及基本方法

- 值类型6种和引用类型4种，null是引用类型吗
- 基本数据类型和复杂数据类型存储有什么区别
- typeof能否判断正确类型，Object.prototype.call()呢 
- [3 个判断数组的方法](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/23)
- instanceof能否判断数据类型，实现的原理是什么，手写实现
- for of , for in 和 forEach,map 的区别
- 如何判断一个变量是不是数组
- 类数组和数组有什么区别，类数组如何转换成数组
- 你用过数组的哪些方法 [MDN Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [数组常用方法](https://juejin.cn/post/7028018256266919973)
- 哪些方法能改变原数组，哪些不会
- 深浅拷贝，赋值与拷贝的区别 [赋值与深浅拷贝](https://xblcity.github.io/blog/js-base/copy.html)
- 数组浅拷贝有哪三种方法
- == 和 === 有什么区别，类型转换的规则
- Object.is和 == === 有什么区别
- 了解object原型上的方法 [Object 构造器及原型上的方法](https://xblcity.github.io/blog/js-base/object-methods.html)
- JS隐式转换：类型转换：字符串拼接，==运算符(除了null之外，其余全部用===)，用!!可以判断truly,falsely变量
- 为什么 0.1 + 0.2 != 0.3 ?

### 原型与原型链

- 什么是原型链，原型链解决了什么问题
- prototype与__proto__有什么区别
- 如何使用ES5实现类与继承，[类与继承](https://xblcity.github.io/blog/js-base/inherit.html)
- constructor有什么作用：没有实际作用，但应尽量让对象的constructor指向其构造函数
- 原型，instanceof原理和实现

### 作用域与闭包

- this有什么作用？获取对象。this是函数运行时的一个环境对象
- this指向谁，this绑定的优先级，箭头函数的this [理解this](https://xblcity.github.io/blog/js-base/this.html)
- 什么是闭包，闭包的作用。使用闭包写一个缓存函数 [作用域与闭包](https://xblcity.github.io/blog/js-base/scope-closures.html)
- 闭包的优缺点
- call, apply, bind的使用场景及作用(借用方法)
- 手写call, apply, bind [call, apply, bind手动实现](https://xblcity.github.io/blog/js-base/call.html)
- 作用域分为哪几类，ES6新增的局部作用域如何理解
- 谈谈你对JS执行上下文栈和作用域链的理解
- new原理是什么(做了哪些)，如何实现一个new[new](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/12)

### JS异步知识

- 为什么定时器打印出来的都是同一个数，如何解决：立即执行函数/let
- 宏任务微任务如何理解
- 你知道哪些回调函数
- [JS 事件队列/循环(Event Loop)](https://xblcity.github.io/blog/js-base/eventloop.html) 包含对宏任务，Promise, 计时器的理解
- Promise有哪些优点，如何解决回调地狱问题，怎么写
- Promise有哪几种状态，Promise有什么缺点
- Promise是立即执行函数，一旦创建立即执行。then里面的函数是异步执行的
- async, Promise, generator之间的关系。手写Promise
- 如何使用Promise发送请求[AJAX](https://xblcity.github.io/blog/js-base/ajax.html)
- async,await如何理解与使用

### ES6

- [ES6 知识点](https://xblcity.github.io/blog/js-base/es6.html)
- let, const有变量提升吗，const定义的值可以修改吗
- 模板字符串，解构
- class如何实现继承，constructor起到什么作用呢
- Set和Map如何去重
- commonjs与es6模块化的不同之处
- [数组的数据处理](https://github.com/xblcity/blog/blob/master/js-practice/array.md)
- reduce, map, filter如何使用。reduce对数组进行计算



## 性能优化

- 较全面的[前端性能优化实践](https://juejin.cn/book/6844733750048210957?referrer=574f8d8d2e958a005fd4edac)
- [理解节流与防抖函数](https://xblcity.github.io/blog/js-practice/throttle.html)，减少请求次数
- 懒加载，减少回流&重绘，合理利用缓存
- DNS预解析
- 首屏SSR，减少白屏时间，有利于SEO，利于爬虫

## 手写题

- 如何判断一个数组
- 数组去重
- 数组扁平化
- 判断对象是否包含某方法
- 类与继承
- 防抖节流
- 实现instance
- 实现Promise
- Apply, Call，Bind手写
- 写一个闭包的例子，闭包的作用
- [手写代码](https://juejin.cn/post/6844904052237713422)可以看举的例子
- [看数组的面试题](https://juejin.cn/post/6844903976081555470)
- 取数组的最大值，reduce

## TS(Step2)

- TS相比JS有什么优点
- [Typescript 认知](https://xblcity.github.io/blog/js-base/ts-basic.html)
- 接口的继承 extends
- 泛型
- 类型断言
- Omit作用：过滤属性，Pick选取属性
- interface和type区别，类型别名和接口很像，但是类型别名不能被 extends 和 implements 。不过类型别名可以很好的表示交叉类型和联合类型。
- 并且type可以用于表示基本类型

## JS进阶(Step2)

- 设计模式: 工厂模式(new)，装饰模式(redux connect)，代理模式(axios),发布订阅模式(DOM事件绑定)[JS 设计模式](https://xblcity.github.io/blog/js-base/design-mode.html)
- [十大排序算法](https://juejin.cn/post/6844903902484103182#heading-5)
- [数据结构与算法](https://xblcity.github.io/blog/js-base/algorithm.html)
- 二分查找(前提是有序列表)
- 可略过[高阶函数](https://xblcity.github.io/blog/js-base/func-program.html)


## 浏览器/网络

- 事件流分为哪几个阶段？事件代理优点[Event事件](https://github.com/xblcity/blog/blob/master/html-css/event.md)
- 跨域的实现方案，JSONP如何使用，CORS怎么配置,Nginx反向代理(proxy_pass)
- websocket
- H5浏览器存储方案，怎么操作
- [从输入网址到页面渲染经历了什么](https://github.com/xblcity/blog/blob/master/fe-system/render.md)
- 浏览器缓存优先级，强缓存与协商缓存浏览器渲染原理
- TCP 与 HTTP区别
- HTTP相关知识[http 知识体系](https://github.com/xblcity/blog/blob/master/fe-system/http.md)
- Get和Post区别
- 如何对网站的文件和资源进行优化(文件合并，文件压缩，gzip 压缩 js css， 文件使用缓存...)
- 什么是同源策略，跨域实现的几种方式
- 安全问题：XSS, CORS
- 什么是雪碧图，如何快速合并雪碧图
- 垃圾回收机制
- 滚动加载 10 万条数据，dom 卡，如何解决
