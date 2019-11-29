# 作用域与闭包

## 1. 作用域

### 1.1 词法作用域&语法作用域

词法作用域 (静态作用域) 是指作用域是由书写代码时的位置决定的

语法作用域 (动态作用域) 是由代码运行时的上下文决定的。  

闭包的实现就是基于词法作用域。this的实现是基于语法作用域。

```js
let value = 1
function foo() {
  console.log(value)
}
function bar() {
  let value = 2
  foo()
}
```

如果按照js的词法作用域，输出的是1，即foo函数的作用域链是在定义的时候已经被确定了，foo内部没有value变量，则向上寻找全局的value变量   

如果是语法作用域，输出的是2，foo内部没有value变量，向上寻找bar函数内部有没有value变量，找到了所以输出2。  

### 1.2 JS作用域类型

JS作用域分为函数作用域，块作用域，全局作用域三种

#### 1.2.1 函数作用域

```js
function foo(a) {
  var b = 2;
  // 一些代码
  function bar() {
      // ...
  }
  // 更多的代码
  var c = 3;
}
```

全局作用域只有一个变量：foo

foo函数作用域内部：变量b,bar,a

#### 1.2.2 块作用域

##### try...catch

```js
try {
  new Error('发生错误')
} catch(err) {
  console.log(err)  // Error: 发生错误
}
```
catch分句会创建块作用域，在catch语句外拿不到err变量

#### let, const

let为其声明的变量隐式的劫持了所在的作用域

```js
var foo = true;
if (foo) {
    let bar = 2;
    console.log( bar ); // 2
}
console.log( bar ); // ReferenceError
```
let 声明的变量不会提升  

let用于for循环  
```js
for (let i = 1; i < 10; i++) {
  console.log(i)
}
console.log(i) // Reference Error
```

const声明的变量无法被重新赋值，const声明的引用类型不可以重新赋值(即改变指针)，但是可以可以增删属性(如对象), 也可以增删项(如数组)

#### 1.2.3 全局作用域

在浏览器中全局作用域是window，在全局作用域声明的变量可以在任何地方访问到

##### var声明的变量提升与函数提升

var 声明的变量存在变量提升，函数声明存在提升，并优先于变量提升，函数表达式并不会提升

```js
b() // b函数执行了
console.log(a) // undefined
c() // Uncaught ReferenceError: Cannot access 'c' before initialization

var a = 1
function b() {  // 函数声明
  console.log('b函数执行了')
}
const c = function() { // 函数表达式
  console.log('c函数执行了')
}
```

## 2. 闭包

闭包：函数在自己定义的词法作用域以外的地方执行，但是可以记住并访问到所在的词法作用域。**闭包只存在于函数中**

普通函数在执行完后，就被销毁了，而有闭包存在的函数，执行完之后，不会被销毁。因此，闭包形成的上下文环境也会一直存在  

了解闭包，需要知道**作用域链**和**函数执行机制**

### 2.1 函数执行机制与上下文环境

由于js函数执行的原理，当函数被调用时，会被推送到一个执行栈中，形成自己的上下文环境，函数执行完则出栈，因而函数内部的变量/上下文环境也理解销毁    

那么如何获取执行完毕的函数内部的变量呢，即如何让函数执行的上下文环境不被销毁呢，这就要通过闭包了，**闭包使得在执行的函数与应当被销毁的父函数产生了关联，使得作用域一直存在** 

```js
function foo() {
  let count = 1
  return function bar() {
    count ++
    console.log(count) // 输出2
  }
}
const addCount = foo() // 赋值，addCount指向引用类型bar()
addCount()
```

上述例子，bar引用了父级函数foo里面的count变量，所以在函数foo执行过后,count变量没有被立即销毁，我们通过addCount函数又可以获取到foo内部变量count的值，即bar函数被定义的地方。  

闭包阻止了foo函数的销毁，大量的使用闭包会造成js内存无法及时得到释放。  

### 2.2 理解闭包的例子

#### 2.2.1 经典的for循环

```js
for (var i = 1; i <= 5; i++) {
  setTimeout( function timer() {
    console.log(i)
  }, i * 1000)
}
// 输出5次6
```

我们的本意值设置一个定时器，每次循环打印当前的i，但是我们发现打印了5个6，为什么呢，又要涉及到js的执行机制了，由于js是单线程引擎，所以js会首先执行同步队列里的代码，然后才会执行异步任务(涉及了js宏任务与微任务)上述例子中，js会首先执行for循环，执行完毕后，i已经变成了6，这时候在执行定时器，定时器现在内部寻找i变量，找不到，再向父作用域里寻找i变量(即全局作用域),哦，找到了i,值为6，`console.log`打印一下  

如何打印出1~6呢，这里我们会想到给`setTimeout`内部储存一个i变量，每次执行`setTimeout`都访问自己独一无二的变量。再ES6之前，我们这样做：  
使用IIFE(Immediately Invoked Function Expression),即立即调用函数表达式  

```js
for (var i = 1; i <=5; i++) {
  (function(j) {
    console.log(j) // 1,2,3,4,5,6 立即打印
    setTimeout( function timer() {
      console.log(j) //1,2,3,4,5,6 隔一秒打印一次
    }, i*1000)
  })(i)
}
```

