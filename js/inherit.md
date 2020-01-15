# 继承与原型链

之前一篇文章说明了函数模拟创建类的几种方式，这篇说一说关于继承的一些知识。

## 1. ES5 继承的几种方式

### 1.1 原型链继承

原型链继承即原型链直接指向父类构造函数

```js
// 父类
function Animal(name) {
  this.name = name
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}
// 子类
function Dog(name, age) {
  this.name = name
  this.age = age
}

Dog.prototype = new Animal()
Dog.prototype.constructor = Dog
Dog.prototype.bark = function() {
  console.log(`${this.name} is barking`)
}
```

上卖弄 Dog 的原型由**父类构造函数**，**constructor**,**自定义方法**三部分构成

直接改变了 Dog 的 prototype 的指针指向

下面是打印 Dog 构造函数的结果

```js
const aDog = new Dog('pity', 6)
console.log(aDog)
Dog:
{
  name: 'pity',
  age: 6,
  __proto__: { // Dog的原型 包含了 构造函数 Animal
    bark: f(),
    construcotr: f Dog(), // Dog原型的构造器是Dog
    name: undefined, // 父类实例属性
    __proto__: { // Dog原型Animal 的原型
      say: f(),
      constructor: f Animal()
      __proto__: { // Animal 原型的原型 是引用类型Object
        constructor: Object,
        ...
      }
    }
  }
}
```

**缺陷**：1.无法继承父类实例上的属性。2.父类构造函数的实例属性并没有用到。(原型链直接赋值的通病)

PS: 为什么不用 Dog.prototype = Animal.prototype 呢？ 如果用了，那么两者共享一个 prototype, 改变 Dog 的 prototype 也会改变 Animal 的 prototype

### 1.2 构造函数窃取

构造函数窃取，又称构造函数借用，经典继承，在子类型的构造函数内部调用父类的构造函数，只能继承实例属性，继承不了原型链属性

```js
function Animal(cateName) {
  this.cateName = cateName
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}

function Dog(cateName, name, age) {
  // 下面就是构造函数窃取，显式绑定this，传入参数，返回执行结果
  Animal.call(this, cateName) // this.cateName = cateName
  this.name = name
  this.age = age
}
```

下面是打印 Dog 构造函数实例的结果

```js
const aDog = new Dog('lovely animal','pity', 6)
// aDog prototype 指向Dog
console.log(aDog)
{
  name: 'pity',
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

**优点**：完善了没有继承父类实例的缺陷

**缺点**：1.没有继承 Animal 原型上面的方法。2.并且每次创建 Dog 的实例，都会执行 Animal 构造函数(构造函数窃取的通病)

### 1.3 组合继承(构造函数与原型链组合)

组合继承又称伪经典继承，指的是将原型链和借用构造函数的技术组合发挥二者之长的一种继承模式。

思路是：使用原型链实现对**原型属性和方法**的继承，而通过借用构造函数来实现对**实例属性**的继承

```js
function Animal(cateName) {
  this.cateName = cateName
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}

function Dog(cateName, name, age) {
  Animal.call(this, cateName) // 第一次调用Animal函数
  this.name = name
  this.age = age
}
Dog.prototype = new Animal() // Dog实例可以直接调用Animal，prototype上的方法，这是第二次调用Animal函数
Dog.prototype.constructor = Dog // 把原型上的构造器指向自己
Dog.prototype.bark = function() {
  console.log(`i'm dog,my name is ${this.name} i'm barking`)
}
```

下面是打印 Dog 实例的结果

```js
const aDog = new Dog('lovely animal', 'erha', 7)
const anAnimal = new Animal('cute animal')
aDog.bark() // i'm dog,my name is erha i'm barking
aDog.say()  // my name is erha,,调用原型的原型上面的方法
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

组合继承是 javascript 中最常用的继承模式，

**优点**： 弥补了构造函数继承与原型链继承各自的一些缺点。

**缺点**: 1.父类构造函数执行了两次，第一次在构造函数窃取中，第二次在原型链赋值中。2.原型链赋值的时候，父类构造函数的实例属性并没有用到。(原型链继承的通病)3.还有就是每次创建 Dog 的实例，都会执行 Animal 构造函数(构造函数窃取的通病)

### 1.4 寄生组合继承

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

**优点**(相对于组合继承)：1.父类构造函数只执行了一次 2.原型链继承减少了不必要的实例属性的继承

## 2.ES6 的 extends/super 方式实现继承

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

- [javascript 高级程序设计 6.3 继承]()
- [javascript 设计模式精讲](https://www.imooc.com/read/38/article/480)
- [前端面试之道](https://juejin.im/book/5bdc715fe51d454e755f75ef/section/5bdd0d83f265da615f76ba57)
