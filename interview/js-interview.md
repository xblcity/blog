# 前端理论知识

- [数据类型与方法](#数据类型与方法)
- [js 基础](#js基础)
- [es6](#es6)
- [常用 utils](#常用utils)
- [DOM 与事件](#dom与事件)
- [浏览器](#浏览器)
- [数据结构与算法](#数据结构与算法)
- [性能优化](#性能优化)
- [面试中的延伸](#面试中的延伸)

## 数据类型与方法

- 原始类型，对象类型，typeof 与 instanceof，typeof null ? instanceof 原理，如何实现
- 类型转换，比如转布尔，转字符串，转为数字。==与===的不同
- 为什么 0.1 + 0.2 != 0.3 ？
- 判断一个变量是否为数组（代码）-- `isArray() instanceof`
- 数组的 toString 是什么结果？对象呢？-- `字符串 [object Object]` --
- js 数据类型，如何能快速的去判断类型 -- `(Object.prototype.toString.call(value))` `数字[object Number]` `数组[object Array]`
- object 关于属性的控制有哪几个-- `Object.defineProperty() OBject.defineProperties()`

## js 基础

- this, 闭包，原型及构造函数，es5 构造类及继承的几种方式(以及 es6 继承)
- 深拷贝，浅拷贝及实现
- call apply 区别以及 call bind apply 的原生实现
- 数组的各种处理，reduce, sort 如何使用

- js 事件循环
- promise, generator, async 之间的联系。Promise 手动实现
- 异步回调函数如何理解

- 垃圾回收机制

## es6

- let,const 作用，作用域的隔离(es 需要使用自执行函数，es6 使用()与 let,const)
- 使用箭头函数要注意的地方
- promise 原理，promise.all，promise.race
- async await 使用场景
- 自定义 Symbol.hasInstance 与 Symbol.Iterator
- Proxy

## 常用 utils

手写部分

## DOM 与事件

- defer 与 async -- async 表示异步加载，defer 表示延迟加载，在页面渲染完毕，即渲染引擎渲染完毕后，在执行 defer 属性的 script
- 什么情况下触发回流和重绘，如何避免
- 如何阻止冒泡和默认事件 -- `e.stopPropagation() e.preventDefault()`
- js 事件流 --
- js 的 300ms 延迟
- 事件代理的原理
- addEventListener 有哪几个参数 -- 三个，最后一个是是否冒泡
- 捕获过程中去阻止冒泡，能打断事件流吗

## 浏览器

- 浏览器调试，比如打断点，测试性能
- 浏览器缓存机制
- 强缓存与协商缓存
- 浏览器渲染
- 回流 Reflow 与重绘 Repaint

- 如何实现跨域
- 前端安全 XSS CSRF
- `cookie`和`html5`本地存储的对比

答: cookie 用于 http 协议中实现保持会话状态的一种方式，存储大小只有 4KB，并且消耗性能，由于 http 协议的规定，当前域下的所有 http 请求都会携带这些 cookie 数据

html5 本地存储分别为`LocalStorage`和`SessionStorage`

`localStorage`通过`localStorage`对象的`setItem,getItem,removeItem`这 3 个方法存储获取删除数据，只要不人为删除，数据会一直存储在本地

`sessionStorage`通过`sessionStorage`对象的`setItem,getItem,removeItem`这 3 个方法存储获取删除数据，存储的数据只会存活在当前页面的生命周期内，一旦页面关闭，存储的数据就会消失

## 数据结构与算法

见[数据机构与算法]()

- 一个 DIV 盒子内部包含多个 DIV 盒子，子 DIV 盒子里面又有很多盒子.....每个盒子都有唯一的 id,name，如何得到这些盒子的 id.name
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
