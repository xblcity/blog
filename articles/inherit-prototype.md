# 继承与原型链

## 继承的几种方式

### 构造函数实现类
```js
function Animal(name) {
  this.name = name
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}
const anAnimal = new Animal('animal gaga')
// new操作符：创建一个新对象obj{}, obj的prototype指向Animal, obj赋给this，执行构造函数，返回新对象obj
```
```js
console.log(anAnimal) 
Animal:  // anAnimal构造器(constructor)是Animal
{
  name: 'animal gaga', 
  __proto__: { // Animal的prototype
    say: function() {}, 
    constructor: function Animal(name){}, // Animal的原型的构造器是Animal
    __proto__: { // Animal原型的原型，指向了引用类型Object
      constructor: Object, ... 
    }
  }
}

console.log(anAnimal.prototype) // undefined
console.log(anAnimal.__proto__) // {say: function() {}, constructor: function Animal(name){}, __proto__: {constructor: Object, ...} }
console.log(Animal.prototype) // {say: function() {}, constructor: function Animal(name){}, __proto__: {constructor: Object, ...} }
// 因为Animal显式定义了prototype。对于没有显式定义prototype的用chrome浏览器封装的__proto__可以访问
```
可以看出，anAnimal/Animal的原型指向一个对象，而这个对象具有的constructor又指向了Animal  
new操作符对构造出的实例对象进行了 prototype 绑定  
**使用new调用函数时，会自动执行以下操作** 
- 创建一个新对象
- 新对象的原型(__proto__)指向构造函数的prototype
- 新对象赋给当前this
- 执行构造函数
- 如果函数没有返回其他对象，new表达式中的函数会自动返回这个新对象

### 1.原型链继承(原型链直接指向父类构造函数)
```js
function Animal(name) {
  this.name = name
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}
function Dog(name, age) {
  this.name = name
  this.age = age
}

Dog.prototype = new Animal()
// 为什么不用 Dog.prototype = Animal.prototype呢？
// 如果用了，那么两者共享一个prototype,改变Dog的prototype也会改变Animal的prototype
Dog.prototype.constructor = Dog
Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`)
}

const aDog = new Dog('hanhan', 6)
console.log(aDog)
// Dog: 
// {
//   name: 'hanhan', 
//   age: 6, 
//   __proto__: { // Dog的原型 包含了 Animal
//     bark: f(), 
//     construcotr: f Dog(), // Dog原型的构造器是Dog
//     name: undefined, 
//     __proto__: { // Dog原型Animal 的原型
//       say: f(), 
//       constructor: f Animal()
//       __proto__: { // Animal 原型的原型 是引用类型Object
//         constructor: Object,
//         ...
//       }
//     }
//   }
// }
```
上述继承模式还有一个缺陷就是。。。

### 2.构造函数窃取(内部执行构造函数，只继承实例属性，但无原型链继承)
构造函数窃取，又称构造函数借用，经典继承，在子类型的构造函数内部调用父类的构造函数
```js
function Animal(cateName) {
  this.cateName = cateName
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}
function Dog(cateName, name, age) {
  Animal.call(this, cateName) 
  // 当执行 new Dog()创建实例时，实例赋给this, Animal函数执行，里面的this变成了new Dog()的实例，参数name,age也会被传递给Animal函数
  // 实际上执行的时候，做了下面动作
  // this.cateName = name
  this.name = name
  this.age = age
}

const aDog = new Dog('lovely animal','hanhan', 6)
// aDog prototype 指向Dog
console.log(aDog)
{
  name: 'hanhan',
  cateName: 'lovely animal',
  age: 6,
  __proto__: {
    constructor: f Dpg() {
      name: 'Dog' // 可以看到，Dog继承了Animal的属性
    },
    __proto__: {
      constructor: f Object()
    }
  }
}
```
缺点是每次创建Dog的实例，都会执行Animal构造函数，并且没有继承Animal原型上面的方法

### 3.组合继承(构造函数与原型链组合)
组合继承又称伪经典继承，指的是将原型链和借用构造函数的技术组合发挥二者之长的一种继承模式。思路是：使用原型链实现对**原型属性和方法**的继承，而通过借用构造函数来实现对**实例属性**的继承
```js
function Animal(cateName) {
  this.cateName = cateName
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}

function Dog(cateName, name, age) {
  Animal.call(this, cateName) // 第一次调用Animal函数
  // new Dog() 的时候，this指向Dog实例对象
  // 等于执行了 this.cateName = cateName
  this.name = name
  this.age = age
}
Dog.prototype = new Animal() // Dog实例可以直接调用Animal，prototype上的方法，这是第二次调用Animal函数
Dog.prototype.constructor = Dog  // 把原型上的构造器指向自己
Dog.prototype.bark = function() {
  console.log(`i'm dog,my name is ${this.name} i'm barking`)
}
const aDog = new Dog('lovely animal', 'erha', 7)
const anAnimal = new Animal('cute animal')
aDog.bark() // i'm dog,my name is erha i'm barking
aDog.say()  // my name is erha,,调用原型的原型上面的方法
```
```js
console.log(aDog)
Dog: {
  age: 7,
  cateName: 'lovely animal',
  name: 'erha',
  __proto__: Animal {
    bark: f(),
    cateName: undefined,
    constructor: f Dog(),
    __proto__: {
      say: f(),
      constructor: f Animal(),
      __proto__: {
        constructor: f Object()
      }
    }
  }
}
console.log(anAnimal)
Animal: {
  cateName: 'cute animal',
  __proto__: {
    say: f (),
    constructor: f Animal(),
    __proto__: {
      constructor: f Object()
    }
  }
}
```
组合继承是javascript中最常用的继承模式，但是父类构造函数执行了两次，

### 4.寄生组合继承、
```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}

function Child(value) {
  Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

### 5.ES6的extends方式实现继承
```js
class Parent {
  constructor(value) {
    this.val = value
  }
  getValue() {
    console.log(this.val)
  }
}
class Child extends Parent {
  constructor(value) {
    super(value)
  }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```
class 实现继承的核心在于使用 extends 表明继承自哪个父类，并且在子类构造函数中必须调用 super，因为这段代码可以看成 Parent.call(this, value)。

### 参考
- [javascript高级程序设计]()
- [javascript设计模式精讲](https://www.imooc.com/read/38/article/480)
- [前端面试之道](https://juejin.im/book/5bdc715fe51d454e755f75ef/section/5bdd0d83f265da615f76ba57)