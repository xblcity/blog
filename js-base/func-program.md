# 高阶函数

高阶函数就是输入参数里有函数，或者输出是函数的函数。

## 1.函数作为参数

如果你用过 setTimeout、setInterval、ajax 请求，那么你已经用过高阶函数了，这是我们最常看到的场景：回调函数，因为它将函数作为参数传递给另一个函数。

比如 ajax 请求中，我们通常使用回调函数来定义请求成功或者失败时的操作逻辑：

```js
$.ajax('/request/url', function(result) {
  console.log('请求成功！')
})
```

在 Array、Object、String 等等基本对象的原型上有很多操作方法，可以接受回调函数来方便地进行对象操作。这里举一个很常用的 Array.prototype.filter() 方法，这个方法返回一个新创建的数组，包含所有回调函数执行后返回 true 或真值的数组元素。

```js
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present']

var result = words.filter(function(word) {
  return word.length > 6
}) // 输出: ["exuberant", "destruction", "present"]
```

回调函数还有一个应用就是钩子，如果你用过 Vue 或者 React 等框架，那么你应该对钩子很熟悉了，它的形式是这样的：

```js
function foo(callback) {
  // ... 一些操作
  callback()
}
```

## 2.函数作为返回值

经常看到的高阶函数的场景是在一个函数内部输出另一个函数

```js
function foo() {
  return function bar() {}
}
```

利用闭包来保持着作用域

```js
function add() {
  var num = 0
  return function(a) {
    return (num = num + a)
  }
}
var adder = add()

adder(1) // 输出: 1
adder(2) // 输出: 3
```

### 2.1 柯里化(Currying)

柯里化（Currying），又称部分求值（Partial Evaluation），是把接受多个参数的原函数变换成接受一个单一参数（原函数的第一个参数）的函数，并且返回一个新函数，新函数能够接受余下的参数，最后返回同原函数一样的结果。

核心思想是把多参数传入的函数拆成单（或部分）参数函数，内部再返回调用下一个单（或部分）参数函数，依次处理剩余的参数。

理解：处理一个参数，返回一个函数，再处理一个参数，再返回一个函数...

柯里化有 3 个常见作用：

1.参数复用 2.提前返回

```js
function add(x) {
  return function(y) {
    return function(z) {
      return x + y + z
    }
  }
}

add(1)(2)(3) // 6

// 等同于
const firstFunc = add(1) // 传入x参数
const secondFunc = firstFunc(2) // 传入y参数
secondFunc(3) // 传入z参数3，返回6
secondFunc(6) // 传入z参数3，返回9
```

柯里化函数是把一个有 n 个参数的函数变成只有一个参数的函数

`Add = (x,y,z) => x+y+z` 变成了 `curryAdd = x => y => z => x+y+z`

简单说，函数柯里化就是对高阶函数的降阶处理，缩小适用范围，创建一个针对性更强的函数。

### 2.2 偏函数

偏函数是创建一个调用另外一个部分（参数或变量已预制的函数）的函数，函数可以根据传入的参数来生成一个真正执行的函数。其本身不包括我们真正需要的逻辑代码，只是根据传入的参数返回其他的函数，返回的函数中才有真正的处理逻辑比如：

```js
var isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}

var isString = isType('String')
var isFunction = isType('Function')
```

在 react 中高阶组件就是偏函数的一种表现形式

平时我们用的节流(throttle)，防抖(debounce)也是偏函数

举个例子理解两者的区别

```js
// 函数柯里化
const add = (a) => (b) => (c) => a + b + c
add(1)(2)(3)

// 偏函数
const add = (a) => (b, c) => a + b + c
add(1)(2, 3)
```

## 参考

- [JS 设计模式](https://www.imooc.com/read/38/article/478)
- [偏函数与柯里化函数的区别](https://segmentfault.com/q/1010000008626058)
