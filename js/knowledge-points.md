# JS细碎知识点

- [判断数据类型](#判断数据类型)
- [判断数据是否为空](#判断数据是否为空)
- [对象的普通属性和可计算属性](#对象的普通属性和可计算属性)
- [多个箭头函数在一行](#多个箭头函数在一行)
- [JS里面属性名加双方括号[[]]是什么意思](#JS里面属性名加双方括号[[]]是什么意思)
- [关于return关键字](#关于return关键字)
- [switch-case](#switch-case)

## 判断数据类型

### 7种基本数据类型(基本值类型)

```js
typeof 12 === "number" // number类型没有length属性
typeof 'a' === "string"
typeof true === "boolean"
typeof undefined === "undefined"
typeof null === "object" // 比较特殊
typeof Symbol('a') === "symbol"
bigint // ES10 暂时没用过 在number类型后面加 n 
const b = 10n
typeof b // "bigint"
```

其他比较方法

```js
Number.isNaN(1) // false
Object.prototype.toString.call('a') // [object String]
Object.prototype.toString.call(2) // [object Number]
```

### 引用类型

instanceof 运算符用于检测**构造函数**(一般首字母大写)的 prototype 属性,是否出现在某个实例对象的原型链上。

比如，`[1,2] instanceof Array` 检测Array的prototype属性 是否出现在 数组 `[1,2]`的原型链上 

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

## 判断数据是否为空

对于后端传来的数据，经常会有null, [], {}这种情况，需要对其做非空判断

```js
// 传来的数据 {a: null}
const receivedData = {a: null}
const {a = {}, b = {}} = receivedData
const {a1} = a // Uncaught TypeError: Cannot destructure property 'a1' of 'a' as it is null.
const {a1} = a || {} // 可以正常执行
const {b1} = b // 可以正常执行
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
  // 123
```

上述函数fooFunc是高阶函数的一种，即柯里化函数，每次只接受一个参数，并返回一个函数

需要三次调用才能返回最终的结果

变量firstNum, secondNum为什么会缓存呢？这里用到了闭包的知识，因为`console.log(firstNum, secondNum, thirdNum)`持续引用了这几个变量，导致fooFunc1, fooFunc2执行环境被没有被及时销毁。

## JS里面属性名加双方括号[[]]是什么意思

在控制台打印某一构造函数，经常会出现加双方括号的属性，双方括号代表这是JavaScript引擎内部使用的属性/方法，可以帮助debug（点一下[[FunctionLocation]]就能跳到定义，点一下[[Scopes]]就能查看闭包），但是正常JavaScript代码是取不到这些属性的。[es6中对象属性双方括号是什么意思](https://segmentfault.com/q/1010000015611521/)

## 关于return关键字

```js
function abc () {
  if (a === 1) {
    if (b === 2) {
      if (c === 3) {
        return c
      }
    } else {
      return b
    }
  }
}
let a = 1, b = 2, c = 3
abc() // 3
let a = 1, b = 3, c = 3
abc() // 3
let a = 3
abc() // undefined

```

## switch-case

```js
const userInfo = {
  isNew: false,
  newID: '123',
  oldID: '456'
}

const getValue = function (type) {
  switch(type) {
    case 'new':
      return {
        newID: userInfo.newID
      }
    case 'old':
      return {
        oldID: userInfo.oldID
      }
    default:
      return {}
  }
}
getValue('new') // {newID: "123"}

const getValue = function (type) {
  switch(type) {
    case 'new':
      if(userInfo.isNew) {
        return {
          newID: userInfo.newID
        }
      }
    case 'old':
      if(!userInfo.isNew) {
        return {
          oldID: userInfo.oldID
        }
      }
    default:
      return {}
  }
}
getValue('new') // {oldID: "456"}

// 对于在case里面嵌套的语句，需要在case一级break或者return
const getValue = function (type) {
  switch(type) {
    case 'new':
      if(userInfo.isNew) {
        return {
          newID: userInfo.newID
        }
      }
      break
    case 'old':
      if(!userInfo.isNew) {
        return {
          oldID: userInfo.oldID
        }
      }
      break
    default:
      return {}
  }
}
getValue('new') // undefined

const getValue = function (type) {
  switch(type) {
    case 'new':
      if(userInfo.isNew) {
        return {
          newID: userInfo.newID
        }
      }
      return false
    case 'old':
      if(!userInfo.isNew) {
        return {
          oldID: userInfo.oldID
        }
      }
      return false
    default:
      return {}
  }
}
getValue('new') // false
getValue('old') // {oldID: "456"}
```