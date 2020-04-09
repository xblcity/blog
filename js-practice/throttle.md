# 理解节流与防抖函数

节流(throttle)函数，可以降低触发频率，每隔一段时间才去执行一次，常用于resize, scroll等触发非常频繁但同时需要及时响应的场景。

防抖(debounce)函数，可以防止用户频繁触发某一操作，当用户不再频繁触发时(比如间隔300ms)，才去执行那个操作，常用于`input``onchange`事件，表单提交`submit`等。

## 节流函数

### 无定时器版本

```js
/**
 * 节流函数，降低触发频率，比如表单提交以及resize,scroll事件等
 * @param {Function} fn 回调函数
 * @param {number} interval 触发间隔
 */
const throttle = (fn, interval) => {
  let last = 0;
  return (...args) => {
    let context = this;
    let now = Date.now();
    // 节流函数在第一次执行的时候一定会触发一次
    if (now - last >= interval) {
      last = now;
      fn.apply(context, args);
    }
  };
};
```

使用

```js
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)
document.addEventListener('scroll', better_scroll)
```

`throttle`是一个高阶函数，传入的参数包含函数，且返回的也是一个函数。所以也自然形成了闭包。

上例中，使用了`better_scroll`接收了`throttle`返回的函数，在`better_scroll`函数内部持续引用这`last`的值，导致`throttle`内部的值`last`一直得不到销毁，所以形成了闭包。

疑问一：既然没有使用定时器，那还有保存`this`的必要吗？

个人觉得没必要，因为`this`在执行时上下文环境没有发生变化，即由代码`let context = this;`到`fn.apply(context, args);`上下文环境没有发生变化，所以是没有必要的。

```js
const throttle = (fn, interval) => {
  let last = 0;
  return (...args) => {
    let now = Date.now();
    // 第一次一定会触发
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
};
```

疑问二: 有必要使用`apply`来保存`this`并传参吗，下面的代码和上面的代码有区别吗

```js
const throttle = (fn, interval) => {
  let last = 0;
  return (...args) => {
    let now = Date.now();
    // 第一次一定会触发
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
};
```

个人觉得并不要给返回的函数重新绑定this.

疑问三：args参数有必要吗？

看一下传args效果

```js
const scrollMethod = (...args) => {
  console.log('触发滚动事件')
  console.log('参数是：', ...args)
}
const better_scroll = throttle(scrollMethod, 1000)
const better_scroll_params = better_scroll(5,6,7)
document.addEventListener('scroll', better_scroll_params)
```
结果只在页面第一次加载的时候执行了该函数，多次滚动并没有触发`better_scroll_params`该函数，为什么呢？因为`better_scroll_params`函数是已经执行好了的函数，并不是函数的定义，所以也就只在第一次执行了一次。

从上面来看，args参数确实是没必要的。

### 有定时器版本

定时器版本和无定时器版本主要区别：

1. 定时器版本不会立即执行
2. 定时器版本会有产生宏任务setTimoutout

```js
/**
 * 定时器版本节流函数
 * @param {Function} func
 * @param {number} wait
 */
const throttle = (func, wait) => {
  let timerId;
  return function foo() {
    let context = this;
    let args = arguments;
    // 每隔一段时间触发一次，不需要清除定时器
    if (!timerId) {
      timerId = setTimeout(function () {
        timerId = null;
        func.apply(context, args);
      }, wait);
    }
  };
};
```

以上面这个定时器版本，来看待非定时器版本的节流函数存在的几个问题。

1. 保存this有必要吗？

可以保存，因为在`setTimeout`的第一个函数参数中，`this`是`window`，所以需要把`this`执行改为`foo`函数的`this`。但如果使用了**箭头函数**，就不用保存，但是个人觉得这里的环境并没有什么实际作用(因为我们不需要重新给foo绑定this)

```js
const throttle = (func, wait) => {
  let timerId;
  return function foo(...args) {
    if (!timerId) {
      timerId = setTimeout(() => {
        timerId = null;
        func.apply(this, args);
      }, wait);
    }
  };
};
```

2. 有必要使用apply吗？
3.有必要使用args吗？

个人觉得都没必要，理由也是和不使用定时器版本的理由一样，

```js
const throttle = (func, wait) => {
  let timerId;
  return function foo(...args) {
    if (!timerId) {
      timerId = setTimeout(() => {
        timerId = null;
        func();
      }, wait);
    }
  };
};
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)
document.addEventListener('scroll', better_scroll)
```

### 补充在react中遇到的问题

1. 假如为`window`使用`addEventListtener`绑定了`scroll`事件，那么在组件卸载时使用`removeEventlistener`移除事件时，需要保证两个事件函数是同一个引用

## 防抖函数

```js
/**
 * 防抖函数，频繁操作只会执行最后一次
 * @param {Function} func 回调函数
 * @param {number} delay 延迟
 */
export const debounce = (func, delay) => {
  let timer;
  return function foo(...args) {
    // debugger;
    // console.log(this, 98989898);
    let context = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // 普通函数需要执行this func()直接执行this 是window
      // 箭头函数 this是静态语法 即与setTimeout所处环境的this一致，即与函数debounceReturnCb环境一致
      // apply第二个是数组
      func.apply(context, args);
      clearTimeout(timer);
    }, delay);
  };
};
```


## 参考

- [前端性能优化原理与实践](https://juejin.im/book/5b936540f265da0a9624b04b/section/5bb6212be51d451a3f4c3570)