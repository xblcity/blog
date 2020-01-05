# JS面试题

## js

- es5实现类
- js实现继承的几种方式（代码）
- call apply区别以及call bind apply 的原生实现
- 什么试this，this的打印问题
- 原型链，function的构造函数

## 数据类型&方法

- 判断一个变量是否为数组（代码）-- `isArray() instanceof`
- 数组的toString是什么结果？对象呢？-- `字符串 [object Object]` -- 
- js数据类型，如何能快速的去判断类型 -- `(Object.prototype.toString.call(value))` `数字[object Number]` `数组[object Array]`
- object关于属性的控制有哪几个-- `Object.defineProperty() OBject.defineProperties()`

## DOM/事件

- 如何阻止冒泡和默认事件 -- `e.stopPropagation() e.preventDefautlt()`
- js事件流 -- 
- js的300ms延迟
- 事件代理的原理
- addEventListener有哪几个参数 -- 三个，最后一个是是否冒泡
- 捕获过程中去阻止冒泡，能打断事件流吗


## es6

- let,const作用，作用域的隔离(es需要使用自执行函数，es6使用()与let,const)
- 使用箭头函数要注意的地方
- promise原理，promise.all，promise.race
- async await 使用场景
- 自定义Symbol.hasInstance与Symbol.Iterator

## 数据结构与算法

- 一个DIV盒子内部包含多个DIV盒子，子DIV盒子里面又有很多盒子.....每个盒子都有唯一的id,name，如何得到这些盒子的id.name
- 实现快速排序（推荐）和冒泡排序
