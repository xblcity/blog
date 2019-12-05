# JS细碎知识点

- [判断数据类型](#判断数据类型)
- [判断数据是否为空](#判断数据是否为空)
- [对象的普通属性和可计算属性](#对象的普通属性和可计算属性)
- [多个箭头函数在一行](#多个箭头函数在一行)
- [JS里面属性名加双方括号[[]]是什么意思](#JS里面属性名加双方括号[[]]是什么意思)

## 判断数据类型

### 6种基本数据类型(基本值类型)

```js
typeof 12 === "number" // number类型没有length属性
typeof 'a' === "string"
typeof true === "boolean"
typeof undefined === "undefined"
typeof null === "object" // 比较特殊
typeof Symbol('a') === "symbol"
```

其他比较方法

```js
Number.isNaN(1) // false
Object.prototype.toString.call('a') // [object String]
Object.prototype.toString.call(2) // [object Number]
```

### 引用类型

instanceof 运算符用于检测**构造函数**(一般首字母大写)的 prototype 属性,是否出现在某个实例对象的原型链上。

比如，检测Array的prototype属性 是否出现在 实例对象 `[1,2]`的原型链上 

由于引用类型的prototype尽头是Object，所以`引用类型 instanceof Object`结果永远为true
```js
var a = {}
a instanceof Object // true
{} instanceof Object // 会报错, why
[1] instanceof Array 
[1] instanceof Object
var b = f => f
b instanceof Object
b instanceof Function
```

其他比较方法

```js
Array.isArray([1]) // true Array构造函数的实例属性
```

## 对象的普通属性和可计算属性

普通属性可以通过`obj.propertyName`访问，也可以通过`obj[propertyName]`访问，后者propertyName必须是字符串。

可计算属性名字用`[]`包裹,访问也只能通过`obj[propertyBName]`访问，而不能通过obj.propertyName访问。是ES6新增的语法。

```js
const b = Symbol('b')
const c = 'my'
const obj = {
  a: 1,
  [b]: 2,
  [c + 'luffy']: 3
}
console.log(obj.a) // 1
console.log(obj.b) // undefined,可计算属性以obj.xx 的方式访问不到
console.log(obj['a']) // 1
console.log(obj[b]) // 2
console.log(obj[c + 'luffy']) // 3
```  

所有属性都具备**数据属性描述符**(data property descriptor)
或者**存取器属性描述符**(accessor property descriptor) 二者选一  
通过`Object.defineProperty()` 可以修改或者重新定义属性的一些特征
```js
const obj = {}
Object.defineProperty(obj, 'name', {
  value: 'jack',
  writable: true,
  enumerable: true,
  configurable: true
})
Object.defineProperty(obj, 'activity', {
  get() { return bValue; }, // 取值操作
  set(newValue) { bValue = newValue; }, // 设置值
  enumerable: true,
  configurable: true
})
```

## 多个箭头函数在一行

```js
const fooFunc = (firstNum) => (secondNum) => (thirdNum) => {
  console.log(firstNum, secondNum, thirdNum)
}
const fooFunc1 = fooFunc(1)
console.log(fooFunc1)
  // (secondNum) => (thirdNum) => {
  //   console.log(firstNum, secondNum, thirdNum)
  // }
const fooFunc2 = fooFunc1(2)
console.log(fooFunc2)
  // (thirdNum) => {
  //   console.log(firstNum, secondNum, thirdNum)
  // }
fooFunc2(3)
```

变量firstNum, secondNum为什么会缓存呢？？  
fooFunc是函数柯里化的应用？

## JS里面属性名加双方括号[[]]是什么意思

在控制台打印某一构造函数，经常会出现加双方括号的属性，双方括号代表这是JavaScript引擎内部使用的属性/方法，可以帮助debug（点一下[[FunctionLocation]]就能跳到定义，点一下[[Scopes]]就能查看闭包），但是正常JavaScript代码是取不到这些属性的。[es6中对象属性双方括号是什么意思](https://segmentfault.com/q/1010000015611521/)