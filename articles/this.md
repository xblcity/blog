# this

- this不指向函数本身也不指向函数的词法作用域
- this是在函数被调用时发生的绑定，也就是说，函数未调用之前是没有this的，它指向谁完全取决于函数在哪里被调用
- this具有语法作用域的特征
- 在函数被调用时，会创建一个活动记录(执行上下文)，这个记录会包含函数在哪里调用(调用栈)，函数的调用方式，传入的参数等信息，this是这个记录的一个属性，会在函数的执行过程中用到，上下文不存在，this也就不存在了

### this的绑定规则
**1.默认绑定**  
在全局作用域调用函数，函数的this是window(在严格模式为undefined)  
没有在全局作用于下调用函数，应用的是默认绑定，即window
```js
function foo() {
  console.log(this) // window
}
function bar() {
  console.log(this) // window
  foo()
}
bar()
```

**2.隐式绑定**  
当函数引用具有上下文对象时，隐式绑定规则会把this绑定到这个上下文对象上  
即谁调用的函数，谁就是函数上下文中的this，在下例中，是obj
```js
function foo() {
  console.log(this) // obj对象
  console.log(this.a) // 2
}
const obj = {
  a: 2,
  foo: foo
}
obj.foo() // 输出为obj对象，即{a:2,foo:foo}
```

**3.显示绑定**  
通过`call(...)` `apply(... )` `bind(...)`方法  
`apply()`方法第一个参数是**一个对象**，在调用函数时将this绑定到这个对象上，因为直接指定this的绑定对象，称之为显示绑定
```js
function foo() {
  console.log(this) // obj对象
}
const obj = {
  a: 2
}
foo.call(obj) // foo函数执行
```
`apply()`方法第二个参数是一个**数组**，数组里面是调用函数时要传递的参数，函数执行时接收的参数是数组的一个一个项，而非数组
```js
function foo(arg1, arg2, arg3) { // arg1,arg2,arg3对应的分别是**参数数组**的第一项，第二项，第三项
  console.log(arguments) // [1,2,{name: 'xbl'}] arguments为伪数组
  console.log(arg1) // 1
  console.log(arg2) // 2
  console.log(arg3) // {name: 'xbl'}
}
// 使用ES6展开运算符展开参数更方便，展开运算符结合函数参数使用
function foo(...args) {
  console.log(...args)  // 1 , 2, name: 'xbl'
  console.log(...arguments)  // 1 , 2, name: 'xbl'
  console.log(args) // 数组 [1,2, name: 'xbl']
  console.log(arguments) // 伪数组
}
const obj = {}
foo.apply(obj, [1,2,{name: 'xbl'}])
// foo.apply(obj, 1) 传递非数组会报错
```

`call()`方法与`apply()`不同的是，可以有2-n个参数，第2-n个参数是调用函数要传的参数
```js
function foo(arg1, arg2, arg3) {
  console.log(arguments) // [1,2,{name: 'xbl'}] arguments为伪数组
  console.log(arg1) // 1
  console.log(arg2) // 2
  console.log(arg3) // {name: 'xbl'}
}
// 也可以使用ES6展开运算符
function foo(...args) {
  console.log(...args)  // 1, 2, {name: 'xbl'}
  console.log(args) // 数组：[1, 2, {name: 'xbl'}]
}
const obj = {}
foo.call(obj, 1, 2, {name: 'xbl'})
```

