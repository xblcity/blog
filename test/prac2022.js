/*
 * 练习测试用 Test 2022
 */

// ======= THIS 篇  =======
// ===  bind基础用法

// const bar = bindFunc.bind({ aa: 'aa' }, 2, 3)
// bar()

// function bindFunc(a, b) {
//     console.log("函数bincFunc a", a, "b", b, this)
// }

// === 使用 cal 模拟 bind 方法，返回一个可绑定this的函数

// Function.prototype.bind1 = function (...rest) {
//     const self = this // 隐式绑定，后面执行apply必须通过函数调用
//     const context = rest.shift()
//     return function (...rest1) {
//         return self.apply(context, [...rest, ...rest1]) // 改变this指向
//     }
// }

// const bar1 = bindFunc1.bind1({ aa: 'aa' }, 2, 3)
// bar1(4, 5)

// function bindFunc1(...rest) {
//     console.log("函数bincFunc rest", ...rest)
// }

// === this做了哪些事

// function Animal(name) {
//     this.name = name
// }

// Animal.prototype.say = function () {
//     console.log('hha')
// }

// const dog = new Animal('qiqi')
// dog.say()

// 1. 创建一个对象
// 2. 把对象的prototype属性指向构造函数的prototype
// 3. this指向当前的对象
// 4. 若构造函数没有返回值，则返回当前对象

// === 箭头函数

// 箭头函数内部作用域不会去创建this，内部的this会向上/外部作用域进行查找，如果外层没有this变量，则会继续向上查找，直到window作用域。

// ===== 手动实现APPLY, CALL , BIND 函数 =====

// === Call 的实现
// Function.prototype._call = function (context) {
//     // 如果不是函数调用的_call方法，就不存在this值
//     if (typeof this !== 'function') {
//         throw new TypeError('Error')
//     }
//     const args = [...arguments].slice(1)
//     const mySymbol = Symbol()
//     context[mySymbol] = this
//     const result = context[mySymbol](...args)
//     delete context[mySymbol]
//     return result
// }

// const foo = {
//     name: 'lili'
// }

// function bar(...args) {
//     console.log('this预期为foo', this)
//     console.log('接收了参数有', args)
// }

// bar._call(foo, 12, 23)

// === Apply的实现

// Function.prototype._apply = function (context = window) {
//     if (typeof this !== 'function') {
//         throw new TypeError('Error')
//     }
//     const args = [...arguments].slice(1)
//     const mySymbol = Symbol()
//     context[mySymbol] = this
//     const result = context[mySymbol](args)
//     delete context[mySymbol]
//     return result
// }

// const foo1 = {
//     name: 'huhu'
// }

// function bar1() {
//     console.log('this预期为foo1', this)
//     console.log('接收了参数是一个数组', arguments[0])
// }

// bar1._apply(foo1, ['23', '34'])

// === Bind函数实现
// Function.prototype._bind = function (context, ...rest) {
//     if (typeof this !== 'function') {
//         throw new TypeError('Error')
//     }
//     const that = this
//     return function (...rest1) {
//         that.apply(context, [...rest, ...rest1])
//     }
// }

// var foo2 = {
//     name: 'cc'
// }

// function bar2() {
//     console.log(arguments)
// }

// const baz = bar2._bind(foo2, '22', '33')
// baz('44')

// ===== 深拷贝篇 =====

// 使用JSON.parse(JSON.stringify(变量对象))可以实现简单的深拷贝，原理是讲对象转化成JSON字符串，再把字符串格式化成JSON对象。
// 缺点是无法对函数等对象无法使用JSON.stringify进行格式化转化

// === 实现JS简单的深拷贝
// 原理是遍历对象及数组，直到里面全部是基本数据类型，然后再去复制

