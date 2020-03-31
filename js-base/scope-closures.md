# 作用域与闭包

## 1. 作用域

### 1.1 词法作用域&语法作用域

词法作用域 (静态作用域) 是指作用域是由书写代码时的位置决定的

语法作用域 (动态作用域) 是由代码运行时的上下文决定的。

闭包的实现就是基于词法作用域。this 的实现是基于语法作用域。

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

如果按照 js 的词法作用域，输出的是 1，即 foo 函数的作用域链是在定义的时候已经被确定了，foo 内部没有 value 变量，则向上寻找全局的 value 变量。

如果是语法作用域，输出的是 2，foo 内部没有 value 变量，向上寻找 bar 函数内部有没有 value 变量，找到了所以输出 2。

### 1.2 JS 作用域类型

JS 作用域分为函数作用域，块作用域，全局作用域三种

#### 1.2.1 函数作用域

```js
function foo(a) {
  var b = 2
  // 一些代码
  function bar() {
    // ...
  }
  // 更多的代码
  var c = 3
}
```

全局作用域只有一个变量：foo

foo 函数作用域内部：变量 b, bar, a, c

#### 1.2.2 块作用域

##### try...catch

```js
try {
  new Error("发生错误")
} catch (err) {
  console.log(err) // Error: 发生错误
}
```

catch 分句会创建块作用域，在 catch 语句外拿不到 err 变量

##### let, const

let 为其声明的变量隐式的劫持了所在的作用域

```js
var foo = true
if (foo) {
  let bar = 2
  console.log(bar) // 2
}
console.log(bar) // ReferenceError: bar is not defined
```

let 声明的变量不会提升，但是声明依然会被收集。let 不会被初始化，var 会被初始化为 undefined

```js
console.log(a) // ReferenceError: Cannot access 'a' before initialization
let a
```

let 用于 for 循环

```js
for (let i = 1; i < 10; i++) {
  console.log(i)
}
console.log(i) // Reference Error
```

const 与 let 表现行为一致，唯一不同的是 const 声明的变量无法被重新赋值，const 声明的引用类型不可以重新赋值(即改变指针)，但是可以可以增删改属性(如对象), 也可以增删改项(如数组)

#### 1.2.3 全局作用域

在浏览器中全局作用域是 window，在全局作用域声明的变量可以在任何地方访问到

##### 变量提升与函数提升

var 声明的变量存在变量提升，函数声明存在提升，并优先于变量提升，但是函数表达式并不会提升，比如：

```js
b() // b函数执行了
console.log(a) // undefined
c() // Uncaught ReferenceError: Cannot access 'c' before initialization

var a = 1
function b() {
  // 函数声明
  console.log("b函数执行了")
}
const c = function() {
  // 函数表达式
  console.log("c函数执行了")
}
```

### 1.3 执行环境，作用域与作用域链

作用域链的存在与执行环境密不可分。

关键词：**执行环境(execution context)** **变量对象(variable object)** **活动对象(activation object)**

**执行环境(execution context)**，有时简称为环境(context)。或者叫做**上下文环境(context)**。是 JS 中一个重要概念。执行环境定义了 **变量** 或 **函数有权访问的其他数据(比如 this, arguments,callee 等)** 每个执行环境都有一个与之关联的**变量对象(variable object)**，**执行环境**中定义的所有变量和函数都保存在这个**变量对象**中。虽然我们编写的代码无法访问这个的对象，但解析器在处理数据是会在后台使用它。

全局执行环境是最外围的一个执行环境，根据 JS 实现所在的**宿主环境**不同，表示执行环境的对象也不一样，在 Web 浏览器中，全局执行环境被认为是 window 对象。因此所有的全局变量和函数都是作为 window 对象的属性和方法创建的。

某个执行环境的所有代码执行完毕后，该环境被**销毁**，保存在其中的所有变量和函数定义也随之销毁(全局执行环境直到应用程序退出——比如关闭网页浏览器时才被销毁)。

每个**函数**都有自己的**执行环境**，当执行流进入一个函数是，函数的环境就会被推入一个**环境栈**中，而在**函数执行之后**，**栈将其环境弹出**，把控制权返回给之前的**执行环境**。

