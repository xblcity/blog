# 实现有属性/方法的函数对象

## 工厂模式

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
var aDog = createAnimal('dog', 6)
// 执行aDog，返回一个对象
```
解决了创建相似对象的问题，但没有解决对象识别的问题(即怎样知道一个对象的类型,可使用instanceof判断的类型)

## 构造函数模式

- new操作符  
```js
function Animal(name, age) {
  this.name = name
  this.age = age
  this.sayName = function() {
    console.log(`my name is ${this.name}`)
  }
}
var aDog = new Animal('dog', 6)
```
与工厂模式不同的是，我们没有显式的创建对象并返回对象，并且我们把属性和方法都绑定到了`this`上面

执行new Animal()的时候，与不加new操作符有哪些区别呢？  
- 创建一个新对象
- 新对象的原型(__proto__)指向构造函数的prototype
- 新对象赋给当前this(将构造函数的作用域赋给新对象)
- 执行构造函数(微信对象添加属性)
- 返回这个新对象(如果函数没有返回其他对象)

构造函数解决了类型判断的问题，现在我们可以使用`aDog instanceof Animal`输出true来正确判断aDog的类型  
但是仍然存在其他问题，就是每次构造`Animal`实例，生成不同值的属性是合理的，但是每次都生成一模一样的方法，造成内存浪费是不合理的


## 原型模式

我们创建的**每个函数**都会自动获得prototype(原型)属性，这个属性是一个指针，指向一个对象，**而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法**，使用原型的好处是可以让所有对象实例共享它所包含的属性和方法。
```js
function Animal() {}
// 为prototype对象添加更多的属性和方法
Animal.prototype.name = 'dog'
Animal.prototype.age = 7
Animal.prototype.sayName = function() {
  console.log('my name is' + this.name)
}
var aDog = new Animal()
var bDog = new Animal()
console.log(aDog.sayName === bDog.sayName) // true
```
可以看出，由Animal构造函数构造出的实例都具有相同的属性和方法，方法指向同一个引用  

对原型的简单理解：  
只要创建了一个函数，该函数就会自动获得prototype属性，这个属性指向函数原型对象(可以简单理解为prototype就是个对象)  
所有的prototype对象会自动获得constructor(构造函数)属性，这个属性包含一个指向prototype属性所在函数的指针(可以简单理解为constructor也是一个对象)  
拿前面的例子来说 Animal函数的prototype属性的constructor属性指向Animal,,,constructor是没有那些实例属性的~~~  
但是，由`new Animal()`构造出的实例的与构造函数`Animal`是不相等的，在constructor里面的属性可能在实例访问不到,如`Array.isArray()`但是却不能使用`(new Array(1)).isArray()`

原型模式存在的问题：实例无法拥有自己特定的属性，如果更改了原型上的属性，会导致其他实例的属性也会跟着改变

## 组合使用构造函数模式和原型模式
```js
function Animal(name) {
  this.name = name
}
Animal.prototype.say = function() {
  console.log(`my name is ${this.name}`)
}
const anAnimal = new Animal('animal gaga')
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

console.log(anAnimal.prototype) // undefined，只有构造函数由prototype，而构造函数的实例只有由浏览器封装的如__proto__属性
console.log(anAnimal.__proto__) // {say: function() {}, constructor: function Animal(name){}, __proto__: {constructor: Object, ...} }
console.log(Animal.prototype) // {say: function() {}, constructor: function Animal(name){}, __proto__: {constructor: Object, ...} }
```

### 参考
- [javascript高级程序设计6.2创建对象]()
- [W3C ECMAScript 定义类或对象](https://www.w3school.com.cn/js/pro_js_object_defining.asp)