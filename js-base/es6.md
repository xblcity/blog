# ES6一些注意点

## ES6实现类

### class类的组成

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

### class取值函数(getter)与存值函数(setter)

在类的内部使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为  

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
init.prop = 123  // setter: 123
init.prop // getter
```

### this的指向

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
const {printName} = logger
logger.printName() // Hello there
printName() // TypeError: Cannot read property 'print' of undefined
```

单独使用`printName`，this会指向该方法运行时的环境(由于class内部时严格模式，所以this指向undefined)，导致找不到`print`报错  
一个解决方法是，在构造方法中绑定this 

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
  // ...
}
```

另一个方法是使用箭头函数,this总指向在被定义时的外层函数对象

```js
class Obj {
  constructor() {
    this.getThis = () => this
  }
  // 或者
  getThis = () => {

  }
}
```

## 模块的应用

### 介绍

> 了解ES6模块之前，先看一下CommonJS的模块语法

CommonJs模块就是对象，输入时必须查找对象属性

```js
const {start, exists, readFile} = require('fs')
// 等同于
let _fs = require('fs')
let start = _fs.start
let exists = _fs.exists
let readFile = _fs.readFile
```

上面的代码实质是整体加载fs模块，即加载fs的所有方法，生成一个对象，然后再从这个对象上读取这几个方法，这种加载称为运行时加载，因为只有运行时才能得到这个对象，导致完全没办法在编译时做静态优化。

> ES6模块 

ES6模块不是对象，而是通过export命令显示指定输出的代码，再通过import命令输入

```js
import {start, exists, readFile} from 'fs'
```

上面的代码实质是从fs模块加载3个方法，其他方法不加载，这种方法称为“编译时加载”或者静态加载  

ES6模块自动采用了严格模式

### commonjs与es6模块化对比

#### 差异

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

#### 内部变量
在common.js中存在的顶层变量，但在ES6模块之中不存在
- this, arguments, require, module, exports, __filename, __dirname

#### CommonJs模块加载原理
commonJs的一个模块，就是一个脚本文件，require命令第一次加载该脚本，就会执行整个脚本，然后再内存中生成一个对象
```js
{
  id: '...',
  exports: {...},  // 模块输出的各个接口
  loaded: true, 
  ...
}
```

#### ES6模块的循环加载
ES6模块是动态引用，如果使用`import`从一个模块加载变量(即`import foo from './foo'`)，那些变量不会缓存，而成为一个指向被加载模块的引用，需要开发着自己保证，真正取值的时候能够取到值


### ES6模块语法

#### `export` 

```js
export const firstName = 'json'
export const lastName = 'xx'
// 等同于 
const firstName = 'json'
const lastOneName = 'xx'
export {firstName, lastOneName as lastName}
```

#### `import`

```js
import {firstName, lastName} from './foo'
// 或者
import {firstName as realName} from './foo'
console.log(realName)
// 或者
import * as foo from './foo'
console.log(module.firstName)

// 输入默认方法和其他接口
import _, { each, forEach } from 'lodash'
```

输入的值是只读的(read-only)，不允许被修改，但如果是对象，可以修改它的属性，和const有点像？？  

import具有变量提升的功能, 多次重复import语句，只会执行一次

#### `export default`

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

可以用**任意名称**指向export-default.js输出的方法，这时就**不需要知道原模块输出的函数名**。 foo函数名foo，在模块外部是无效的。加载的时候，视同匿名函数加载。

## 参考

- [阮一峰ES6 class](http://es6.ruanyifeng.com/##docs/class)
- [阮一峰ES6入门 Module 的语法](http://es6.ruanyifeng.com/#docs/module)
- [阮一峰ES6入门 Module 的加载实现](http://es6.ruanyifeng.com/#docs/module-loader)
- [js模块化7日谈](http://huangxuan.me/js-module-7day/#/)