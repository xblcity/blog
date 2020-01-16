# 前端理论知识

- [数据类型与方法](#数据类型与方法)
- [js基础](#js基础)
- [es6](#es6)
- [常用utils](#常用utils)
- [DOM与事件](#dom与事件)
- [网络](#网络)
- [浏览器](#浏览器)
- [数据结构与算法](#数据结构与算法)
- [性能优化](#性能优化)
- [面试中的延伸](#面试中的延伸)

## 数据类型与方法

- 原始类型，对象类型，typeof与instanceof，typeof null ? instanceof原理，如何实现
- 类型转换，比如转布尔，转字符串，转为数字。==与===的不同
- 为什么0.1 + 0.2 != 0.3 ？
- 判断一个变量是否为数组（代码）-- `isArray() instanceof`
- 数组的toString是什么结果？对象呢？-- `字符串 [object Object]` -- 
- js数据类型，如何能快速的去判断类型 -- `(Object.prototype.toString.call(value))` `数字[object Number]` `数组[object Array]`
- object关于属性的控制有哪几个-- `Object.defineProperty() OBject.defineProperties()`

## js基础

- this, 闭包，原型及构造函数，es5构造类及继承的几种方式(以及es6继承)
- 深拷贝，浅拷贝及实现
- call apply区别以及call bind apply 的原生实现
- 数组的各种处理，reduce, sort如何使用

- js事件循环
- promise, generator, async之间的联系。Promise手动实现
- 异步回调函数如何理解

- 垃圾回收机制

## es6

- let,const作用，作用域的隔离(es需要使用自执行函数，es6使用()与let,const)
- 使用箭头函数要注意的地方
- promise原理，promise.all，promise.race
- async await 使用场景
- 自定义Symbol.hasInstance与Symbol.Iterator
- Proxy

## 常用utils

## DOM与事件

- defer与async -- async表示异步加载，defer表示延迟加载，在页面渲染完毕，即渲染引擎渲染完毕后，在执行defer属性的script
- 什么情况下触发回流和重绘，如何避免
- 如何阻止冒泡和默认事件 -- `e.stopPropagation() e.preventDefault()`
- js事件流 -- 
- js的300ms延迟
- 事件代理的原理
- addEventListener有哪几个参数 -- 三个，最后一个是是否冒泡
- 捕获过程中去阻止冒泡，能打断事件流吗

## 网络

- TCP与HTTP
- 强缓存，协商缓存
- 如何对网站的文件和资源进行优化(文件合并，文件压缩，gzip压缩 js css， 文件使用缓存...)
- 什么是同源策略，跨域实现的几种方式
- 什么是雪碧图，如何快速合并雪碧图
- google等浏览器的上传下载请求限制是多少
- http的版本反战历史,http协议具体等
- 滚动加载10万条数据，dom卡，如何解决
- 后台传过来10万条数据，如何加载？

答：

1. 十万条数据，即时网络情况再好，一次性加载十万条数据，这里必定会带来性能上的影响，可以考虑异步加载，分批，分时加载，如果有缓存更好

2. js是单线程的这点都知道，如果将这十万条数据完全放在这个单线程上面处理，必定会带来糟糕的体验，因此在这里可以考虑web worker这项技术，将异步加载的分批数据通过web worker处理即可。

3. 上面说到了js是单线程，在数据量如此大的情况下面，就要合理的利用异步处理了，比如我们常见的setTimeout 以及setInterval等相关异步处理函数


## 浏览器

- 浏览器调试，比如打断点，测试性能
- 浏览器缓存机制
- 强缓存与协商缓存
- 浏览器渲染
- 回流Reflow与重绘Repaint

- 如何实现跨域
- 前端安全 XSS CSRF
- `cookie`和`html5`本地存储的对比

答: cookie用于http协议中实现保持会话状态的一种方式，存储大小只有4KB，并且消耗性能，由于http协议的规定，当前域下的所有http请求都会携带这些cookie数据

html5本地存储分别为`LocalStorage`和`SessionStorage`

`localStorage`通过`localStorage`对象的`setItem,getItem,removeItem`这3个方法存储获取删除数据，只要不人为删除，数据会一直存储在本地

`sessionStorage`通过`sessionStorage`对象的`setItem,getItem,removeItem`这3个方法存储获取删除数据，存储的数据只会存活在当前页面的生命周期内，一旦页面关闭，存储的数据就会消失

## 数据结构与算法

- 一个DIV盒子内部包含多个DIV盒子，子DIV盒子里面又有很多盒子.....每个盒子都有唯一的id,name，如何得到这些盒子的id.name
- 实现快速排序（推荐）和冒泡排序

## 面试中的延伸

面试时延伸问题比较重要，比如

JS 是如何运行的？  

这其实是很大的一块内容。你可以先说 JS 是单线程运行的，这里就可以说说你理解的线程和进程的区别。然后讲到执行栈，接下来的内容就是涉及 Eventloop 了，微任务和宏任务的区别，哪些是微任务，哪些又是宏任务，还可以谈及浏览器和 Node 中的 Eventloop 的不同，最后还可以聊一聊 JS 中的垃圾回收。

ES6 中有使用过什么？  

这边可说的实在太多，你可以列举 1 - 2 个点。比如说说 class，那么 class 又可以拉回到原型的问题；可以说说 promise，那么线就被拉到了异步的内容；可以说说 proxy，那么如果你使用过 Vue 这个框架，就可以谈谈响应式原理的内容；同样也可以说说 let 这些声明变量的语法，那么就可以谈及与 var 的不同，说到提升这块的内容。

bind、call 和 apply 各自有什么区别？  

首先肯定是说出三者的不同，如果自己实现过其中的函数，可以尝试说出自己的思路。然后可以聊一聊 this 的内容，有几种规则判断 this 到底是什么，this 规则会涉及到 new，那么最后可以说下自己对于 new 的理解。

你理解的原型是什么？  

起码说出原型小节中的总结内容，然后还可以指出一些小点，比如并不是所有函数都有 prototype 属性，然后引申出原型链的概念，提出如何使用原型实现继承，继而可以引申出 ES6 中的 class 实现继承。

JS 分为哪两大类型？都有什么各自的特点？你该如何判断正确的类型？

对于原始类型来说，你可以指出 null 和 number 存在的一些问题。对于对象类型来说，你可以从垃圾回收的角度去切入，也可以说一下对象类型存在深浅拷贝的问题。
对于判断类型来说，你可以去对比一下 typeof 和 instanceof 之间的区别，也可以指出 instanceof 判断类型也不是完全准确的。