`bind()`传入参数与`call()`相同，不过bind返回的是一个函数
```js
function foo(a,b) {
  console.log('a:', a, 'b:', b) // a: 2 b: 3
}
// 使用bind进行柯里化？？
// 函数柯里化是指 函数对传入的参数做处理，每处理一个参数，返回一个函数，是函数式编程的重要组成部分
const bar = foo.bind({}, 2,3)
bar()
```
ES6实现bind方法
```js
Function.prototype.bind1 = function(...rest1) { // rest1变成可迭代对象，即数组
  const self = this
  const context = rest1.shift() // context是函数的第一个参数,即this对象，shift()会直接改变原对象
  return function(...rest2) {  
    return self.apply(context, [...rest1, ...rest2])
  }
}
function foo(a,b,c) {
  console.log('a:', a, 'b:', b, 'c:', c)
}
const bar = foo.bind1({}, 2, 3)
bar(4)
// 执行：foo.bind1({}, 2, 3), 
// 返回 function(...rest2) { return foo.apply({}, [2, 3, ...rest2])} 这个函数
// 执行：bar(4)
// 返回 foo.apply({}, [2,3,4]) 函数的执行结果
```

把 `null` 或者 `undefined` 作为this绑定的对象传入 `call,apply,bind`, 这些值 在调用时会被忽略，实际应用的仍然是**默认规则**
使用null可能会产生副作用，可以传空对象{}
js中创建空对象最简单的方法时 Object.create(null), 这个和{}很像，但是不会创建Object.prototype这个委托，比{}更空，即没有原型链
```js
function foo(a,b) {
  console.log('a:', a, 'b:', b) // a:2 b:3
  console.log(this) // {} 空对象
}
const empty = Object.create(null)
foo.apply(empty, [2,3])
```

**4.new绑定**
- js中，构造函数只是使用new操作符时被调用的普通函数
- 内置对象如 Number,Object等等在内的所有构造函数都可以用new调用，这种调用方式称为构造函数调用
- 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”

*使用new调用函数时，会自动执行以下操作* 
- 创建一个新对象
- 新对象的原型(__proto__/prototype)指向构造函数的prototype
- 新对象赋给当前this
- 执行构造函数
- 如果函数没有返回其他对象，new表达式中的函数会自动返回这个新对象

```js
function Ancestor(name) {
  this.name = name
}
const descendant = new Ancestor('jack')
console.dir(descendant)
// Ancestor
{
  name: 'jack',
  __proto__: { 
    constructor: f Ancestor(name) {
      arguments: null,
      length: 1,
      name: 'Ancestor', ...
    },
    __proto__: {
      constructor: f Object(), ...
    }
  }
}
```

优先级：new > apply/call/bind > 隐式绑定 > 默认绑定

## this词法
- ES6新增一种特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据外层(函数或者全局)作用域(词法作用域)来决定this
- 箭头函数的this无法被直接修改，但是可以通过改变外层函数的this指向来间接改变箭头函数里的this  
- 箭头函数没有构造函数constructor,不可以使用new 调用
- 定义箭头函数this即外部环境的this, 即`function foo(){ const a = () => {console.log(this)}}`箭头函数this与foo上下文环境的this一致
- 回调函数箭头函数内部的this是箭头函数父函数的父函数的this，与普通箭头函数this表现不一致
```js
function foo() {
  function bar() {
    console.log(`bar函数this`, this) // window
    const b = () => { 
      console.log(`箭头函数this`,this) // window，即与父函数this一致
    }
    b()
  }
  bar()
  return () => {
    console.log(`return箭头函数this`,this) 
  }
}
const obj1 = {
  a: 2
}
const obj2 = {
  a: 3
}
const bar = foo.call(obj1)
bar() // 箭头函数打印obj1，因为父函数foo的this是obj1
bar.call(obj2) // 箭头函数无法使用显示绑定，this还是obj1
const baz = foo.call(obj2)
baz() // 箭头函数打印obj2
```

多个嵌套函数  
```js
function foo() {
  console.log(`foo内部`,this) // outObj，显式绑定
  function bar() {
    console.log(`bar内部`,this) // innerObj，隐式绑定
    function baz() {
      console.log(`baz1`, this) // window，默认绑定
      function baz1() {
        console.log(`baz2`, this) // window，默认绑定
      }
      baz1()
    }
    baz()
  }
  const innerObj = {inner: 2, bar}
  return innerObj.bar() // 执行bar函数，return可以不用加
}
const outObj = {outObj: 1}
foo.call(outObj)
```
可以看出，每个函数的this都是独立的，无法继承自父函数，默认规则绑定的是window  
获取父函数的this，可以使用`that = this`

