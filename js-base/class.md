# ES6实现类

## class类的组成

```js
class Point {
  // 实例属性新写法，需定义在类的最顶层，优点方便查看，缺点无法通过传参进行初始化
  count = 0
  // constructor是class上面的一个特殊的属性/方法，用于生成实例对象，使用new调用传入参数
  constructor(name, age) { 
    this.name = name
    this.age = age
  }
  // 普通方法，挂载到Point.prototype上面、
  sayName() {
    console.log(this.name)
  }
  // 静态方法，不会被实例继承，只能由类Point来调用, 可以被子类继承
  static classMethod() {
    return 'hello'
  }
  // 私有方法，前面要加 _，只能在类的内部进行访问
  _bar(baz) {
    return 'world'
  }
  // 静态属性与私有属性在提案中...
}
```

## class取值函数(getter)与存值函数(setter)

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

## this的指向

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

### 参考

- [阮一峰ES6 class](http://es6.ruanyifeng.com/#docs/class)