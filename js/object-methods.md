# Object 构造器及原型上的方法

整理这些常用 api 是为了能够更好的理解与牢记

## 1. Object 构造器上的方法(Methods of the Object constructor)

### 1.1 Object.keys()

用于遍历对象，该方法会返回一个数组，该数组输出的属性顺序与 for-in 输出顺序一致

```js
const object1 = {
  a: "somestring",
  b: 42,
  c: false
}

Object.keys(object1).forEach(item => {
  console.log(object1[item])
})
// 输出: "somestring", 42, false

for (key in object1) {
  console.log(object1[key])
}
// 输出: "somestring", 42, false
```

### 1.2 Object.create()

参数：Object.create(proto, [propertiesObject]) 第二个参数可选， 是一个属性描述

`Object.create()`可以实现继承(因为可以显式指定原型)

```js
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`my name is ${this.name}, am i human ${this.isHuman}`)
  }
}
const me = Object.create(person, {
  age: {
    value: 17,
    writeable: true
  }
})
me.name = 'jack'
me.isHuman = true
me.printIntroduction() // my name is jack, am i human true
console.dir(me)
// 打印出一个对象
{
  isHuman: true,
  name:jack,
  age: 17,
  __proto__: {
    isHuman: false,
    printIntroduction: f,
    __proto__: f Object()
  }
}
// 可以看出me的原型是person,person的原型是Object
```

#### Object.create 声明无原型的空对象

```js
const methodCreateObj = Object.create({})
const methodCreateNull = Object.create(null) // 创建了一个非常干净的Object对象，没有原型proto，非常纯净
const literalCreateObj = {}
console.dir(methodCreateObj)
{
  // methodCreateObj 的原型是一个空对象，空对象的原型是Object
  __proto__: {
    __proto__: constructor: Object()
  }
}
console.dir(methodCreateNull)
{
  // No properties
}
console.dir(literalCreateObj)
{
  __proto__: constructor: Object()
}
// 可以看出Object.create({})创建的对象多了一层__proto__
```

所以我们可以使用 Object.create()方法指定自己的原型 prototype，可以用于构造函数继承，更多请看[继承与原型链](/js/inherit.md)

### 1.3 Object.defineProperty()

`Object.defineProperty(obj, prop, descriptor)`

该方法可以直接向 object 对象上定义属性，并且对属性进行一些选项设置

descriptor 可以定义以下几种属性

- configurable 是否可删除？，默认 false
- enumerable 是否可枚举，默认 false
- value 值
- writable 是否可写，默认 false  
  一个存取器属性描述符还包括下面两个重要方法，但不包含 value 属性
- get 如果没有 getter，默认是 undefined
- set 如果没有 setter，默认是 undefined

```js
const object1 = {};
// 下面这个操作：向object1对象添加'property1'属性，值为42，并且不可写
Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false // 不可写，即不可重新赋值
});
object1.property1 = 77; // throws an error in strict mode

console.log(object1.property1); // expected output: 42
console.dir(object1)
{
  property1: 42,
  __proto__: {
    constructor: f Object()
  }
}
```

使用 get 和 set 方法，存取器属性描述独有，存取器的好处是可以对传进来的值做一定处理  
下为数据属性描述与存取器描述示例

```js
var o = {}

// 添加属性，并添加数据属性描述 data property descriptor
Object.defineProperty(o, "a", {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true
})

// 添加属性，并添加存取器属性描述 accessor property descriptor
var bValue = 38
Object.defineProperty(o, "b", {
  // Using shorthand method names (ES2015 feature).
  // This is equivalent to:
  // get: function() { return bValue; },
  // set: function(newValue) { bValue = newValue; },
  get() {
    return bValue
  }, // 取值操作
  set(newValue) {
    bValue = newValue
  }, // 设置值
  enumerable: true,
  configurable: true
})
o.b // 38 b值被定义与bValue相等
// o.b和bValue是相等的，除非被重新修改

// 数据属性与存取器属性不能同时使用，即value与get()不能同时使用
Object.defineProperty(o, "conflict", {
  value: 0x9f91102,
  get() {
    return 0xdeadbeef
  }
})
// 报错信息 TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute
// 类型错误：非法属性描述，不能同时指定存取器或者value
```

