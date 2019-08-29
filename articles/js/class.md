# ES6实现类

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
```
Point6就相当于es5的构造函数，js内部将class做了处理

在`class Ponit6{}`内部声明的方法，都会被添加到Point6的prototype对象的属性上   
在`class Point6{}`内部声明的属性，都会作为Point6的实例属性  
constructor方法的作用:    
- 如果没有显式定义，一个空的constructor会被默认添加
- constructor默认返回实例对象，即this  

#### class取值函数(getter)与存值函数(setter)
在类的内部使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为  
```js
class MyClass {
  get prop() {
    return 'getter'
  }
  set prop(value) {
    console.log('setter:' + value)
  }
}
let init = new MyClass()
init.prop = 123  // setter: 123
init.prop // getter
```

#### this的指向
```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }
  print(text) {
    console.log(text)
  }
}
const logger = new Logger()
const {printName} = logger
logger.printName() // Hello there
printName() // TypeError: Cannot read property 'print' of undefined
```
单独使用`printName`，this会指向该方法运行时的环境(由于class内部时严格模式，所以this指向undefined)，导致找不到`print`报错  
一个解决方法是，在构造方法中绑定this 
```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
  // ...
}
```
另一个方法是使用箭头函数,this总指向在被定义时的外层函数对象
```js
class Obj {
  constructor() {
    this.getThis = () => this
  }
  // 或者
  getThis = () => {

  }
}
```
还有一种方法时Proxy...???

#### 静态方法
静态方法不会被实例继承，使用static关键字
#### 实例属性的新写法
定义在类的最顶层
#### 静态属性
在提案中...
#### 私有方法和私有属性
暂时没有，但是有提案

```js
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