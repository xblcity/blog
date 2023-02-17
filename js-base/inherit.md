# 类与继承

## ES5 实现类

实现有属性及方法的函数对象，也可以理解为使用 `JS` 函数实现类

### 1. 工厂模式

```js
function createAnimal(name, age) {
  var o = new Object()
  o.name = name
  o.age = age
  o.sayName = function() {
    console.log(`my name is ${this.name}`)
  }
  return o
}
var aDog = createAnimal("dog", 6)
// 执行aDog，返回一个对象
```

**优点**：解决了创建相似对象的问题

**缺点**：但没有解决对象识别的问题。即怎样知道一个对象的类型(可使用`instanceof`判断的类型)。在上例中，也就是如何知道`aDog`与`createAnimal`的联系呢？

### 2. 构造函数模式

使用 `new` 操作符，会自动为添加 `proto` 属性，用于类型的识别。

```js
function Animal(name, age) {
  this.name = name
  this.age = age
  this.sayName = function() {
    console.log(`my name is ${this.name}`)
  }
}
var aDog = new Animal("dog", 6)
```

与工厂模式不同的是，我们没有显式的创建对象并返回对象，并且我们把属性和方法都绑定到了`this`上面

执行 `new Animal()` 的时候，做了什么事情呢？

- 执行构造函数
- 创建一个新对象
- 新对象的原型(**proto**)指向构造函数的 `prototype`
- 新对象赋给当前 `this` (将构造函数的作用域赋给新对象)
- 如果函数没有返回其他对象，会默认返回这个新对象

**优点**：构造函数解决了类型判断的问题，现在我们可以使用`aDog instanceof Animal`输出 `true` 来正确判断 `aDog` 的类型

**缺点**：每次构造`Animal`实例，生成不同值的属性是合理的，但是每次都生成一模一样的方法，造成内存浪费是不合理的

### 3. 原型模式

我们创建的**每个函数**都会自动获得 `prototype`(原型)属性，这个属性是一个**指针**，指向一个**对象**，而这个对象的包含该类型的所有实例共享的属性和方法，使用原型的好处是可以让所有对象实例共享它所包含的属性和方法。

```js
function Animal() {}

// 为prototype对象添加更多的属性和方法
Animal.prototype.name = "dog"
Animal.prototype.age = 7
Animal.prototype.sayName = function() {
  console.log("my name is" + this.name)
}
var aDog = new Animal()
var bDog = new Animal()
console.log(aDog.sayName === bDog.sayName) // true
```

可以看出，由 `Animal` 构造函数构造出的实例都具有相同的属性和方法，方法指向同一个引用

**优点**：解决构造函数之前存在的问题，即实例共享的方法或属性只需创建一个就可以了，节省内存空间

**缺点**：实例无法拥有自己特定的属性，如果更改了原型上的属性，会导致其他实例的属性也会跟着改变

### 4. 组合使用构造函数模式和原型模式

```js
function Animal(name) {
  this.name = name
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}
const anAnimal = new Animal("animal gaga")
```

```js
console.log(anAnimal)

// anAnimal构造器(constructor)是Animal，anAnimal是Animal的一个实例
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

console.log(anAnimal.prototype) // undefined，只有构造函数有prototype，而构造函数的实例只有由浏览器封装的如__proto__属性
console.log(anAnimal.__proto__) // {say: function() {}, constructor: function Animal(name){}, __proto__: {constructor: Object, ...} }
console.log(Animal.prototype) // {say: function() {}, constructor: function Animal(name){}, __proto__: {constructor: Object, ...} }
```

**优点**: 充分利用了构造函数和原型的优点，使得实例可以拥有自己的属性和共有的方法

**缺点**: 暂无

### 5. 关于构造函数静态方法与原型方法的区别

构造函数的方法的调用，以 `Date` 这个构造函数为例

`Date` 构造函数，属性为方法的有`now, parse`等，即`Date.now = function(){}`，可以理解为**ES6的静态方法**，只能被 `Date` 类直接调用。