这里，我们使用了一个立即执行函数，形成闭包作用域，每次for循环时，立即执行函数被执行，i变量传入立即执行函数内部，每个立即执行函数都会保存输入自己作用域内部的i变量，所以当定时器执行时，输出的就是各自匿名函数内部的j变量，即`1,2,3,4,5,6`了。 

在ES6之后，我们就不用这么麻烦了，
```js
for (let i = 1; i <= 5; i++) {
  setTimeout( function timer() {
    console.log(i) //1,2,3,4,5,6
  }, i * 1000)
}
```

我们使用了ES6新增的声明变量的方式let, let声明的是局部变量，因为ES6新增了块作用域的概念，所以 `for (...) {...}` 大括号里面就是一个单独的作用域，**即闭包作用域**，for循环的每次执行,都会把i的值传入块作用域内，所以for的每个循环体都有各自不同的i变量，所以输出了`1,2,3,4,5,6`

#### 2.2.2 常见的闭包例子  

最简单的一种

```js
function foo() {
  let a = 2
  function bar() {
    console.log(a)
  }
  return bar
}
const baz = foo()
baz() // 2
```

当函数可以记住并访问所在的词法作用域，即使函数名是在当前词法作用域之外执行，这就产生了闭包。  
分析一下：foo函数执行,baz函数即等同于bar函数，baz函数执行的时候，要打印2，由于baz函数本身没有变量a,向父级作用域查找，找到了a是2

```js
function foo() {
  let a = 2
  function baz() {
    console.log(a) // 2
  }
  bar(baz)
}
function bar(fn) {
  let a = 3
  fn()
}
foo();
```

baz函数访问到被定义时的作用域的变量a=2,而不是执行时的a=3

#### 2.2.3 闭包实现缓存
```js
function memorize(fn) {
  let cache = {}
  return function() {
    const args = Array.prototype.slice.call(arguments) // argumnets是伪数组，经过slice处理之后，成为了真数组
    let key = JSON.stringify(args)
    console.log(`cache`, cache[key])
    return cache[key] || (cache[key] = fn.apply(fn, args)) // 如果与之前计算的参数相同，则不执行回调函数, apply的第二个参数是个数组
  }
}

// 计算的回调函数
function add(a) {
  console.log(`add参数a`, a)
  return a + 1
}

const adder = memorize(add)

adder(1) // 打印 cache: undefined, 输出 2, 当前 cache: {'[1]'}
adder(1) // 打印 cache: 2  输出: 2  当前: cache: { '[1]': 2 }
adder(2) // 打印 cache: undefined      输出: 3  当前: cache: { '[1]': 2, '[2]': 3 }
```

ES6的写法
```js
function memorize(fn) {
  const cache = {}
  return function(...args) {  // args变成了可迭代对象，数组
    const key = JSON.stringify(args)
    return cache[key] || (cache[key] = fn.apply(fn,args))
  }
}

function add(a) {
  console.log(`add参数a`, a)
  return a + 1
}
const adder = memorize(add)

adder(1)
adder(1)
adder(2)
```

不使用apply,那么需要自己处理数组[]参数
```js
function memorize(fn) {
  const cache = {}
  return function(...args) {
    const key = JSON.stringify(args)
    return cache[key] || (cache[key] = fn(args))
  }
}

function add(a) {
  console.log(`add参数a`, a) // a是个数组，需要转换成数字
  a = Number(a.join()) // 或 parseInt(a.join())
  return a + 1
}
const adder = memorize(add)

adder(1)
adder(1)
adder(2)
```

### 2.3 闭包在模块中的应用
闭包在模块化的应用。  
以下是一个IIFE模块
```js
const MyModules = (function Manager() {
  let modules = {}
  // 定义值
  function define(name, deps, impl) {
    for (let i = 0; i < deps.length; i ++) {
      deps[i] = modules[deps[i]] 
      // modules 是空，deps[i] 全是undefined
      // modlues 不空，modules = {'bar': 23 }, deps[0] = modules[deps[0]]/modules['bar']
    }
    modules[name] = impl.apply(impl, deps)
  }
  // 取值
  function get(name) {
    return modules[name]
  }
  return {
    define,
    get
  }
})()
// define: name作为modules属性名，deps作为一个数组，impl是callback
```
调用
```js
// 定义modules对象键名是“bar”, 值是hello函数
MyModules.define( "bar", [], function() {
  function hello(who) {
    return "Let me introduct: " + who;
  }
  return {
    hello 
  }
})

// 定义modules对象键名是“foo”， 返回值是“foo”对应的值
MyModules.define( "foo", ["bar"], function(bar) {
  var hungry = "hippo";
  function awesome() {
    console.log( bar.hello( hungry ).toUpperCase() );
  }
  return {
    awesome
  }
})

const bar = MyModules.get( "bar" );
const foo = MyModules.get( "foo" );

console.log(bar.hello( "hippo" )) // Let me introduct: hippo

foo.awesome(); // LET ME INTRODUCT: HIPPO
```

## 参考

- [你不知道的javascript上闭包和作用域]()
- [JS高级程序设计第七章]()