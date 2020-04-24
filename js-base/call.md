# call, apply, bind手动实现

## 1. call的实现需要运用隐式绑定this的原理，即call的调用者当做this传递进去

先实现传入上下文环境

```js
Function.prototype._call = function(context) {
  // this是调用者，非函数调用抛出错误
  // 隐式绑定原理 foo.call()
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }

  context = context || window
  // 为context这个对象增加一个_fn临时属性，用于存放bar函数
  // 如果context已经有_fn这个属性，会出问题，应该用symbol
  context._fn = this
  const result = context._fn()
  delete context._fn
  return result
}

var foo = {
  value: 1
}
function bar() {
  console.log(this.value)
}

// 测试
bar._call(foo)
```
上面的实现有两个问题
- 无法传递参数
- 函数本身含有_fn属性

改进

```js
Function.prototype._call = function(context = window) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 生成一个唯一值
  const mySymbol = Symbol();
  context[mySymbol] = this
  const args = [...arguments].slice(1) // 去除_call的第一个参数即上下文环境对象，剩下的即参数
  const result = context[mySymbol](...args) // 参数传递给_fn，使用扩展运算符把数组转换成逗号分隔的参数序列
  delete context[mySymbol]
  return result
}

var foo = {
  value: 1
}
function bar(a, b) {
  console.log(`参数是`,[...arguments])
  console.log(`参数a,b是`, a, b)
  console.log(a + b + this.value) // 6  2+3+1
}
bar._call(foo, 2, 3)
```

## 2. 实现apply

```js
Function.prototype._apply = function(context = window) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const mySymbol = Symbol();
  context[mySymbol] = this
  const args = [...arguments].slice(1) // args经过slice(1)之后是传入的那个数组
  let result
  // 处理参数和 call 有区别
  if (args[0]) {
    result = context[mySymbol](...args[0])
  } else {
    result = context[mySymbol]()
  }
  delete context[mySymbol]
  return result
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

```js
// bind函数需要返回一个新的函数，用于自行调用
Function.prototype._bind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 保证返回的函数执行时this不能丢失
  const _this = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  return function() {
    return _this.apply(context, args.concat(...arguments)) // 对参数进行拼接
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

### 补充一下关于偏函数

bind可以理解为函数式编程的一个例子，bind属于高阶函数(因为返回了一个函数)，也属于偏函数(不同的参数值，可以返回不同的函数)

偏函数使用的例子
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
var list4 = leadingList(5,6) // [1,5,6]

var result2 = leadingAdd(5) // 1+5=6
var result3 = leadingAdd(3, 10) // 1+3=4，第二个参数会被忽略，因为addArguments只设置了两个参数
var result4 = leadingAdd(7, 9) // 1+7=8，第二个参数会被忽略，因为addArguments只设置了两个参数
```

bind可以配合setTimeout的第一个参数使用，实现自定义this的绑定，摘自`MDN`

```js
function LateBloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

// 在 1 秒钟后声明 bloom
LateBloomer.prototype.bloom = function() {
  window.setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function() {
  console.log('I am a beautiful flower with ' +
    this.petalCount + ' petals!');
};

var flower = new LateBloomer();
flower.bloom();  // 一秒钟后, 调用 'declare' 方法
```

## 参考

- [前端面试之道](https://juejin.im/book/5bdc715fe51d454e755f75ef/section/5bdd0d8e6fb9a04a044073fe)
- [MDN-bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)