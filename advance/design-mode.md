# JS 设计模式

设计模式是一种思想。是为了能够更好的设计程序...保证代码的清晰，简洁，易于维护

下面是一些常见的设计模式。先理解一下~

> 创建型模式

## 工厂模式

工厂模式，根据不同的输入得到不同的输出，工厂模式的主要思想是将**对象的创建与对象的实现**分离。不关心创建过程，只需要得到结果即可。

生活中例子：

去餐馆点餐，说出菜名，饭店会产出对应的菜。

代码中的例子：

1. new 调用构造函数，传递参数，返回一个实例
2. React.createElement()，传入参数，生成 VNode 节点
3. document.createElement(), 创建新的 DOM 元素
4. jquery \$('') 返回实例

```js
class VNode() {
  // ...
}
React.createElement = function(tag, attrs, children) {
  return VNode(tag, attrs, children)
}
```

## 单例模式

单例模式又称单体模式，保证一个类只有一个实例。当第二次用同一个类创建新对象的时候，应该得到与第一次创建的对象完全相同的对象。

生活中的例子：

游戏的存档，游戏玩到一半，下一次再进入游戏时，会接着上一次的继续，而不是重新开始。即存档

特点：

1. 每一次来访者来访问，返回的都是同一个实例
2. 如果一开始实例没有创建，那么这个特定类需要自行创建这个实例。

例子：

- 1. window 以及 document 对象
- Element UI 中的 loading，第二次触发时，会在前一个全屏 Loading 关闭前再次调用全屏 Loading，并不会创建一个新的 Loading 实例，而是返回现有的 Loading 实例

> 结构型模式

## 适配器模式

适配器模式（Adapter Pattern）又称包装器模式，将一个类（对象）的接口（方法、属性）转化为用户需要的另一个接口，解决类（对象）之间接口不兼容的问题。

生活中例子：

转接头，苹果手机 3.5mm 耳机转换接头，电源适配器等。翻译官等。

场景，对旧接口进行封装

```js
class Adaptee {
  specificRequest() {
    return '德国标准插头'
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptee()
  }
  request() {
    let info = this.adaptee.specificRequest()
    return `${info} - 转换器 - 中国标准插头`
  }
}

let target = new Target()
let res = target.request()
```

## 装饰模式

装饰者模式（Decorator Pattern）又称装饰器模式，在不改变原对象的基础上，通过对其添加属性或方法来进行包装拓展，使得原有对象可以动态具有更多功能。

生活中例子：

房屋装修：毛坯房为其添加水电，家具等。奶茶可以添加珍珠，仙草等。咖啡可以添加糖，冰块，牛奶等。

特点：

装饰不影响原有的功能，原有功能可以照常使用；装饰可以增加多个，共同给目标对象添加额外功能；

代码中例子：

1. ts 装饰器，es7 装饰器
2. react 中的 react-redux 的 connect

```js
class Circle {
  draw() {
    console.log('画一个圆形')
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle
  }
  draw() {
    this.circle.draw()
    this.setRedBorder(circle)
  }
  setBorder(circle) {
    console.log('设置红色边框')
  }
}

let circle = new Circle()
circle.draw()

let dec = Decrator(circle)
dec.draw()
```

ES7 装饰器

```js
// demo1
function testDec(target) {
  target.isDec = true
}
@testDec
class Demo {}
console.log(Demo.isDec)

// demo2
function testDec(isDec) {
  return function(target) {
    target.isDec = isDec
  }
}

@testDec(false)
class Demo {}

console.log(Demo.isDec)

// demo3
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Test {
  @readonly
  name = 'yck'
}

let t = new Test()

t.yck = '111' // 不可修改
```

## 代理模式

（Proxy Pattern）又称委托模式，它为目标对象创造了一个代理对象，以控制对目标对象的访问。

生活中例子：

明星的经纪人/助理，某个品牌找明星做广告，需要经纪人做接洽工作。经纪人也起到过滤的作用，毕竟明星不是什么广告都接。还比如说科学上网

代码中例子：

- 网页事件代理
- axios 拦截器
- ES6 Proxy

```js
// 明星
let star = {
  name: '张XX',
  age: 25,
  phone: '13910733521'
}
// 经纪人
let agent = new Proxy(star, {
  get: function(target, key) {
    // 代理的属性与源对象一致
    if (key === 'phone') {
      // 返回经纪人自己的手机号
      return '18812131213'
    }
    if (key === 'price') {
      // 明星不保价，经纪人报价
      return 120000
    }
    // 其他不需要代理的属性
    return target[key]
  },
  set: function(target, key, val) {
    if (key === 'customPrice') {
      if (val < 100000) {
        throw new Error('价格太低')
      } else {
        target[key] = val
        return true
      }
    }
  }
})

console.log(agent.name)
console.log(agent.age)
console.log(agent.phone)
console.log(agent.price)

agent.customPrice = 150000
console.log(agent.customPrice)
```