当代码在一个**执行环境**中执行时，会创建变量对象的一个**作用域链**。作用域链的用途，就是可以保证变量和函数可以被**执行环境**有效访问。作用域的前端，始终是当前执行的代码所在环境的变量对象，如果这个是函数，则将其**活动对象(activation object)**作为**变量对象(variable object)**。活动对象在最开始时值包含一个变量。即 arguments 对象(这个对象在全局环境中是不存在的)。**作用域链**的下一个变量对象来自**外部环境**，再下一个变量对象则来自下一个外部环境。这样，一直延续到全局执行环境。全局执行环境放入变量对象始终都是作用域链的最后一个对象。

标识符解析是沿着作用域链一级一级的搜索标识符的过程。搜索过程始终从作用域链的前端开始，然后逐级的向后回溯，直到找到标识符为止(如果找不到标识符，会报错)。

```js
var color = "blue"

function changeColor() {
  if (color === "blue") {
    color = "red"
  } else {
    color = "blue"
  }
}
changeColor()
```

在上面这个简单的例子中，**函数**changeColor 的作用域链包含两个对象：它自己的变量对象(其中定义这个 arguments 对象),和全局环境的变量对象。可以在函数内部访问到变量 color，就是因为可以在这个作用域俩中找到它。

## 2. 闭包

闭包：**函数**在自己定义的词法作用域以外的地方执行，但是可以记住并访问到所在的词法作用域。**闭包是针对于函数而言**

上述概念比较抽象，可以理解为执行完的函数其**执行环境**应该被销毁了，但是由于**其他函数引用了这个函数的内部变量**，导致其执行环境还存在，这就形成了闭包。

了解闭包，需要知道**作用域链**和**函数执行机制**(即变量查找过程和函数执行环境的存在)

### 2.1 函数执行机制与上下文环境

由于 js 函数执行的原理，当函数被调用时，会被推送到一个执行栈中，形成自己的执行环境(执行环境中包含定义的变量与函数)，函数执行完则出栈，因而函数的执行环境也被销毁

那么如何获取执行完毕的函数内部的变量呢，即如何让函数执行的执行环境不被销毁呢，这就要通过闭包了，**闭包使得在执行的函数与应当被销毁的父函数产生了关联，使得作用域一直存在**

```js
function foo() {
  let count = 1
  return function bar() {
    count++
    console.log(count) // 输出2
  }
}
const addCount = foo() // 赋值，addCount指向引用类型bar()
addCount()
```

上述例子，bar 引用了父级函数 foo 里面的 count 变量，所以在函数 foo 执行过后,count 变量没有被立即销毁，我们通过 addCount 函数又可以获取到 foo 内部变量 count 的值，即 bar 函数被定义的地方。

闭包阻止了 foo 函数的销毁，大量的使用闭包会造成 js 内存无法及时得到释放。

### 2.2 理解闭包的例子

#### 2.2.1 常见的闭包例子

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

在上例中：foo 函数执行,baz 函数即等同于 bar 函数，baz 函数执行的时候，要打印 2，由于 baz 函数本身没有变量 a,向父级作用域查找，找到了 a 是 2

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
foo()
```

上例中，baz 函数访问到被定义时的作用域的变量 a=2,而不是执行时的 a=3。也间接证明了 JS 遵循词法作用域(静态作用域)的规则。

#### 2.2.2 定时器与循环

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message)
  }, 1000)
}
wait("Hello, closure!")
```

wait 函数在执行完毕后，局部变量 message 本应被立即销毁，但是由于 timer 函数引用了 message 变量，使得 wait 函数的执行环境依然存在。使得 timer 能够访问到 message 变量，也就形成了闭包。

