# this

在掌握 this 之前，我们需要知道下面这些点

- this 不指向函数本身
- this 是在函数被调用时发生的绑定，也就是说，函数未调用之前是没有 this 的，它指向谁完全取决于函数在哪里被调用
- **每一个函数被调用**时，都会创建一个**执行环境**(上下文环境)，执行环境中的**活动对象**, 含有函数在哪里调用(调用栈)，函数的调用方式，传入的参数等信息，this 是这个活动对象的一个属性，会在函数的执行过程中用到，执行环境不存在，this 也就不存在了，如果没有特殊指定，活动对象的 this 是 window

## 1. this 的绑定规则

### 1.1 默认绑定

在全局作用域调用函数，函数的 this 是 window(在严格模式为 undefined)

在局部作用域直接调用函数，应用的也是默认绑定，即 window，当前函数只查找到了 this 即 window 自己

```js
function foo() {
  console.log(this); // window
}
function bar() {
  console.log(this); // window
  foo();
}
bar();
```

### 1.2 隐式绑定

当函数引用具有上下文对象时，隐式绑定规则会把 this 绑定到这个上下文对象上

即谁调用的函数，谁就是函数上下文中的 this，在下例中，是 obj

```js
function foo() {
  console.log(this); // obj对象
  console.log(this.a); // 2
}
const obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 输出为obj对象，即{a:2,foo:foo}
```

### 1.3 显示绑定

通过`call(...)` `apply(... )` `bind(...)`方法

`apply()`方法第一个参数是**一个对象**，在调用函数时将 this 绑定到这个对象上，因为直接指定 this 的绑定对象，称之为显示绑定

```js
function foo() {
  console.log(this); // obj对象
}
const obj = {
  a: 2
};
foo.call(obj); // foo函数执行
```

`apply()`方法第二个参数是一个**数组**，数组里面是调用函数时要传递的参数，函数执行时接收的参数是数组的一个一个项(即数组被打散了)

比如：

```js
function foo(arg1, arg2, arg3) {
  // arg1,arg2,arg3对应的分别是**参数数组**的第一项，第二项，第三项
  console.log(arguments); // [1,2,{name: 'xbl'}] arguments为伪数组
  console.log(arg1); // 1
  console.log(arg2); // 2
  console.log(arg3); // {name: 'xbl'}
}

const obj = {};
foo.apply(obj, [1, 2, { name: "xbl" }]);
foo.apply(obj, 1); // 传递非数组会报错

// 使用ES6展开运算符展开参数更方便，展开运算符结合函数参数使用
function foo(...args) {
  console.log(...args); // 1 , 2, name: 'xbl'
  console.log(...arguments); // 1 , 2, name: 'xbl'
  console.log(args); // 数组 [1,2, name: 'xbl']
  console.log(arguments); // 伪数组
}
```

大多数使用 apply 的场景可以使用 ES6 的**展开运算符(spread operator)**进行代替，比如：

```js
// 从数组中取出最大值
const values = [25, 50, 75, 100];
Math.max.apply(Math, values);
// 可以使用展开运算符
Math.max(...values);
```

`call()`方法与`apply()`不同的是，可以有 2-n 个参数，第 2-n 个参数是调用函数要传的参数

```js
function foo(arg1, arg2, arg3) {
  console.log(arguments); // [1,2,{name: 'xbl'}] arguments为伪数组
  console.log(arg1); // 1
  console.log(arg2); // 2
  console.log(arg3); // {name: 'xbl'}
}

const obj = {};
foo.call(obj, 1, 2, { name: "xbl" });
```

`bind()`可以改变 this 指向，接收的参数也与`call`类似，不过 bind 返回的是一个函数

```js
function foo(a, b) {
  console.log("a:", a, "b:", b); // a: 2 b: 3
}
// bind是高阶函数，细分的话是柯里化函数
// 函数柯里化是指 函数对传入的参数做处理，每处理一个参数，返回一个函数，是函数式编程的重要组成部分
const bar = foo.bind({}, 2, 3);
bar();
```

