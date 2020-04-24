# ES6 知识点

- [Promise](#Promise)
- [类](#类)
- [模块](#模块)

## Promise

Promise可以解决**异步代码的执行顺序**问题，通过`then()`实现**异步函数的链式调用**，可以解决之前存在的**回调地狱**问题。

### 创建Promise

一个Promise有下面几种状态

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

只有当Promise的状态是`fulfilled`或者`rejected`的时候，才可以使用`then()`进行链式调用，状态一旦确定，无法改变

```js
Promise.resolve('hello') 
// 等同于下面这行, 两者都会立即执行
new Promise(resolve => resolve('hello'));  // fulfilled

// 立即返回一个状态为rejected的Promise
Promise.reject('throw error')
// 等同于下面这行, 两者都会立即执行
new Promise((resolve,reject) => reject('throw error'))
```

### Promise Api

```js
// Promise构造函数对象
{
  all: ƒ all(iterable) 通常会用来处理 多个并行异步操作
  race: ƒ race(iterable) 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理。
  reject: ƒ reject(reason) 返回一个状态为rejected的Promise对象
  resolve: ƒ resolve(value) 返回一个状态为fulfilled的Promise对象
}

// Promise prototype对象
{
  catch: ƒ catch(onRejected) 返回Promise对象，并且可以被链式调用
  then: ƒ then(onFulfilled, onRejected) 返回Promise对象，并且可以被链式调用
  finally: ƒ finally(onFinally)
}
```

因为 Promise.prototype.then 和  Promise.prototype.catch 方法返回promise 对象， 所以它们可以被链式调用。

### 常见用法

想要某个函数拥有promise功能，只需让其返回一个promise即可。这样的好处是可以**传递参数**，可以自己决定**执行时机**，因为Promise**新建就开始执行**

```js
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};
// 调用
myAsyncFunction('https://douban.uieee.com/v2/movie/top250?start=1&count=1').then(res => {
  console.log(res)
})
```

模拟异步

```js
let myFirstPromise = new Promise(function(resolve, reject){
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```

捕获错误

```js
const myPromise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    reject('error')
  }, 1000)
})

myPromise.then(value => {
  console.log(value) 
}, err => {
  console.error(err) // 'error'
})

// 或者使用下面这个方法，推荐，可以对多个Promise出现的错误进行统一处理
myPromise.then(value => {
  console.log(value) 
}).catch(err => { // 捕获前面then()出现的异常
  console.error(err) // 'error'
})
```

## 类

### class 类的组成

```js
class Point {
  // 实例属性新写法，需定义在类的最顶层，优点方便查看，缺点无法通过传参进行初始化
  count = 0
  // 上面代码等同于
  constructor() {
    this.count = 0
  }

  // constructor是class上面的一个特殊的属性/方法，用于生成实例对象，使用new调用传入参数
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  // 普通方法，挂载到Point.prototype上面、
  sayName() {
    console.log(this.name)
  }
  // 静态方法，不会被实例继承，只能由类Point来调用, 可以被子类继承
  static classMethod() {
    return 'hello'
  }
  // 私有方法，前面要加 _，只能在类的内部进行访问
  _bar(baz) {
    return 'world'
  }
  // 静态属性与私有属性在提案中...
}
```

### class 取值函数(getter)与存值函数(setter)

在类的内部使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```js
class MyClass {
  get prop() {
    return 'getter'
  }
  set prop(value) {
    console.log('setter:' + value)
  }
}
let init = new MyClass()
init.prop = 123 // setter: 123
init.prop // getter
```

### this 的指向

```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }
  print(text) {
    console.log(text)
  }
}
const logger = new Logger()
const { printName } = logger
logger.printName() // Hello there
printName() // TypeError: Cannot read property 'print' of undefined
```

单独使用`printName`，this 会指向该方法运行时的环境(由于 class 内部时严格模式，所以 this 指向 undefined)，导致找不到`print`报错  
一个解决方法是，在构造方法中绑定 this，这个也是在使用 React class 组件需要注意的地方

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
  // ...
}
```

另一个方法是使用箭头函数,this 总指向在被定义时的外层函数对象

```js
class Obj {
  constructor() {
    this.getThis = () => this
  }
  // 或者
  getThis = () => {}
}
```

## 模块的应用

了解 ES6 模块之前，先看一下 CommonJS 的模块语法

CommonJs 模块就是对象，输入时必须查找对象属性

```js
const { start, exists, readFile } = require('fs')
// 等同于
let _fs = require('fs')
let start = _fs.start
let exists = _fs.exists
let readFile = _fs.readFile
```

上面的代码实质是整体加载 fs 模块，即加载 fs 的所有方法，生成一个对象，然后再从这个对象上读取这几个方法，这种加载称为运行时加载，因为只有运行时才能得到这个对象，导致完全没办法在编译时做静态优化。

ES6 模块

ES6 模块不是对象，而是通过 export 命令显示指定输出的代码，再通过 import 命令输入

```js
import { start, exists, readFile } from 'fs'
```

上面的代码实质是从 fs 模块加载 3 个方法，其他方法不加载，这种方法称为“编译时加载”或者静态加载

ES6 模块自动采用了严格模式

### commonjs 与 es6 模块化对比

#### 差异

- common.js 模块输出的是值的拷贝，ES6 输出的是值的引用，， common,js 是运行时加载，ES6 是模块编译时输出接口
- common.js 加载的是一个对象，即 module.exports 属性，该对象只有在脚本运行完之后才会生成，而 ES6 模块不是对象，它的对外接口是一种静态定义，在代码静态解析阶段就会生成

common.js 是值的拷贝，也就是浅拷贝，模块内部基本类型的值发生变化影响不到其本身变化

```js
// lib.js
var counter = 3
var someObject = {
  age: 15,
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
  changeAge,
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

#### 内部变量

在 common.js 中存在的顶层变量，但在 ES6 模块之中不存在

- this, arguments, require, module, exports, **filename, **dirname

#### CommonJs 模块加载原理

commonJs 的一个模块，就是一个脚本文件，require 命令第一次加载该脚本，就会执行整个脚本，然后再内存中生成一个对象

```js
{
  id: '...',
  exports: {...},  // 模块输出的各个接口
  loaded: true,
  ...
}
```

#### ES6 模块的循环加载

ES6 模块是动态引用，如果使用`import`从一个模块加载变量(即`import foo from './foo'`)，那些变量不会缓存，而成为一个指向被加载模块的引用，需要开发着自己保证，真正取值的时候能够取到值

### ES6 模块语法

#### `export`

```js
export const firstName = 'json'
export const lastName = 'xx'
// 等同于
const firstName = 'json'
const lastOneName = 'xx'
export { firstName, lastOneName as lastName }
```

#### `import`

```js
import { firstName, lastName } from './foo'
// 或者
import { firstName as realName } from './foo'
console.log(realName)
// 或者
import * as foo from './foo'
console.log(module.firstName)

// 输入默认方法和其他接口
import _, { each, forEach } from 'lodash'
```

输入的值是只读的(read-only)，不允许被修改，但如果是对象(引用类型)，可以修改它的属性

import 具有变量提升的功能, 多次重复 import 语句，只会执行一次

#### `export default`

export default 命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此 export default 命令只能使用一次。

```js
export default function() {
  console.log('foo')
}
// 引入
// import命令可以为该匿名函数指定任意名字。
import myFuc from './foo'
myFunc() // 'foo'
```

可以用**任意名称**指向 export-default.js 输出的方法，这时就**不需要知道原模块输出的函数名**。 foo 函数名 foo，在模块外部是无效的。加载的时候，视同匿名函数加载。

## 参考

- [深入浅出ES6]
- [阮一峰 ES6 class](http://es6.ruanyifeng.com/##docs/class)
- [阮一峰 ES6 入门 Module 的语法](http://es6.ruanyifeng.com/#docs/module)
- [阮一峰 ES6 入门 Module 的加载实现](http://es6.ruanyifeng.com/#docs/module-loader)
- [js 模块化 7 日谈](http://huangxuan.me/js-module-7day/#/)
