# 闭包和作用域

## 闭包的实现
我们来看一下闭包是怎样一个概念：函数在自己定义的词法作用域以外的地方执行，但是可以记住并访问到所在的词法作用域。这跟普通的函数有什么区别呢？  
普通函数在执行完后，就被销毁了，而有闭包存在的函数，执行完之后，不会被销毁。因此，闭包形成的上下文环境也会一直存在  
想要认识闭包，必须要知道两个概念，**作用域和函数的执行机制！**

### 词法作用域&语法作用域
词法作用域(静态作用域)是指作用域是由书写代码时的位置决定的，语法作用域(动态作用域)是由代码运行时的上下文决定的。闭包的实现就是基于词法作用域。this的实现是基于语法作用域。
```js
let value = 1
function foo() {
  console.log(value) // 1
}
function bar() {
  let value = 2
  foo()
}
```
这里我们看到foo函数是在bar函数内部调用执行的，但是是在bar函数外部声明的，如果按照js的词法作用域，输出的是1，即foo函数的作用域链是在定义的时候已经被确定了，foo内部没有value变量，则向上寻找全局的value变量    
如果是语法作用域，输出的是2，foo内部没有value变量，向上寻找bar函数内部有没有value变量，找到了所以输出2。

### 函数执行机制与上下文环境
由于js函数执行的原理，当函数被调用时，会被推送到一个执行栈中，形成自己的上下文环境，函数执行完则出栈，因而函数内部的变量/上下文环境也理解销毁    
那么如何获取执行完毕的函数内部的变量呢，即如何让函数执行的上下文环境不被销毁呢，这就要通过闭包了
```js
function foo() {
  let count = 1
  return function bar() {
    count ++
    console.log(count) // 输出2
  }
}
const addCount = foo() // 赋值，引用类型赋值的是指针
addCount()
```
这里我们可以看到foo函数执行的时候，返回了一个函数bar，而这个函数引用了父级函数foo里面的count变量，所以在函数foo执行过后,count变量没有被立即销毁，我们通过addCount函数又可以获取到foo内部变量count的值，即bar函数被定义的地方。闭包阻止了foo函数的销毁，大量的使用闭包会造成js内存无法及时得到释放。  

### 闭包的例子

#### 经典的for循环
```js
for (var i = 1; i <= 5; i++) {
  setTimeout( function timer() {
    console.log(i)
  }, i * 1000)
}
// 输出5次6
```
我们的本意值设置一个定时器，每次循环打印当前的i，但是我们发现打印了5个6，为什么呢，又要涉及到js的执行机制了，由于js是单线程引擎，所以js会首先执行同步队列里的代码，然后才会执行异步任务，上述例子中，js会首先执行for循环，执行完毕后，i已经变成了6，这时候在执行定时器，定时器现在内部寻找i变量，找不到，再向父作用域里寻找i变量(即全局作用域),哦，找到了i,值为6，`console.log`打印一下  

如何打印出1~6呢，这里我们会想到给`setTimeout`内部储存一个i变量，每次执行`setTimeout`都访问自己独一无二的变量。再ES6之前，我们这样做：
```js
for (var i = 1; i <=5; i++) {
  (function(j) {
    setTimeout( function timer() {
      console.log(j) //1,2,3,4,5,6
    }, i*1000)
  })(i)
}
```
这里，我们使用了一个立即执行函数，即**闭包作用域**，不知道立即执行函数的小伙伴，可以先去了解一下，每次for循环时，立即执行函数被执行，i变量传入立即执行函数内部，每个立即执行函数都会保存输入自己作用域内部的i变量，所以当定时器执行时，输出的就是各自匿名函数内部的j变量，即`1,2,3,4,5,6`了。 

在ES6之后，我们就不用这么麻烦了，
```js
for (let i = 1; i <= 5; i++) {
  setTimeout( function timer() {
    console.log(i) //1,2,3,4,5,6
  }, i * 1000)
}
```
我们使用了ES6新增的声明变量的方式let, let声明的是局部变量，因为ES6新增了块作用域的概念，所以 `for (...) {...}` 大括号里面就是一个单独的作用域，**即闭包作用域**，for循环的每次执行,都会把i的值传入块作用域内，所以for的每个循环体都有各自不同的i变量，所以输出了`1,2,3,4,5,6`

#### 常见的闭包例子
```js
function foo() {
  let a = 2
  function bar() {
    console.log(a)
  }
  return bar
}
const bar = foo()
baz() // 2
```
当函数可以记住并访问所在的词法作用域，即使函数名是在当前词法作用域之外执行，这就产生了闭包。我们来分析一下：foo函数执行,baz函数即等同于bar函数，baz函数执行的时候，要打印2，由于baz函数本身没有变量a,向父级作用域查找，找到了a是2
```js
function foo() {
  let a = 2
  function baz() {
    console.log(a) // 2
  }
  bar(baz)
}
function bar(fn) {
  fn()
}
foo();
```
我们来分析一下：foo函数执行，内部执行bar函数，bar函数内部执行baz函数，baz函数要打印a,自身没有，向上寻找，找到了，打印2，这里我们看到，bar函数是在foo外部执行的，但是却访问到了foo内部的变量，这个引用就叫闭包

#### 闭包实现缓存
```js
function memorize(fn) {
  let cache = {}
  return function() {
    const args = Array.prototype.slice.call(arguments) // argumnets是伪数组，经过slice处理之后，成为了真数组
    let key = JSON.stringify(args)
    console.log(`cache`, cache[key])
    return cache[key] || (cache[key] = fn.apply(fn, args)) // 如果与之前计算的参数相同，则不执行回调函数
    // apply的第二个参数是个数组
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
  return function(...args) {
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

不使用apply,使用解构和拓展运算符
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

### 闭包在模块中的应
说了这么多闭包的例子，有哪些我们平常可以用到的闭包呢，这里，我们说一下模块化的应用。
> 待更。。

### 参考
- [你不知道的javascript上闭包和作用域]()