ES6 实现实现一个简单的 bind

```js
Function.prototype.bind1 = function(...rest1) {
  const self = this; // bind1的调用者，在本例中是foo，这里也是使用了闭包进行保存。
  const context = rest1.shift(); // context即接收的this
  return function(...rest2) {
    // rest1即bind1接收的参数，本例中对应 2, 3。rest2即返回函数接收的参数。本例中对应 4
    return self.apply(context, [...rest1, ...rest2]);
  };
};
function foo(a, b, c) {
  console.log("a:", a, "b:", b, "c:", c);
}
const bar = foo.bind1({}, 2, 3);
bar(4);
```

把 `null` 或者 `undefined` 作为 this 绑定的对象传入 `call, apply, bind`, 这些值 在调用时会被忽略，实际应用的仍然是**默认规则**

使用 null 可能会产生副作用，可以传空对象{}

js 中创建空对象最简单的方法时 Object.create(null), 这个和{}很像，但是不会创建**Object.prototype**这个委托，比{}更空，即没有原型链

```js
function foo(a, b) {
  console.log("a:", a, "b:", b); // a:2 b:3
  console.log(this); // {} 空对象
}
const empty = Object.create(null);
foo.apply(empty, [2, 3]);
```

### 1.4.new 绑定

- js 中，构造函数只是使用 new 操作符时被调用的普通函数
- 内置对象如 Number,Object 等等在内的所有构造函数都可以用 new 调用，这种调用方式称为构造函数调用
- 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”

> 使用 new 调用函数时，会自动执行以下操作

- 创建一个新对象
- 新对象的原型(**proto**/prototype)指向构造函数的 prototype
- 新对象赋给当前 this
- 执行构造函数
- 如果函数没有返回其他对象，new 表达式中的函数会自动返回这个新对象

```js
function Animal(name) {
  this.name = name
}

// 后代实例
const dog = new Animal('jack')
console.dir(dog)

// 实例属性对象
{
  name: 'jack',
  __proto__: {
    constructor: f Animal(name) {
      arguments: null,
      length: 1,
      name: 'Animal', ...
    } ...
  }
}
```

如何判断一个函数是被 new 操作符调用了？可以使用 es6 新增的 `new.target` 进行判断

**this 绑定的优先级**：new > apply/call/bind > 隐式绑定 > 默认绑定

## 2.ES6 箭头函数中 this 的词法特征

