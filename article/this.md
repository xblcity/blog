# this

- this不指向函数本身也不指向函数的词法作用域
- this时在函数被调用时发生的绑定，它指向谁完全取决于函数在哪里被调用
- this具有语法作用域的特征
- 在函数被调用时，会创建一个活动记录(执行上下文)，这个记录会包含函数在哪里调用(调用栈)，函数的调用方式，传入的参数等信息，this是这个记录的一个属性，会在函数的执行过程中用到

### this的绑定规则
**1.默认绑定**
在全局作用域调用函数，函数的this是window(在严格模式为undefined)
```js
function foo() {
  console.log(this)
}
function bar() {
  foo()
}
bar() // 输出为window
```

**2.隐式绑定**
当函数引用具有上下文对象时，隐式绑定规则会把this绑定到这个上下文对象上
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
`apply()`方法第二个参数是一个**数组**，数组里面是调用函数时要传递的参数
```js
function foo(arg1, arg2, arg3) { // arg1,arg2,arg3对应的分别是**参数数组**的第一项，第二项，第三项
  console.log(arguments) // [1,2,{name: 'xbl'}] arguments为伪数组
  console.log(arg1) // 1
  console.log(arg2) // 2
  console.log(arg3) // {name: 'xbl'}
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
const obj = {}
foo.call(obj, 1, 2, {name: 'xbl'})
```

`bind()`传入参数与`call()`相同，不过bind返回的是一个函数
```js
function foo(a,b) {
  console.log('a:', a, 'b:', b) // a: 2 b: 3
}
// 使用bind进行柯里化 
const bar = foo.bind({}, 2,3)
bar()
```
ES6实现bind方法 ??
```js
Function.prototype.bind = function(...rest1) {
  const self = this
  const context = rest1.shift()
  return function(...rest2) {
    return self.apply(context, [...rest1, ...rest2])
  }
}
```

把 `null` 或者 `undefined` 作为this绑定的对象传入 `call,apply,bind`, 这些值 在调用时会被忽略，实际应用的仍然是**默认规则**
使用null可能会产生副作用，可以传空对象{}
js中创建空对象最简单的方法时 Object.create(null), 这个和{}很像，但是不会创建Object.prototype这个委托，比{}更空
```js
function foo(a,b) {
  console.log('a:', a, 'b:', b)
}
const empty = Object.create(null)
foo.apply(empty, [2,3])  // a:2 b:3
```

**4.new绑定**
- js中，构造函数只是使用new操作符时被调用的普通函数
- 内置对象如 Number,Object等等在内的所有构造函数都可以用new调用，这种调用方式称为构造函数调用
- 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”

*使用new调用函数时，会自动执行以下操作* 
- 创建一个新对象
- 新对象的prototype指向构造函数
- 新对象赋给当前this
- 执行构造函数
- 如果函数没有返回其他对象，new表达式中的函数会自动返回这个新对象

优先级：new > apply/call/bind > 隐式绑定 > 默认绑定

## this词法
- ES6新增一种特殊函数类型：箭头函数，箭头函数无法使用上述四条规则，而是根据外层(函数或者全局)作用域(词法作用域)来决定this
- 箭头函数的this无法被修改
- 箭头函数没有构造函数constructor,不可以使用new 调用
```js
function foo() {
  // 返回一个箭头函数
  return a => {
    // this继承自foo()
    console.log(this.a) // 输出2
  }
}
const obj1 = {
  a: 2
}
const obj2 = {
  a: 3
}
const bar = foo.call(obj1) // foo的this是obj1
bar.call(obj2) // bar的this是obj2
```

定时器
```js
function foo() {
  const self = this
  setTimeout(function() {
    console.log(self) // obj
    console.log(this) // window 因为setTimeout不是箭头函数，并且是由window调用的
  }, 1000)
}
const obj = {a:1}
foo.call(obj)
```

对象中属性值为箭头函数
```js
var a = 'hello'
const obj = {
  a: 'world',
  foo: () => {
    console.log(this.a)
  }
}
obj.foo() // 输出'hello'
```

this的一个例子
```js
var a = 20 
// 用const a = 20 无法得到想要的输出,因为此时a没有被绑定到window对象上
const obj = {
  a: 40,
  foo: () => {
    console.log(this.a) // 词法作用域，this是window对象，输出20

    function func() {
      this.a = 60  // 语法作用域，this现在不确定
      console.log(this.a) // this不确定，但是this.a确定，是60
    }

    func.prototype.a = 50  // func的prototype的a值是50，除非func本身没有a属性
    return func
  }
}
const bar = obj.foo() // 执行foo函数，并返回func函数，this是window
// 如果foo不是箭头函数，输出的是40
bar() // 执行bar函数，但是指向的堆与func函数一样, 60
new bar() // 60
```