存取器属性描述的一个例子

```js
function Archiver() {
  var temperature = null
  var archive = []

  Object.defineProperty(this, "temperature", {
    get() {
      console.log("get!")
      return temperature
    },
    // 为temperature设置值
    set(value) {
      temperature = value
      archive.push({ val: temperature }) // 用数组保存temperature的历史值
    }
  })

  this.getArchive = function() {
    return archive
  }
}

var arc = new Archiver()
arc.temperature // 'get!' 执行了存取器的get方法
arc.temperature = 11 // 执行了存取器的set方法
arc.temperature = 13
arc.getArchive() // [{ val: 11 }, { val: 13 }]
```

### 1.4 Object.defineProperties()

与`Object.defineProperty()`类似，但是可以定义多个属性，可以定义属性描述或者存取器描述

```js
const object1 = {}

Object.defineProperties(object1, {
  property1: {
    value: 42,
    writable: true
  },
  property2: {}
})

console.log(object1.property1) // expected output: 42
```

### 1.5 Object.assign()

Object.assign(target, ...sources) || (目标对象，源对象...)

复制一个对象的可迭代属性到目标对象上，参数为多个对象，ES6 新增

可用于浅拷贝，拓展运算符 `...` 也可以实现浅拷贝

```js
const target = { a: 1, b: 2 }
const source = { b: 4, c: 5 }

const returnedTarget = Object.assign(target, source)

console.log(target)
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget)
// expected output: Object { a: 1, b: 4, c: 5 }
```

source 对象会覆盖 target 上面的同名的属性值，没有则直接添加

另一个例子

```js
const target = {}
const source = {
  null: null,
  undefined,
  c: function() {},
  d: 3,
  [Symbol("foo")]: 233
} // null不可以用键值省略的写法，会报syntaxError
const returnedTarget = Object.assign(target, source)
// const returnedTarget = Object.assign(target, {...source})
console.log(target) // { null:null, undefined, c: function(){}, d: 3, [Symbol('foo')]: 233}
console.log(returnedTarget) // 同上
const target = {}
const v1 = "a"
const v2 = null
const v3 = undefined
const v4 = Symbol("foo")
const v5 = function() {}
const returnedTargetDiff = Object.assign(target, v1, v2, v3, v4, v5) // 参数为单个对象的情况，会忽略null,undefined,symbol,function
console.log(target, returnedTargetDiff) // {0: 'a'}  输出键为下标序号
```

对于属性值是对象的情况，拷贝的是对象的值(指针)，即无法实现深拷贝

```js
const source = {
  a: 11,
  b: {
    bb: 22
  }
}
const returnedTarget = Object.assign({}, source)
returnedTarget.b.bb = 33
console.log(source) // {a:11, b: {bb:33}}
// 直接改变了原对象的值
```

