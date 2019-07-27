# Object构造器及原型上的方法

## Object构造器上的方法(Methods of the Object constructor)
形如这样的格式
```js
class Object {
  
}
```
本文只是介绍简单的使用

## Object.assign()
复制一个对象的可迭代属性到目标对象上，参数为多个对象  
Object.assign(target, ...sources)  
可用于浅拷贝
```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 } 
```
source对象会覆盖target上面的同名的属性值，没有则直接添加  

另一个例子
```js
const target = {}
const source = { null:null, undefined, c: function(){}, d: 3, [Symbol('foo')]: 233} // null不可以用键值省略的写法，会报syntaxError
const returnedTarget = Object.assign(target, source)
console.log(target)  // { null:null, undefined, c: function(){}, d: 3, [Symbol('foo')]: 233}
console.log(returnedTarget) // 同上
const target = {}
const v1 = 'a'
const v2 = null;
const v3 = undefined;
const v4 = Symbol('foo');
const v5 = function() {}
const returnedTargetDiff = Object.assign(target, v1, v2, v3, v4, v5) // 参数为单个值的情况，会忽略null,undefined,symbol,function
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

使用JSON.parse(JSON.stringify({...}))可以实现不完整的深拷贝  
更多深浅拷贝，请看这里：[赋值与深浅拷贝](https://github.com/xblcity/blog/blob/master/article/equalwith-copy.md)

## Object.create()
参数：Object.create(proto, [propertiesObject]) 第二个参数可选
```js
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`my name is ${this.name}, am i human ${this.isHuman}`)
  }
}
const me = Object.create(person)
me.name = 'jack'
me.isHuman = true
me.printIntroduction() // my name is jack, am i human true
console.dir(me) // {isHuman: true, name:jack, __proto__: {isHuman: false, printIntroduction: f, __proto__: Object}}
// 可以看出me的原型是person,person的原型是Object
```

Object.create与直接字面量声明一个对象有什么区别呢
```js
const methodCreateObj = Object.create({})
const literalCreateObj = {}
console.dir(methodCreateObj) // {__proto__: __proto__: constructor: Object()}
console.dir(literalCreateObj) // {__proto__: constructor: Object()}
// 可以看出Object.create({})创建的对象多了一层__proto__
```

所以我们可以使用Object.create()方法指定自己的原型prototype，可以用于构造函数继承，更多请看[继承与原型链](https://github.com/xblcity/blog/blob/master/article/inherit-prototype.md)

## Object.defineProperty()
`Object.defineProperty(obj, prop, descriptor)`
该方法可以直接向object对象上定义属性，并且对属性进行一些选项设置
descriptor可以定义以下几种属性
- configurable 是否可删除？，默认false
- enumerable 是否可枚举，默认false
- value 值
- writable 是否可写，默认false  
一个访问描述符还包括下面两个重要方法
- get 如果没有getter，默认是undefined
- set 如果没有setter，默认是undefined

```js
const object1 = {};
// 下面这个操作：向object1对象添加'property1'属性，值为42，并且不可写
Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});
object1.property1 = 77; // throws an error in strict mode

console.log(object1.property1); // expected output: 42
console.dir(object1) // {property1: 42, __proto__: Object}
``` 

使用get和set方法，存取器属性描述独有
```js
var o = {}; 

// 添加属性，并添加数据属性描述 data property descriptor
Object.defineProperty(o, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true
});

// 添加属性，并添加存取器属性描述 accessor property descriptor
var bValue = 38;
Object.defineProperty(o, 'b', {
  // Using shorthand method names (ES2015 feature).
  // This is equivalent to:
  // get: function() { return bValue; },
  // set: function(newValue) { bValue = newValue; },
  get() { return bValue; }, // 取值操作
  set(newValue) { bValue = newValue; }, // 设置值
  enumerable: true,
  configurable: true
});
o.b; // 38 b值被定义与bValue相等
// o.b和bValue是相等的，除非被重新修改

// 数据属性与存取器属性不能同时使用，即value与get()不能同时使用
Object.defineProperty(o, 'conflict', {
  value: 0x9f91102,
  get() { return 0xdeadbeef; }
});
// 报错信息 TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute
// 类型错误：非法属性描述，不能同时指定存取器或者value
```

存取器属性的一个例子
```js
function Archiver() {
  var temperature = null;
  var archive = []; 

  Object.defineProperty(this, 'temperature', {
    get() {
      console.log('get!');
      return temperature;
    },
    // 为temperature设置值
    set(value) {
      temperature = value;
      archive.push({ val: temperature }); // 用数组保存temperature的历史值
    }
  });

  this.getArchive = function() { return archive; };
}

var arc = new Archiver();
arc.temperature; // 'get!' 执行了存取器的get方法
arc.temperature = 11;  // 执行了存取器的set方法
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]

```

## Object.defineProperties()
与`Object.defineProperty()`类似，但是可以定义多个属性，可以定义属性描述或者存取器描述
```js
const object1 = {};

Object.defineProperties(object1, {
  property1: {
    value: 42,
    writable: true
  },
  property2: {}
});

console.log(object1.property1); // expected output: 42
```

## Object.getOwnPropertyNames()
遍历对象自身属性
```js
const object1 = {
  a: 1,
  b: 2,
  c: 3
}
console.log(Object.getOwnPropertyNames(object1));  // 输出数组Array: ["a", "b", "c"]
```

类的例子
```js
class object1 {
  constructor() {
    this.a = 1
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
``` 

## Object.keys()
判断是否是对象自身属性
```js
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.keys(object1)); // 输出: Array ["a", "b", "c"]
```

## Object原型上上的方法(Methods of the Object prototype)
### Object.prototype.toString()
```js
const obj = {name: 'jack'}
console.log(obj.toString()) // [object Object]
console.dir(obj.toString()) // [object Object]
console.dir(JSON.parse(obj.toString())) // SyntaxError: Unexpected token o in JSON at position 1
console.log(JSON.parse(JSON.stringify(obj))) // {name: "jack"}
```
### Object.prototype.toLocaleString()
转换时间格式用
```js
console.log(new Date().toLocaleString()) // Sat Jul 27 2019 16:30:55 GMT+0800 (中国标准时间) 转换成 2019/7/27 下午4:30:55
```

### Object.prototype.valueOf()
用于把对象转换成原始值，如string...待补充

### Object.prototype.hasOwnProperty()
判断是否是一个对象的自身属性，而不是原型prototype上面的属性
```js
const object1 = new Object();
object1.property1 = 42;

console.log(object1.hasOwnProperty('property1')); // object1自身属性 输出: true
console.log(object1.hasOwnProperty('toString')); // object1 prototype的属性 输出: false
console.log(object1.hasOwnProperty('hasOwnProperty')); // object1 prototype的属性 输出: false
```

### Object.prototype.isPrototypeOf()
```js
function object1() {}
function object2() {}
object1.prototype = Object.create(object2.prototype); // 赋值表达式右边返回的对象(假设为x)的prototype是object2的prototype

const object3 = new object1(); // object3与object1相等。。原型都是

console.log(object1.prototype.isPrototypeOf(object3)); // expected output: true
console.log(object2.prototype.isPrototypeOf(object3)); // expected output: true
```

### Object.prototype.propertyIsEnumerable()
属性是否可枚举  



- 参考 [MDN Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)