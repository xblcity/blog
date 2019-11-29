# 模块的应用

## 1. CommonJS

CommonJs模块就是对象，输入时必须查找对象属性
```js
const {start, exists, readFile} = require('fs')
// 等同于
let _fs = require('fs')
let start = _fs.start
let exists = _fs.exists
let readFile = _fs.readFile
```
上面的代码实质是整体加载fs模块，即加载fs的所有方法，生成一个对象，然后再从这个对象上读取这几个方法，这种加载称为运行时加载，因为只有运行时才能得到这个对象，导致完全没办法在编译时做静态优化

## 2. ES6模块 

ES6模块不是对象，而是通过export命令显示指定输出的代码，再通过import命令输入

```js
import {start, exists, readFile} from 'fs'
```

上面的代码实质是从fs模块加载3个方法，其他方法不加载，这种方法称为“编译时加载”或者静态加载  

ES6模块自动采用了严格模式

### 2.1 export 命令

```js
export var firstName = 'json'
export var lastName = 'nico'
export var year = 1896
// 或者使用下面写法
var firstName = 'json'
var lastName = 'nico'
var year = 1896
export {firstName, lastName, year}
```
`export`除了输出变量，还可以输出函数或类
```js
export function multiply(x,y) {
  return x * y
}
```
使用as关键字
```js
function v1() {}
function v2() {}
export {
  v1 as foo1,
  v2 as foo2
}
```
要注意的是，export命令规定的是对外的接口(即要有接口去调用它)
```js
export 1  // 报错

var a = 1
export m  // 报错，为什么呢？
```
正确写法
```js
export var m = 1
// 或
var m = 1
export {m}
// 或
var n = 1
export {n as m}
```
### 2.2 import 命令
```js
import {firstName, lastName} from './foo'
// 或者
import {firstName as realName} from './foo'
console.log(realName)
```
输入的值是只读的(read-only)，不允许被修改，但如果是对象，可以修改它的属性，和const有点像？？  
import由变量提升的功能  
多次重复import语句，只会执行一次
```js
import * as module from './module'
console.log(module.name)
```
### 2.3 export default
export default命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此export default命令只能使用一次。
```js
export default function() {
  console.log('foo')
}
// 引入
// import命令可以为该匿名函数指定任意名字。
import myFuc from './foo'
myFunc() // 'foo'
```
可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。 
```js
export default function foo() {
  console.log('foo')
}
// 引入
import myFuc from './foo'
myFunc() // 'foo'
```
foo函数名foo，在模块外部是无效的。加载的时候，视同匿名函数加载  
```js
// 正确
export var a = 1
// 正确
var a = 1
export default a
// 正确
export default 1
// 错误
export default var a = 1
```
上面代码中，export default a的含义是将变量a的值赋给变量default。所以，最后一种写法会报错。  
如果想在一条import语句中，同时输入默认方法和其他接口，可以写成下面这样。
```js
import _, { each, forEach } from 'lodash';
```
export default 输出类
```js
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass';
let o = new MyClass();
```

## common.js与es6模块化对比
### 差异
- common.js模块输出的是值的拷贝，ES6输出的是值的引用，， common,js是运行时加载，ES6是模块编译时输出接口
- common.js加载的是一个对象，即module.exports属性，该对象只有在脚本运行完之后才会生成，而ES6模块不是对象，它的对外接口是一种静态定义，在代码静态解析阶段就会生成

common.js是值的拷贝，也就是浅拷贝，模块内部基本类型的值发生变化影响不到其本身变化
```js
// lib.js
var counter = 3
var someObject = {
  age: 15
}
function incrementCounter() {
  counter++
}
function changeAge() {
  someObject.age++
}
module.exports = {
  counter,
  someObject,
  incrementCounter,
  changeAge
} 
```
```js
// main.js
var lib = require('./lib')

console.log(lib.counter) // 3
console.log(lib.someObject.age) // 15
lib.incrementCounter()
lib.changeAge()
console.log(lib.counter) // 3
console.log(lib.someObject.age) // 16
```
可以看出，基本类型的值会被缓存，而引用类型不会

### 内部变量
在common.js中存在的顶层变量，但在ES6模块之中不存在
- this, arguments, require, module, exports, __filename, __dirname

### CommonJs模块加载原理
commonJs的一个模块，就是一个脚本文件，require命令第一次加载该脚本，就会执行整个脚本，然后再内存中生成一个对象
```js
{
  id: '...',
  exports: {...},  // 模块输出的各个接口
  loaded: true, 
  ...
}
```

### ES6模块的循环加载
ES6模块是动态引用，如果使用`import`从一个模块加载变量(即`import foo from './foo'`)，那些变量不会缓存，而成为一个指向被加载模块的引用，需要开发着自己保证，真正取值的时候能够取到值


#### 参考
- [阮一峰ES6入门 Module 的语法](http://es6.ruanyifeng.com/#docs/module)
- [阮一峰ES6入门 Module 的加载实现](http://es6.ruanyifeng.com/#docs/module-loader)
- [js模块化7日谈](http://huangxuan.me/js-module-7day/#/)