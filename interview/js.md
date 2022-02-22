# JS及TS相关

## 一些重要的基础

变量类型

- 值类型6种和引用类型4种，如何判断，typeof可以判断基础类型，函数，和对象; instanceof, OBject.prototype.call()
- 深浅拷贝，赋值与拷贝的区别 [赋值与深浅拷贝](https://xblcity.github.io/blog/js-base/copy.html)
- 了解object原型上的方法 [Object 构造器及原型上的方法](https://xblcity.github.io/blog/js-base/object-methods.html)
- 类型转换：字符串拼接，==运算符(除了null之外，其余全部用===)，用!!可以判断truly,falsely变量
- [JS 细碎知识点](https://xblcity.github.io/blog/js-base/knowledge-points.html)

原型与原型链

- class
- 类与继承 [类与继承](https://xblcity.github.io/blog/js-base/inherit.html)
- 原型，instanceof原理
- 每个class都有显式原型prototype, 每个实例都有隐式原型__proto__，实例的__proto__指向对应class的prototype

作用域与闭包

-  this [理解this](https://xblcity.github.io/blog/js-base/this.html)
-  作用域与闭包 [作用域与闭包](https://xblcity.github.io/blog/js-base/scope-closures.html)
- [call, apply, bind手动实现](https://xblcity.github.io/blog/js-base/call.html)

JS异步知识

- [JS 事件队列/循环(Event Loop)](https://xblcity.github.io/blog/js-base/eventloop.html) 包含对宏任务，Promise, 计时器的理解
- Promise是立即执行函数，一旦创建立即执行。async, Promise, generator之间的关系。手写Promise
- 简单了解[AJAX](https://xblcity.github.io/blog/js-base/ajax.html)

ES6

- [ES6 知识点](https://xblcity.github.io/blog/js-base/es6.html)
- [数组的数据处理](https://github.com/xblcity/blog/blob/master/js-practice/array.md)
- class, let, const, 模块化，新增数组方法(map, filter, reduce等)

## TS(Step2)

- [Typescript 认知](https://xblcity.github.io/blog/js-base/ts-basic.html)

## JS进阶(Step2)

- [高阶函数](https://xblcity.github.io/blog/js-base/func-program.html)
- [JS 设计模式](https://xblcity.github.io/blog/js-base/design-mode.html)
- [数据结构与算法](https://xblcity.github.io/blog/js-base/algorithm.html)

## 浏览器相关

- [Event事件](https://github.com/xblcity/blog/blob/master/html-css/event.md)
- 如何处理处理，JSONP如何使用
- 浏览器存储
- [从输入网址到页面渲染经历了什么](https://github.com/xblcity/blog/blob/master/fe-system/render.md)
- 浏览器缓存优先级，强缓存与协商缓存浏览器渲染原理

## 性能优化

- 较全面的[前端性能优化实践](https://juejin.cn/book/6844733750048210957?referrer=574f8d8d2e958a005fd4edac)
- [理解节流与防抖函数](https://xblcity.github.io/blog/js-practice/throttle.html)，减少请求次数
- 懒加载，减少回流&重绘，合理利用缓存

## 手写题

- 类与继承
- 防抖节流
- Apply, Call，Bind手写