// function checkType(target) {
//     return Object.prototype.toString.call(target).slice(8, -1)
// }
// function clone(target) {
//     let targetType = checkType(target)
//     let result
//     if (targetType === 'Array') {
//         result = []
//     } else if (targetType === 'Object') {
//         result = {}
//     } else {
//         result = target
//     }
//     for (let i in target) {
//         let value = target[i]
//         if (checkType(value) === 'Object' || checkType(value) === 'Array') {
//             result[i] = clone(value)
//         } else {
//             result[i] = value
//         }
//     }
//     return result
// }

// const cc = {
//     name: 'xbl',
//     info: {
//         age: 17,
//         desc: {
//             gender: 'male'
//         }
//     }
// }

// const dd = clone(cc)
// dd.info.desc.gender = 'female'
// console.log(cc.info.desc.gender)

// ===== 防抖与节流函数 =====
// 防抖原理是当一个操作频繁触发时，只采用最后一次触发的动作 debounce
// 节流则是把需要频繁触发的操作，降低触发频率 throttle
// const throttle = (fn, interval) => {
//     let last = 0
//     return (...args) => {
//         let now = Date.now()
//         if (now - last >= interval) {
//             let last = now
//             fn(...args)
//         }
//     }
// }

// const betterScroll = throttle(() => {
//     console.log('触发了滚动事件', 1000)
// })

// document.addEventListener('scroll', betterScroll)

// === 定时器版本的throttle

// const throttle1 = (fn, interval) => {
//     let timerId
//     return (...args) => {
//         timerId = setTimeout(function () {
//             timerId = null
//             fn.apply(this, args)
//         }, interval)
//     }
// }

// const debounce = (fn, delay) => {
//     let timer
//     return function foo(...args) {
//         if (timer) {
//             clearTimeout(timer)
//         }
//         timer = setTimeout(() => {
//             fn.apply(this, args)
//             clearTimeout(timer)
//         }, delay)
//     }
// }


// ==== 前端面试之道 this 测试篇

// function foo () {
//     console.log(this.a)
// }

// var a = 1
// foo()

// const obj = {
//     a: 2,
//     foo: foo
// }

// obj.foo() // 

// const c = new foo()

// ==== 闭包

// function a() {
//     const a1 = 2
//     window.b = function() {
//         console.log(a1)
//     }
// }

// const a1 = 3
// a()
// b()

// === 使用闭包处理定时器问题  立即执行函数

// for (var a = 1; a <= 6; a++) {
//     (function(j) {
//         setTimeout(() => {
//             console.log(j)
//         })
//     })(a)
// }

// for(let i = 1; i <=6; i++) {
//     setTimeout(() => {
//         console.log(i)
//     })
// }

// 再写一遍深拷贝

// function clone(obj) {
//     function checkType(value) {
//         return Object.prototype.toString.call(value).slice(8, -1)
//     }
//     let result
//     if (checkType(obj) !== 'Object') {
//         result = {}
//     } else if (checkType(obj) == 'Array') {
//         result = []
//     } else {
//         result = obj
//     }
//     for (i in obj) {
//         const value = obj[i]
//         if (checkType(value) === 'Object' || checkType(value) === 'Array') {
//             result[i] = clone(value)
//         } else {
//             result[i] = value
//         }
//     }
//     return result
// }

// 变量提升问题

// console.log(a)
// console.log(b)

// var a = 1
// function b() {
//     console.log('my name is')
// }

// class 类与构造函数

// class Person {}
// console.log(Person instanceof Function)

// 使用组合构造模式和原型模式
// function Person(name, age) {
//     this.name = name
//     this.age = age
// }
// Person.prototype.say = function() {
//     console.log(this.name)
// }

// const li = new Person('lily', 18)
// li.say()


//  进行继承方法1

// function Man(...value) {
//     Person.call(this,...value)
// }
// Man.prototype = new Person()

// const jacky = new Man('jack', 17)
// jacky.say()
// console.log(jacky instanceof Person)

// 上述使用构造函数来指定prototype, 函数执行浪费性能,，进行继承方法2

// function Man(...value) {
//     Person.call(this,...value)
// }

