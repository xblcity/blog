# ES5 实现类

实现有属性及方法的函数对象，也可以理解为使用 JS 函数实现类

## 1. 工厂模式

```js
function createAnimal(name, age) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.sayName = function() {
    console.log(`my name is ${this.name}`);
  };
  return o;
}
var aDog = createAnimal("dog", 6);
// 执行aDog，返回一个对象
```

**优点**：解决了创建相似对象的问题

**缺点**：但没有解决对象识别的问题。即怎样知道一个对象的类型(可使用`instanceof`判断的类型)。在上例中，也就是如何知道`aDog`与`createAnimal`的联系呢？

## 2. 构造函数模式

使用 new 操作符，会自动为添加 proto 属性，用于类型的识别。

```js
function Animal(name, age) {
  this.name = name;
  this.age = age;
  this.sayName = function() {
    console.log(`my name is ${this.name}`);
  };
}
var aDog = new Animal("dog", 6);
```

与工厂模式不同的是，我们没有显式的创建对象并返回对象，并且我们把属性和方法都绑定到了`this`上面

执行 new Animal()的时候，做了哪些东西呢？

- 创建一个新对象
- 新对象的原型(**proto**)指向构造函数的 prototype
- 新对象赋给当前 this(将构造函数的作用域赋给新对象)
- 执行构造函数(为对象添加属性)
- 返回这个新对象(如果函数没有返回其他对象)

**优点**：构造函数解决了类型判断的问题，现在我们可以使用`aDog instanceof Animal`输出 true 来正确判断 aDog 的类型

**缺点**：每次构造`Animal`实例，生成不同值的属性是合理的，但是每次都生成一模一样的方法，造成内存浪费是不合理的

## 3. 原型模式

我们创建的**每个函数**都会自动获得 `prototype`(原型)属性，这个属性是一个**指针**，指向一个**对象**，而这个对象的包含该类型的所有实例共享的属性和方法，使用原型的好处是可以让所有对象实例共享它所包含的属性和方法。

```js
function Animal() {}

// 为prototype对象添加更多的属性和方法
Animal.prototype.name = "dog";
Animal.prototype.age = 7;
Animal.prototype.sayName = function() {
  console.log("my name is" + this.name);
};
var aDog = new Animal();
var bDog = new Animal();
console.log(aDog.sayName === bDog.sayName); // true
```

可以看出，由 Animal 构造函数构造出的实例都具有相同的属性和方法，方法指向同一个引用

**优点**：解决构造函数之前存在的问题，即实例共享的方法或属性只需创建一个就可以了，节省内存空间

**缺点**：实例无法拥有自己特定的属性，如果更改了原型上的属性，会导致其他实例的属性也会跟着改变

## 4. 组合使用构造函数模式和原型模式

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`);
};
const anAnimal = new Animal("animal gaga");
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

**缺点**:

## 关于构造函数静态方法与原型方法的区别

构造函数的方法的调用，以 Date 这个构造函数为例

Date 构造函数，属性为方法的有`now, parse`等，即`Date.now = function(){}`，可以理解为**静态方法**，只能被 Date 类直接调用。

Date 构造函数，prototype 上面的方法有`getDate(), getFullYear()`等，构造函数想要调用这些方法，必须使用`Date.prototype.getDate()`, 如果直接使用`Date.getDate()`，由于 Date 构造函数并没有`getDate`这个属性，所以向**proto**上面查找，未找到，报错 TypeError

但是对于构造函数的实例来说，由于`new`操作运算符的的作用，实例的`__proto__`已经指向了 Date 构造函数的`prototype`，所以调用`实例.getDate()`，实例无 getDate 属性，向**proto**上查找，找到了，执行。

## 参考

- [javascript 高级程序设计 6.2 创建对象]()
- [W3C ECMAScript 定义类或对象](https://www.w3school.com.cn/js/pro_js_object_defining.asp)
