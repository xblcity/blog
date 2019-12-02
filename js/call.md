# call,apply,bind手动实现

## 1. call的实现需要运用隐式绑定this的原理，即`obj.bar()`

实现传入上下文环境
```js
Function.prototype._call = function(context = window) {
  // 因为bar._call调用的_call函数，所以_call函数的this就是bar函数
  console.log(this) // bar函数
  // 为context这个对象增加一个_fn属性，用于存放bar函数
  context._fn = this
  context._fn()
  delete context._fn
}

var foo = {
  value: 1
}
function bar() {
  console.log(this.value)
}
bar._call(foo)
```

实现传入上下文环境并且传入参数
```js
Function.prototype._call = function(context = window) {
  context._fn = this
  var args = [...arguments].slice(1) // 去除_call的第一个参数即上下文环境对象，剩下的即参数
  context._fn(...args) // 参数传递给_fn，使用扩展运算符把数组转换成逗号分隔的参数序列
  delete context._fn
}

var foo = {
  value: 1
}
function bar(a, b) {
  console.log(`参数是`,[...arguments])
  console.log(`参数a,b是`,a,b)
  console.log(a + b + this.value) // 6  2+3+1
}
bar._call(foo, 2, 3)
```

## 2. 实现apply
```js
Function.prototype._apply = function(context = window) {
  context._fn = this
  var args = [...arguments].slice(1)
  context._fn(...args) // 需要把参数处理成逗号分隔的参数序列
  delete context_fn
}

var foo = {
  value: 1
}

function bar(a,b,c) {
  console.log(`a,b,c`, a, b, c)
}

bar._apply(foo, [1,2,3])
```

## 3. 实现bind  
bind用于创建一个新的函数，参数和call传参方式相同  
bind可以理解为函数式编程的一个例子，bind属于高阶函数(因为返回了一个函数)，也属于偏函数(不同的参数值，可以返回不同的函数)

作为偏函数使用的例子
```js
// 返回参数
function list() {
  return [...arguments]
}

// 对参数求和
function addArguments(arg1, arg2) {
  return arg1 + arg2
}

// 创建一个函数，它拥有预设参数列表
var leadingList = list.bind(null, 1)
// 创建一个函数，它拥有预设的第一个参数
var leadingAdd = addArguments.bind(null, 1)

var list2 = leadingList() // [1]
var list3 = leadingList(2,3,4) // [1,2,3,4]

var result2 = leadingAdd(5) // 1+5=6
var result3 = leadingAdd(3,10) // 1+3=4，第二个参数会被忽略，因为addArguments只设置了两个参数
```

bind可以配合setTimeout的第一个参数使用，实现自定义this的绑定

### 实现bind另一种方式

```js
// bind函数需要返回一个新的函数，用于自行调用
Function.prototype._call = function(context) {

  return function() {

  }
}

var foo = {
  value: 1
}

function bar(...args) {
  console.log('参数为', args) // args为数组
}

var baz = bar._bind(foo, 4,5,6)
baz()
baz(7,8,9)
```

## 参考
- [JavaScript基础专题之手动实现call、apply、bind](https://juejin.im/post/5d1f1cc9f265da1bc64be2c8)
- [MDN-bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)