// Man.prototype = Object.create(Person.prototype, {
//     constructor: {
//         value: Man,
//         enumerable: true,
//         writeable: true,
//         configurable: true,
//     }
// })

// const jacky = new Man('jack', 17)
// jacky.say()

// console.log(jacky instanceof Person)

// === ES6的知识之数组方法===暂时不做
// === Promise相关

// new Promise((resolve, reject) => {
//     console.log('构造函数Promise执行')
//     resolve('success')
// })
// console.log('finish')

// new Promise((resolve, reject) => {
//     resolve(3)
// }).then(res => {
//     console.log(res)
// })
// Promise.resolve('1').then(res => {
//     console.log(res)
//     return 2
// }).then(res => {
//     console.log(res)
// })

// async function test() {
//     return '1'
// }
// console.log(test())

// === 一些使用Promise及异步的例子

// setTimeout(function() {
//     console.log(1)
// })
// new Promise((resolve, reject) => {
//     console.log(2)
//     resolve(3)
// }).then((val) => {
//     console.log(val)
// })
// console.log(4)
// 遇到setTimeout, 把它加入到宏任务中。
// Promise立即执行，打印2，返回了3值，
// 遇到then是微任务，把它挂载到微任务列表。
// 执行最后一行代码，打印4。
// 接着执行Promise.then(),打印3。
// 第一个宏任务执行完毕，执行第二个宏任务，打印1

// 使用async-await
// async function async1() {
//     console.log('async1 start')
//     await async2()
//     console.log('async1 end')
// }

// async function async2() {
//     console.log('async2 start')
// }

// async1()
// console.log('start')
// async是立即执行的Promise函数，所以先打印'async1 start',
// await async2()等于是 new Promise(new Promise(async2())).then(console.log('async1 end'))
// async2函数执行打印出async2 start，紧接着向下执行同步代码，打印'start'
// 最后执行微任务'async1 end'

// 执行结果：
// async1 start
// async2
// start
// async1 end
// timer2
// timer3
// timer1

// 执行结果
// script start
// async1 start
// promsie1
// script end
// async1 success
// async1 end

// 从浏览器输入URL到页面渲染完毕发生了什么
// 缓存解析
// 域名解析：DNS解析
// 向服务器发送请求
// TCP连接：3次握手
// 服务器接到请求
// 服务器响应请求
// 数据传输
// 浏览器拿到数据，解析HTML，构建DOM树
// CSSOM和DOM树构建完成后会生成render树

// 手写 apply 函数
// Function.prototype._apply = function (context, ...rest) {
//   if (typeof this !== 'Function') {
//     throw new TypeError('非函数调用，类型错误！')
//   }
//   const mySymbol = Symbol()
//   context[mySymbol] = this
//   const result = context[mySymbol](rest)
//   delete context[mySymbol]
//   return result
// }

// 实现 bind

// Function.prototype._bind = function(context, ...rest) {
//   if (typeof this !== 'Function') {
//     throw new TypeError('非函数调用，类型错误！')
//   }
//   const that = this
//   return function () {
//     that.apply(context, rest.concat(...arguments))
//   }
// }

// 手写深拷贝
// const checkType = function (value) {
//   return Object.prototype.call(value).slice(8, -1)
// }
// function clone(obj) {
//   let result
//   const type = checkType(obj)
//   if (type === 'Object') {
//     result = {}
//   } else if (type === 'Array') {
//     result = []
//   } else {
//     return result
//   }
//   for (key in target) {
//     const value = target[key]
//     const valueType = checkType(value)
//     if (valueType === 'Object' || valueType === 'Array') {
//       result[key] = clone(value)
//     } else {
//       result[key] = target[key]
//     }
//   }
//   return result
// }

// 构造类
// 工厂模式

// function createAnimal(name, age) {
//   var o = new Object
//   o.name = name
//   o.age = age
//   o.sayName = function() {
//     console.log(this.name)
//   }
//   return o
// }
// var aDog = createAnimal('li', 3)
// aDog.sayName()

