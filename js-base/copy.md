# 赋值/浅拷贝/深拷贝

在JS中，我们会频繁的使用对象这种引用类型的数据，操作不当可能会发生意料之外的情况。

在JS中，数据类型分为值类型和引用类型。其中值类型包括：`'string', 'number', 'bool', 'undefined', 'null', 'symbol', 'bigint'`这7个。要注意的是，这几个单词需要加上引号才是关键字，所以使用`typeof`返回的是字符串关键字，比如`typeof 2` 返回的是`'number'`

引用类型包括`Object`类型，`Object`和字符串`'object'`都是关键字，`Object`类型引申出来的常用的还有 `Array`, `Function`等。比如，当我们使用`function foo() {}; foo instanceof Object`返回为`true`。`instanceof`实现的原理是构造函数的原型链

通常，当我们对值类型进行赋值时，内存会给该值分配一个地址空间，以下图为例

![值类型赋值](./images/copy/copy1.png)

```js
let a = 1 // 计算机内栈结构开辟出一个新的地址#001，改地址存储的值为1

let b = 2 // 计算机内栈结构开辟出一个新的地址#002，改地址存储的值为2

let c = b // 计算机内栈结构开辟出一个新的地址#003，改地址存储的值与地址#002存的值一样，都是2

c = 3 // 对地址#003存储的值进行更改，改为3，这并不会影响#002地址所存储的值，即c与b值得变化互相不会影响
```

那么，引用类型赋值时怎么回事呢？以下图为例

![引用类型赋值](./images/copy/copy2.png)

```js
let a = {name: 'jack', age: 17} // 计算机内堆结构开辟出一个新地址#301，用于存放 {name: 'jack', age: 17}。紧接着，栈结构开辟出一个新地址#001，该地址存放a变量，同时，#001指向#301这个堆地址

let b = {name: 'lucy', age: 19} // 计算机内堆结构开辟出一个新地址#302，用于存放 {name: 'lucy', age: 19}。紧接着，栈结构开辟出一个新地址#002，该地址存放b变量，同时，#002指向#302这个堆地址

let c = b // 栈结构开辟出一个新地址#003，该地址存放c变量，同时，#003指向#302这个堆地址，也就是说#002与#003指向的是同一个堆地址

c.name = 'lily' // 编译器找到c #003指向的#302这个堆地址存放的数据，并更改它

// 显而易见，由于c和b指向的是同一个堆地址，所以b也会受到影响，但这大多数时候并不是我们想要的结果
console.log(b.name) // 'lily'
```

可以看出，当我们把一个声明b的对象值赋值给另外一个声明c时，这两个声明用的其实是同一个对象引用，那么，如何避免这种情况呢？

显然，需要把b的堆对象在重新复制一遍产生新的堆对象地址，并且使c指向这个新的堆对象地址。

## 实现浅拷贝

```js
let b = {name: 'lucy', age: 19}
let c = {...b}
```
上述代码实现了一个简单的浅拷贝，...是展开运算符，应用的是for-of语法，本质上还是对b对象进行遍历。

当然，还有其他几种浅拷贝，比如

```js
Object.assign()
// 数组中还有：
Array.prototype.slice()
Array.prototype.concat()
```


## 实现深拷贝

```js
const newObj = JSON.parse(JSON.stringify(oldObj));
```

缺陷，对于引用类型以及循环引用的克隆存在问题：

- 无法实现对函数 、RegExp等特殊对象的克隆
- 会抛弃对象的constructor,所有的构造函数会指向Object
- 对象有循环引用,会报错

// 改进
```js
const clone = parent => {
  const isType = (obj, type) => {
    if(typpeof obj !== "obj") return false
    const typeString = Object.prototype.toString.call(obj)
    let flag
    switch(type) {
      case 'Array':
        
    }
  }
}
```

## 参考

- [浅拷贝与深拷贝](https://juejin.im/post/5b5dcf8351882519790c9a2e)
- [不要再问我 JS Clone 的问题了](https://juejin.im/post/5d5a8be3f265da03b638ad28)
- [搞不懂 JS 中赋值·浅拷贝·深拷贝的请看这里](https://juejin.im/post/5d235d1ef265da1b855c7b5d)
- [聊聊对象深拷贝和浅拷贝](https://juejin.im/post/5c26dd8fe51d4570c053e08b)
- [深克隆](https://www.cxymsg.com/guide/jsWritten.html#深克隆（deepclone）)