`Date` 构造函数，`Date.prototype` 上面的方法有`getDate(), getFullYear()`等，构造函数想要调用这些方法，必须使用`Date.prototype.getDate()`, 如果直接使用`Date.getDate()`，由于 `Date` 构造函数并没有`getDate`这个属性，所以向**proto**上面查找，未找到，报错 `TypeError`

但是对于构造函数的实例来说，由于`new`操作运算符的的作用，实例的`__proto__`已经指向了 Date 构造函数的`prototype`，所以调用`实例.getDate()`，实例无 `getDate` 属性，向**proto**上查找，找到了，执行。

比如下例

```js
class MyObject {
  static getName
  static getAge() {
    console.log('我是静态方法getAge')
  }
}
MyObject.getName = function() {
  console.log('我是静态方法getName')
}
MyObject.prototype.sayName = function() {
  console.log('我是原型上面的方法saynName')
}

const myInstance = new MyObject()
myInstance.getName() // 报错：Uncaught TypeError: myInstance.getName is not a function
myInstance.sayName() // 打印成功

MyObject.getName() // 打印成功
MyObject.sayName() // 报错 Uncaught TypeError: MyObject.sayName is not a function
MyObject.prototype.sayName() // 打印成功
```

## 继承

上面说明了函数模拟创建类的几种方式，下面说一说关于继承的一些知识与实现。

### 1. ES5 继承的几种方式

#### 1.1 原型链继承

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

上例中 `Dog` 的原型由**父类构造函数**，**constructor**,**自定义方法**三部分构成

直接改变了 `Dog` 的 `prototype` 的指针指向

下面是打印 `Dog` 构造函数的结果

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

PS: 为什么不用 `Dog.prototype = Animal.prototype` 呢？ 如果用了，那么两者共享一个 `prototype`, 改变 `Dog` 的 `prototype` 也会改变 `Animal` 的 `prototype`

#### 1.2 构造函数窃取

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
    constructor: f Dog() {
      name: 'Dog' // 可以看到，Dog继承了Animal的属性
    },
    __proto__: {
      constructor: f Object()
    }
  }
}
```

**优点**：完善了没有继承父类实例的缺陷

**缺点**：1. `Dog` 没有继承 `Animal` 原型上面的方法。2.并且每次创建 `Dog` 的实例，都会执行 `Animal` 构造函数(构造函数窃取的通病)

#### 1.3 组合继承(构造函数与原型链组合)

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

下面是打印 `Dog` 实例的结果

```js
const aDog = new Dog('lovely animal', 'erha', 7)
const anAnimal = new Animal('cute animal')
aDog.bark() // i'm dog,my name is erha i'm barking
aDog.say()  // my name is erha,, 调用原型的原型上面的方法
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

#### 1.4 寄生组合继承

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
// 上面八行代码等同于以下两行
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

**优点**(相对于组合继承)：1.父类构造函数只执行了一次 2.原型链继承减少了不必要的实例属性的继承

### 2.ES6 的 extends/super 方式实现继承

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

### instanceof的手动实现

`instanceof` 的原理：

`instanceof` 是通过原型链判断的，A `instanceof` B, 在A的原型链中层层查找，是否有原型等于B.prototype，如果一直找到A的原型链的顶端(null;即Object.proptotype.__proto__),仍然不等于B.prototype，那么返回false，否则返回true。

```js
function instance_of(L,R) {
  let prototype = R.prototype
  while(true) {
    if (L === null) {
      return false
    } else if (L.__proto__ === prototype) {
      return true
    }
    L = L.__proto__
  }
}
```

## 参考

- [javascript 高级程序设计 6.2 创建对象]()
- [W3C ECMAScript 定义类或对象](https://www.w3school.com.cn/js/pro_js_object_defining.asp)
- [javascript 高级程序设计 6.3 继承]()
- [javascript 设计模式精讲](https://www.imooc.com/read/38/article/480)
- [前端面试之道](https://juejin.im/book/5bdc715fe51d454e755f75ef/section/5bdd0d83f265da615f76ba57)