使用 JSON.parse(JSON.stringify({...}))可以实现不完整的深拷贝  
更多深浅拷贝，请看这里：[赋值与深浅拷贝](https://github.com/xblcity/blog/blob/master/article/equalwith-copy.md)

### 1.6 Object.getOwnPropertyDescriptor()

获取单个属性的描述，是否可修改，可枚举等等

```js
const obj = {
  a: 1
}
console.log(Object.getOwnPropertyDescriptor(obj, "a"))
// 输出： {configurable: true, enumerable: true, value: 1, writable: true}
```

### 1.6 Object.getOwnPropertyDescriptors()

获取多个属性的描述

### 1.7 Object.getOwnPropertyNames()

遍历对象自身属性，与 Object.keys()类似

```js
const object1 = {
  a: 1,
  b: 2,
  c: 3
}
console.log(Object.getOwnPropertyNames(object1));  // 输出数组Array: ["a", "b", "c"]
const object2 = Object.create(object1, {
  d: {
    value: 16,
    writeable: true
  }
})
console.dir(object2)
{
  d: 16,
  __proto__: {
    a: 1,
    b: 2,
    c: 3,
    __proto__: {
      constructor: f Object()
    }
  }
}
console.log(Object.getOwnPropertyNames(object2)) // ["d"]
```

类的例子(即构造函数类)

```js
class object1 {
  constructor() {
    this.a = 1 // 定义在实例上面，即通过new object1()可以得到
  }
  sayHello() {
    console.log('hello, my friend')
  }
}
class object2 extends object1 {
  constructor(args) {
    super(args)
    this.d = 4
  }
}
console.log(Object.getOwnPropertyNames(object1));  // 输出 ["length", "prototype", "name"]
console.log(Object.getOwnPropertyNames(object2));  // 输出 ["length", "prototype", "name"]
const objectInstance = new object2()
console.dir(object1)
{
  arguments: {TypeError...},
  caller: {TypeError...}
  length: 0,
  name: 'object1',
  prototype: {
    constructor: class object1,
    sayHello: f sayHello()
    __proto__: {
      constructor: f Object()
    }
  }
}
console.dir(object2)
{
  arguments: {TypeError...},
  caller: {TypeError...}
  length: 0,
  name: 'object1',
  prototype: { // object1
    constructor: class object2,
    __proto__: {
      constructor: class object1,
      __proto__: {
        constructor: f Object()
      }
    }
  }
}
console.dir(objectInstance)
object2:
{
  a:1，
  d:4,
  __proto__: { object1
    constructor: class object2
    __proto__: {
      constructor: class object1
      sayHello: f sayHello(),
      __proto__: {
        constructor: f Object()
      }
    }
  }
}
console.log(Object.getOwnPropertyNames(objectInstance));  // ["a", "d"]
```

## 2. Object 原型上上的方法(Methods of the Object prototype)

### 2.1 Object.prototype.toString()

这个方法也可以判断 js 的数据类型，比如`Object.prototype.toString.call(a)`

```js
const obj = { name: "jack" }
console.log(obj.toString()) // [object Object]
console.dir(obj.toString()) // [object Object]
const a = "1"
console.log(Object.prototype.toString.call(a)) // [object String]
console.dir(JSON.parse(obj.toString())) // SyntaxError: Unexpected token o in JSON at position 1
console.log(JSON.parse(JSON.stringify(obj))) // {name: "jack"}
```

### 2.2 Object.prototype.toLocaleString()

转换时间格式用

```js
console.log(new Date().toLocaleString()) // Sat Jul 27 2019 16:30:55 GMT+0800 (中国标准时间) 转换成 2019/7/27 下午4:30:55
```

### 2.3 Object.prototype.valueOf()

用于把对象转换成原始值，如 string...待补充

### 2.4 Object.prototype.hasOwnProperty()

判断是否是一个对象的自身属性，而不是原型 prototype 上面的属性

```js
const object1 = new Object()
object1.property1 = 42

console.log(object1.hasOwnProperty("property1")) // object1自身属性 输出: true
console.log(object1.hasOwnProperty("toString")) // object1 prototype的属性 输出: false
console.log(object1.hasOwnProperty("hasOwnProperty")) // object1 prototype的属性 输出: false
```

### 2.5 Object.prototype.isPrototypeOf()

```js
function object1() {}
function object2() {}
object1.prototype = Object.create(object2.prototype) // 赋值表达式右边返回的对象(假设为x)的prototype是object2的prototype

const object3 = new object1() // object3是object1的实例，他们两个是相等的

console.log(object1.prototype.isPrototypeOf(object3)) // expected output: true
console.log(object2.prototype.isPrototypeOf(object3)) // expected output: true
```

### 2.6 Object.prototype.propertyIsEnumerable()

属性是否可枚举

## 参考

- [MDN Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
