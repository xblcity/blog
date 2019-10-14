# call,apply,bind实现

call的实现需要运用隐式绑定this的原理，即`obj.bar()`

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

实现apply
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

实现bind  
bind用于创建一个新的函数，参数和call传参方式相同  
```js
// bind函数需要返回一个新的函数，用于自行调用
```

## 参考
- [JavaScript基础专题之手动实现call、apply、bind](https://juejin.im/post/5d1f1cc9f265da1bc64be2c8)