对象中属性值为箭头函数
```js
var a = 'hello'
const obj = {
  a: 'world',
  b: this,
  foo: () => {
    console.log(this.a)
  }
}
console.log(obj.b)  // window，，对象是没有上下文环境也就是this的，，只能继承
obj.foo() // hello, 隐式绑定, foo this是obj外面的this，即window
```

this的一个例子
```js
var a = 20 
// 用const a = 20 无法得到想要的输出,因为此时a没有被绑定到window对象上
const obj = {
  a: 40,
  // 应用默认绑定，this是window
  foo: () => {
    console.log(this.a) // 词法作用域，obj外面的this, this是window对象，输出20

    function func() {
      this.a = 60  // 语法作用域，this现在不确定
      console.log(this.a) // this不确定，但是this.a确定，是60
    }

    func.prototype.a = 50  // func的prototype的a值是50
    return func
  }
} 
const bar = obj.foo() // 执行foo函数，并返回func函数
bar() // 执行bar函数  60
new bar() // 60
```


回调箭头函数里面的this，与父函数的父函数this一致
```js
function bar() {
  function foo(callback) {
    callback()
  }
  const innerObj = {foo}
  innerObj.foo(() => {console.log(`箭头函数`,this)}) // outObj，与bar上下文this一致
  innerObj.foo(function() {console.log(`普通函数`,this)}) // window
}
const outObj = {a:1}
bar.call(outObj)
```

定时器
```js
function foo() {
  const self = this
  window.setTimeout(function() { 
    console.log(self) // obj
    console.log(this) // window 隐式绑定/默认绑定
  }, 1000)
  window.setTimeout(() => { 
    console.log(this) // obj，回调函数的this
  }, 2000)
}
const obj = {a:1}
foo.call(obj) // foo this 是 obj
```

普通箭头函数
```js
function foo() {
  function bar() {
    const a = () => {
      console.log(`箭头函数`, this) // innerObj, 即bar的上下文环境
    }
    a()
  }
  const innerObj = {b: 2, bar}
  innerObj.bar()
}
const outObj = {a: 1}
foo.call(outObj)
```

这里再看另外一个回调函数的例子  
```js
function foo() {
  console.log(`foo this是`, this) // outObj，显式绑定
  const innerObj = {b: 2, bar}
  function bar(callback) { 
    console.log(`bar的this是`, this) // 两个都是innerObj，隐式绑定
    callback()
  }
  innerObj.bar(function() { 
    console.log(`bar 内部 非箭头函数`, this) // window，默认绑定
  }) 
  innerObj.bar(() => { 
    console.log(`bar 内部 箭头函数`, this) // outObj，箭头回调函数this与父函数(bar)的父函数(foo)一致
  })
}
const outObj = {a:1}
foo.call(outObj)
```

箭头函数没有构造器constructor，不能用于构造函数，如
```js
const Message = (text) => {
  this.text = text
}
const myMessage = new Message('hello')
// Uncaught TypeError: Message is not a constructor
const myMessageInfo = Message('hi')
console.log(myMessageInfo) // undefined
```

因为this的问题，箭头函数要慎用，  
构造函数不能使用箭头函数，因为prototype无法指定

参考[什么时候不使用javascript](https://juejin.im/post/5d4770ecf265da03dd3d5642#comment)



### 参考
- [你不知道的javascript上第二部分this和对象原型](https://github.com/yygmind/Reading-Notes/blob/master/%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript%E4%B8%8A%E5%8D%B7.md)
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20&%20closures/README.md#you-dont-know-js-scope--closures)
- [JavaScript 设计模式](https://www.imooc.com/read/38)
- [什么时候不使用箭头函数](https://juejin.im/post/5d4770ecf265da03dd3d5642#comment)