## 外观模式

外观模式 （Facade Pattern）又叫门面模式，定义一个将子系统的一组接口集成在一起的高层接口，以提供一个一致的外观。外观模式让外界减少与子系统内多个模块的直接交互，从而减少耦合，让外界可以更轻松地使用子系统。本质是封装交互，简化调用。

- 函数重载, PS.不符合单一职责原则和开放封闭原则，因此谨慎使用，不可滥用
- 抹平浏览器兼容问题

```js
// 某个函数有多个参数，其中一个参数可以传递也可以不传递，你当然可以直接弄两个接口，但是使用函数参数重载的方式，可以让使用者获得更大的自由度，让两个使用上基本类似的方法获得统一的外观。
function domBindEvent(nodes, type, selector, fn) {
  if (fn === undefined) {
    fn = selector
    selector = null
  }
  // ... 剩下相关逻辑
}

domBindEvent(nodes, 'click', '#div1', fn)
domBindEvent(nodes, 'click', fn)
```

> 行为型模式

## 发布/订阅模式、观察者模式

发布-订阅模式，（Publish-Subscribe Pattern, pub-sub）又叫观察者模式（Observer Pattern）

它定义了一种一对多的关系，让多个订阅者对象同时监听某一个发布者，或者叫主题对象，这个主题对象的状态发生变化时就会通知所有订阅自己的订阅者对象，使得它们能够自动更新自己。

生活中例子：

1. 聊天群，当有新消息时，会推送给这个群里的所有人。
2. 去买鞋，没货了，到货之后服务员会给每个订阅的人打电话通知鞋有货了。

代码中例子：

1. DOM 事件绑定，对事件进行订阅
2. Vue 发布订阅模式实现双向绑定

## 策略模式

策略模式（Strategy Pattern）又称政策模式，其定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换。封装的策略算法一般是独立的，策略模式根据输入来调整采用哪个算法。关键是策略的**实现和使用分离**

避免出现大量的 if-else 或者 switch-case

生活中例子：

螺丝刀套装，遇到不同规格的螺丝，只需要换螺丝头就行了。而是不是换整个螺丝刀。又比如换轮胎。

代码中例子：

表单验证，行为差不多，只是改变校验规则

```js
class User {
  constructor(type) {
    this.type = type
  }
  buy() {
    if (this.type === 'ordinary') {
      console.log('普通用户购买')
    } else if (this.type === 'member') {
      console.log('会员用户购买')
    } else if (this.type === 'vip') {
      console.log('vip用户购买')
    }
  }
}

let u1 = new User('ordinary')
u1.buy()

// 策略模式
class OrdinaryUser {
  buy() {
    console.log('普通用户购买')
  }
}
class MemberUser {
  buy() {
    console.log('会员用户购买')
  }
}
class VipUser {
  buy() {
    console.log('vip用户购买')
  }
}
let u1 = new OrdinaryUser()
u1.buy()
let u2 = new MemberUser()
u2.buy()
let u3 = new VipUser()
u3.buy()
```

场景：场景是这样的，某个电商网站希望举办一个活动，通过打折促销来销售库存物品，有的商品满 100 减 30，有的商品满 200 减 80，有的商品直接 8 折出售

```js
function priceCalculate(discountType, price) {
  if (discountType === 'minus100_30') {
    // 满100减30
    return price - Math.floor(price / 100) * 30
  } else if (discountType === 'minus200_80') {
    // 满200减80
    return price - Math.floor(price / 200) * 80
  } else if (discountType === 'percent80') {
    // 8折
    return price * 0.8
  }
}

priceCalculate('minus100_30', 270) // 输出: 210
priceCalculate('percent80', 250) // 输出: 200

// 改进
// 将计算折扣的算法部分提取出来保存为一个对象，折扣的类型作为 key，这样索引的时候通过对象的键值索引调用具体的算法
const DiscountMap = {
  minus100_30: function(price) {
    return price - Math.floor(price / 100) * 30
  },
  minus200_80: function(price) {
    return price - Math.floor(price / 200) * 80
  },
  percent80: function(price) {
    return price * 0.8
  }
}

/* 计算总售价*/
function priceCalculate(discountType, price) {
  return DiscountMap[discountType] && DiscountMap[discountType](price)
}

priceCalculate('minus100_30', 270)
priceCalculate('percent80', 250)
```

## 参考

- [慕课网-JS 设计模式讲解与应用](https://coding.imooc.com/learn/list/255.html)
- [慕课专栏-JavaScript 设计模式精讲](https://www.imooc.com/read/38)