1. 箭头函数无法使用上述四条 this 绑定的规则
2. 箭头函数内部不存在 this，但是通过作用域链，可以查找到 this 变量，如果外层作用域(函数)中有 this((非默认绑定的 this)，则箭头函数 this 与外层作用域 this 一致，否则会向上查找，直到全局作用域
3. 箭头函数的 this 无法被直接修改，但是可以通过改变外层函数的 this 指向来间接改变箭头函数里的 this
4. 箭头函数没有构造函数 constructor, 不可以使用 new 调用

### 2.1 箭头函数实例

```js
// 箭头函数中this的默认行为
function b1() {
  function b2() {
    console.log(`b2函数this`, this);
    const b3 = () => {
      console.log(`b3箭头函数this`, this);
    };
    b3(); // 与b3函数父函数(外层函数b2)this一致  window
  }
  b2(); // window
  return () => {
    console.log(`return箭头函数a`, this.a);
  };
}

// 箭头函数中this可以改变吗？
const o1 = { a: 1 };
const o2 = { a: 2 };
const o3 = { a: 3 };

const bar = b1.call(o1); // b1 this指向 o1, 执行b1(),返回一个箭头函数
bar(); // 箭头函数执行，与b1 this 一致,为 o1

bar.call(o2); // 箭头函数无法直接使用显示绑定，输出 this 仍为 o1

// 那就只能通过改变箭头函数的 外层函数 this 从而改变箭头函数的this
const baz = b1.call(o3);
baz(); // 成功改变箭头函数this 为o3 !!
```

### 2.2 多个嵌套非箭头函数

```js
function foo() {
  console.log(`foo内部`, this); // outObj，显式绑定
  function b1() {
    console.log(`b1`, this); // innerObj，隐式绑定
    function b2() {
      console.log(`b2`, this); // window，默认绑定
      function b3() {
        console.log(`b3`, this); // window，默认绑定
      }
      b3();
    }
    b2();
  }

  const innerObj = { inner: 2, bar };
  return innerObj.b1();
}

const outObj = { outObj: 1 };
foo.call(outObj);
```

可以看出，每个函数的 this 都是独立的，无法继承自父函数，默认规则绑定的是 window

如果想要保存父函数的 this，可以使用`that = this`，用 that 来**持续引用**父函数的 this，父函数执行过后执行环境不会立即销毁，这里借用了**闭包**的原理。

### 2.3 对象中属性值为函数时

```js
var a = "hello";
const obj = {
  a: "world",
  b: this,
  f1: () => {
    console.log(this.a);
  },
  f2: function() {
    console.log(this.a);
  }
};

// window，对象是没有上下文环境，因此也就没有this这个属性，之所以可以获取到this是因为全局作用域存在this变量
console.log(obj.b);

obj.f1(); // hello
obj.f2(); // world
```

### 2.4 回调函数里面的 this

回调函数，即函数的参数是一个函数。

如果回调函数是一个普通函数，并且没用 this 绑定规则，那么 this 将会是**window**

```js
function bar() {
  const cb = function(callback) {
    callback();
  };
  const innerObj = { cb: cb };

  innerObj.cb(() => {
    console.log(`回调箭头函数`, this);
  }); // 注意！定义的位置，也就是cb的位置，this是cb外面函数的this, 与bar一致，即outObj

  innerObj.cb(function() {
    console.log(`回调普通函数`, this);
  }); // 默认规则 window
}

const outObj = { a: 1 };
bar.call(outObj);
```

### 2.5 定时器

对于一些使用定时器的地方，想要保存父级的 this，可以使用箭头函数，而不用再用`that = this`来用闭包保存父级 this

```js
function foo() {
  const self = this;

  setTimeout(function() {
    console.log(self); // obj
    console.log(this); // window 默认绑定
  }, 1000);

  setTimeout(() => {
    console.log(this); // obj，回调函数的this
  }, 2000);
}

const obj = { a: 1 };
foo.call(obj); // foo this 是 obj
```

### 2.6 this 的一个例子

```js
var a = 20;
// 用const a = 20 无法得到想要的输出,因为此时a没有被绑定到window对象上
const obj = {
  a: 40,
  // 应用默认绑定，this是window
  foo: () => {
    console.log(this.a); // 词法作用域，obj外面的this, this是window对象，输出20

    function func() {
      this.a = 60; // 语法作用域，this现在不确定
      console.log(this.a); // this不确定，但是this.a确定，是60
    }

    func.prototype.a = 50; // func的prototype的a值是50
    return func;
  }
};
const bar = obj.foo(); // 执行foo函数，并返回func函数
bar(); // 执行bar函数  60
new bar(); // 60
```

### 2.7 箭头函数没有构造器 constructor，不能用于构造函数

```js
const Message = text => {
  this.text = text;
};
const myMessage = new Message("hello");
// Uncaught TypeError: Message is not a constructor
const myMessageInfo = Message("hi");
console.log(myMessageInfo); // undefined
```

因为 this 的问题，箭头函数要慎用，构造函数不能使用箭头函数，因为 prototype 无法指定

使用箭头函数要注意的地方，可以参考：[什么时候不使用箭头函数](https://juejin.im/post/5d4770ecf265da03dd3d5642#comment)

## 参考

- [你不知道的 javascript 上第二部分 this 和对象原型](https://github.com/yygmind/Reading-Notes/blob/master/%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript%E4%B8%8A%E5%8D%B7.md)
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20&%20closures/README.md#you-dont-know-js-scope--closures)
- [JavaScript 设计模式](https://www.imooc.com/read/38)
- [什么时候不使用箭头函数](https://juejin.im/post/5d4770ecf265da03dd3d5642#comment)