// 构造函数模式
// 原型模式
// 使用构造函数加原型模式

// function Animal(name,age) {
//   this.name = name
//   this.age = age
// }
// Animal.prototype.sayName = function() {
//   console.log(this.name)
// }

// const aDog = new Animal('li', 3)
// aDog.sayName()
// console.log(Animal.prototype === aDog.__proto__)

// 继承

// 原型继承
// 父类
// function Animal(name) {
//   this.name = name
// }
// Animal.prototype.say = function() {
//   console.log(`my name is ${this.name}`)
// }
// // 子类
// function Dog(name, age) {
//   this.name = name
//   this.age = age
// }

// Dog.prototype = new Animal()
// Dog.prototype.constructor = Dog
// Dog.prototype.sayName = function () {
//   console.log(this.name)
// }
// 构造函数继承

// 寄生组合继承
// function B() {}
// function Animal(cateName) {
//   this.cateName = cateName
// }
// function Dog(cateName, name, age) {
//   Animal.call(this,cateName)
//   this.name = name
//   this.age = age
// }
// Dog.prototype = Object.create(Animal.prototype, {
//   constructor: {
//     value: B
//   }
// })
// const aDog = new Dog('li', 'c', 2)
// console.log(aDog instanceof B)
// console.log(aDog instanceof Dog)
// console.log(aDog instanceof Animal)

// 冒泡排序，从小往大排。时间复杂度 O(n方)
// function bubbleSort(arr) {
//   const len = arr.length
//   for (let i =0; i < len; i ++) {
//     for (j = 0; j <= len-i-1; j ++ ) {
//       if (arr[j] > arr[j+1]) {
//         let temp = arr[j+1]
//         arr[j+1] = arr[j]
//         arr[j] = temp
//       }
//     }
//   }
//   return arr
// }

// 快排算法，时间复杂度O(nlog2n)，因为用到了递归，空间复杂度较高
// 升序排序
// 比较函数
// const quickSort = function () {
//   function compare(a, b) {
//     if (a === b) {
//       return 0
//     }
//     return a > b ? -1 : 1
//   }
//   // 换位函数
//   function swap(array, a, b) {
//     [array[a], array[b]] = [array[b], array[a]]
//   }
//   // 分治函数
//   function partition(array, left, right) {
//     const middle = array[Math.floor((right + left) / 2)]
//     let i = left
//     let j = right
//     while ( i <= j) {
//       while (compare(array[i], middle) === -1) {
//         i++
//       }
//       while (compare(array[i], middle) === 1) {
//         j++
//       }
//       if (i < j) {
//         swap(array, i, j)
//       }
//     }
//     return i
//   }
//   function quick(arr, left, right) {
//     let index
//     if (arr.length > 1) {
//       index = partition(array, left, right)
//       if (left < index -1) {
//         quick(array, left, index -1)
//       }
//       if (index < right) {
//         quick(array, index, right)
//       }
//     }
//     return array
//   }
//   return function quickSort(array) {
//     return quick(array, 0, array.length -1)
//   }
// }

// 二分查找
// instanceof的实现

// function instance_of(L,R) {
//   let prototype = R.prototype
//   while(true) {
//     if (L.__proto__ === null) {
//       return false
//     } else if (L.__proto__ === prototype) {
//       return true
//     }
//     L = L.__proto__
//   }
// }
// const a = {}
// instance_of(a, Object)

// 寄生组合继承
// function Animal(name, age) {
//   this.name = name
//   this.age = age
// }
// Animal.prototype.say = function() {
//   console.log(this.name)
// }

// function Dog(name, age, like) {
//   parent.call(this, name, age)
//   this.like = like
// }
// Dog.prototype.bark = function() {
//   console.log(this.like)
// }
// Dog.prototype = Object.create(Animal.prototype, {
//   constructor: {
//     value: Dog
//   }
// })