深入到引擎的内部原理中，内置的工具函数 setTimeout(..) 持有对一个参数的引用，这个参数也许叫作 fn 或者 func，或者其他类似的名字。引擎会调用这个函数，在例子中就是内部的 timer 函数，而词法作用域在这个过程中保持完整。这就是闭包。也就是说，只要使用了定时器函数，必然会形成闭包。

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
// 输出5次6
```

这段代码在运行时会以每秒一次的频率输出五次 6。

为什么呢，又要涉及到 js 的执行机制了，由于 js 是单线程引擎，所以 js 会首先执行同步队列里的代码，然后才会执行异步任务(涉及了 js 宏任务与微任务)。也即是说延迟函数的回调会在循环结束时才执行。

上述例子中，js 会首先执行 for 循环，执行完毕后，i 已经变成了 6，这时候在执行定时器，定时器现在作用域链查找到的 i 值为 6。

是尽管循环中的五个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个 i。

为了能够打印出 1~6。我们需要更多的闭包作用域，特别是在循环的过程中每个迭代都需要一个闭包作用域。

如何打印出 1~6 呢，这里我们会想到给`setTimeout`内部储存一个 i 变量，每次执行`setTimeout`都访问自己独一无二的变量。再 ES6 之前，我们这样做：  
使用 IIFE(Immediately Invoked Function Expression),即立即调用函数表达式

```js
for (var i = 1; i <= 5; i++) {
  ;(function(j) {
    console.log(j) // 1,2,3,4,5,6 立即打印
    setTimeout(function timer() {
      console.log(j) //1,2,3,4,5,6 隔一秒打印一次
    }, i * 1000)
  })(i)
}
```

这里，我们使用了一个立即执行函数，形成闭包作用域，每次 for 循环时，立即执行函数被执行，i 变量传入立即执行函数内部，每个立即执行函数都会保存输入自己作用域内部的 i 变量，所以当定时器执行时，输出的就是各自匿名函数内部的 j 变量，即`1,2,3,4,5,6`了。

也就是上述例子存在了**两个闭包**，一个是 IIFE，一个是定时器函数。

在 ES6 之后，我们就不用这么麻烦了，

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i) //1,2,3,4,5,6
  }, i * 1000)
}
```

我们使用了 ES6 新增的声明变量的方式 let, let 声明的是局部变量，因为 ES6 新增了块作用域的概念，所以 `for (...) {...}` 大括号里面就是一个单独的作用域，**即闭包作用域**，for 循环的每次执行,都会把 i 的值传入块作用域内，所以 for 的每个循环体都有各自不同的 i 变量，所以输出了`1,2,3,4,5,6`

#### 2.2.3 闭包实现缓存

```js
function memorize(fn) {
  let cache = {}
  return function() {
    const args = Array.prototype.slice.call(arguments) // argumnets是伪数组，经过slice处理之后，成为了真数组
    let key = JSON.stringify(args) // 把参数作为cache对象的键，首先将其转换成字符串
    console.log(`cache`, cache[key])
    return cache[key] || (cache[key] = fn.apply(fn, args))
    // 如果与之前计算的参数相同，则返回值。否则将计算结果赋值给cache对象的一个键，apply的第二个参数是个数组
  }
}

// 计算的回调函数
function add(a) {
  console.log(`add参数a`, a)
  return a + 1
}

const adder = memorize(add)

adder(1) // 打印 cache: undefined, console.log: 2, 当前 cache: {'[1]'}
adder(1) // 打印 cache: 2  console.log: 2  当前: cache: { '[1]': 2 }
adder(2) // 打印 cache: undefined      console.log: 3  当前: cache: { '[1]': 2, '[2]': 3 }
```

ES6 的写法

```js
function memorize(fn) {
  const cache = {}
  return function(...args) {
    // args变成了可迭代对象，数组
    const key = JSON.stringify(args)
    return cache[key] || (cache[key] = fn.apply(fn, args))
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

不使用 apply,那么需要自己处理数组[]参数

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

以下是一个 IIFE 模块

```js
const MyModules = (function Manager() {
  let modules = {}
  /**
   * 定义模块中的变量
   * @param {String} name 键名
   * @param {Array} deps 参数数组
   * @param {Function} impl this指向
   */
  function define(name, deps, impl) {
    for (let i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]]
      // modules 是空，deps[i] 全是undefined
      // modules 不空，modules = {'bar': 23 }, deps[0] = modules[deps[0]]/modules['bar']
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
```

调用

```js
// 定义modules对象键名是“bar”, 值是hello函数
MyModules.define("bar", [], function() {
  function hello(who) {
    return "Let me introduce: " + who
  }
  return {
    hello
  }
})

// 定义modules对象键名是“foo”， 返回值是“foo”对应的值
MyModules.define("foo", ["bar"], function(bar) {
  var hungry = "hippo"
  function awesome() {
    console.log(bar.hello(hungry).toUpperCase())
  }
  return {
    awesome
  }
})

const bar = MyModules.get("bar")
const foo = MyModules.get("foo")

console.log(bar.hello("hippo")) // Let me introduce: hippo

foo.awesome() // LET ME INTRODUCE: HIPPO
```

闭包可以用来保存变量，缓存变量，但是过多的闭包会使得内存无法及时得到释放

## 参考

- [你不知道的 javascript 上闭包和作用域]()
- [JS 高级程序设计第四章]()
- [JS 高级程序设计第七章]()
