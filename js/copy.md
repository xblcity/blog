# 赋值/浅拷贝/深拷贝

需要理解这三种概念的不同之处以及如何去使用。

这里推荐一些我认为不错的文章

- [浅拷贝与深拷贝](https://juejin.im/post/5b5dcf8351882519790c9a2e)
- [不要再问我 JS Clone 的问题了](https://juejin.im/post/5d5a8be3f265da03b638ad28)
- [搞不懂 JS 中赋值·浅拷贝·深拷贝的请看这里](https://juejin.im/post/5d235d1ef265da1b855c7b5d)
- [聊聊对象深拷贝和浅拷贝](https://juejin.im/post/5c26dd8fe51d4570c053e08b)

实现深克隆

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
