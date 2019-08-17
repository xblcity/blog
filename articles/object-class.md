# 实现有属性/方法的对象(类)
## 工厂模式
## 构造函数模式
- new操作符  
## 原型模式
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

## ES6实现
```js
class Point6 {
  job = 'ddd'
  location
  constructor(name, age, location) {
    this.name = name
    this.age = age
    this.location = location
  }
  sayName() {
    console.log(this.name)
  }
  sayAge() {
    console.log(this.age)
  }
}
// 上述Point6由属性，构造函数，方法这三部分组成
const p6 = new Point6('p6', 88, 'Japan')

class Point7 extends Point6 {
  sayMyself() {
    console.log(this)
  }
}
const p7 = new Point7()
// 通过extends继承了Point6的全部属性和方法
// p7原型是Point6，当然原型上也存在自己的的方法sayMyself，Point6的原型上由sayName,sayJob等方法
class Point8 extends Point6 {
  constructor(name) {
    super(name) // 调用父类的constructor(name)
  }
}
const p8 = new Point8()
```
在ts中是属性与方法由private与public之分

### 参考
- [javascript高级程序设计6.2创建对象]()
- [W3C ECMAScript 定义类或对象](https://www.w3school.com.cn/js/pro_js_object_defining.asp)