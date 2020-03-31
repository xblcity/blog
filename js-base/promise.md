# Promise与AJAX

Promise可以解决**异步代码的执行顺序**问题，通过`then()`实现**异步函数的链式调用**，可以解决之前存在的**回调地狱**问题。

## 1. 如何使用

### 1.1 创建Promise

一个Promise有下面几种状态

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

只有当Promise的状态是`fulfilled`或者`rejected`的时候，才可以使用`then()`进行链式调用，状态一旦确定，无法改变

```js
Promise.resolve('hello') 
// 等同于下面这行, 两者都会立即执行
new Promise(resolve => resolve('hello'));  // fulfilled

// 立即返回一个状态为rejected的Promise
Promise.reject('throw error')
// 等同于下面这行, 两者都会立即执行
new Promise((resolve,reject) => reject('throw error'))
```

### 1.2 Promise Api

```js
// Promise构造函数对象
{
  all: ƒ all(iterable) 通常会用来处理 多个并行异步操作
  race: ƒ race(iterable) 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理。
  reject: ƒ reject(reason) 返回一个状态为rejected的Promise对象
  resolve: ƒ resolve(value) 返回一个状态为fulfilled的Promise对象
}

// Promise prototype对象
{
  catch: ƒ catch(onRejected) 返回Promise对象，并且可以被链式调用
  then: ƒ then(onFulfilled, onRejected) 返回Promise对象，并且可以被链式调用
  finally: ƒ finally(onFinally)
}
```

因为 Promise.prototype.then 和  Promise.prototype.catch 方法返回promise 对象， 所以它们可以被链式调用。

### 1.3 常见用法

想要某个函数拥有promise功能，只需让其返回一个promise即可。这样的好处是可以**传递参数**，可以自己决定**执行时机**，因为Promise**新建就开始执行**

```js
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};
// 调用
myAsyncFunction('https://douban.uieee.com/v2/movie/top250?start=1&count=1').then(res => {
  console.log(res)
})
```

模拟异步

```js
let myFirstPromise = new Promise(function(resolve, reject){
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```

捕获错误

```js
const myPromise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    reject('error')
  }, 1000)
})

myPromise.then(value => {
  console.log(value) 
}, err => {
  console.error(err) // 'error'
})

// 或者使用下面这个方法，推荐，可以对多个Promise出现的错误进行统一处理
myPromise.then(value => {
  console.log(value) 
}).catch(err => { // 捕获前面then()出现的异常
  console.error(err) // 'error'
})
```

## 2. Promise与ajax

### 2.1 异步加载图片

```js
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Reject: Could not load image at ' + url));
    };

    image.src = url;
  });
}

loadImageAsync('https://w.wallhaven.cc/full/vg/wallhaven-vg3wm5.jp').then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

### 2.2 Promise实现ajax get请求

```js
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}
// 使用
myAsyncFunction('https://douban.uieee.com/v2/movie/top250?start=1&count=1').then(response => {
  console.log('response',response)
}).catch(error => {
  console.error('error',error)
})
```

```js
function ajaxFetch(url) {
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.onload = function() {
      if(request.status === 200) {
        resolve(request.response)
      } else {
        reject(Error('error:', request.statusText))
      }
    }
    request.onerror = function() {
      reject(Error('network error'))
    }
    // 发送请求
    request.send()
  })
}
```

### 2.3 处理Promise的错误

获取数据的操作是会有副作用(effect)的，比如常见的400, 401, 404等错误，所以我们需要处理数据请求可能会出现的错误

`try-catch`只能捕获同步代码中的错误，如果想要在执行Promise的时候捕获错误，需要使用`generator`或者`async`将其改造成同步代码

## 3. XMLHttpRequest对象/函数

### 3.1 XMLHttpRequest实例对象包含以下方法

#### 3.1.1 open()
```js
// 初始化请求
XMLHttpRequest.open(method, url, async, user, password)
```
- method可以是 "GET", "POST", "PUT", "DELETE", etc
- url是一个string字符串，发送请求去向的链接
- async可选参数，默认是true
- 后面两个是authentication权限认证时使用到，暂时没用过 

#### 3.1.2 setRequestHeader()
设置请求头
`XMLHttpRequest.setRequestHeader(header, value)`  
header表示键名，value是设置的值

#### 3.1.3 send()
发送请求
`XMLHttpRequest.send(body)`  
body是可选参数，可以是Bolb?等, Bolb一般是上传文件才会用到 一般不传

### 3.2 XMLHttpRequest实例对象包含以下属性
```js
// 状态，0表示未发送unsend, 1表示opened已发送，2表示请求头已被接收， 3表示loading加载，4表示请求完成
XMLHttpRequest.readyState
// 请求的状态 200表示请求返回成功
XMLHttpRequest.status
// 返回完整的请求状态，如“200 OK”
XMLHttpRequest.statusText
// 返回js对象或者DOM字符串
XMLHttpRequest.response 
// 返回DOM字符串
XMLHttpRequest.responseText 
```

### 3.3 XMLHttpRequest实例对象发送请求后的回调函数
```js
let xhr = new XMLHttpRequest();
// 请求成功回调函数
// e是request事件...暂时不了解
xhr.onload = e => {
  console.log('request success');
};
// 请求结束
xhr.onloadend = e => {
  console.log('request loadend');
};
// 请求出错
xhr.onerror = e => {
  console.log('request error');
};
// 请求超时
xhr.ontimeout = e => {
  console.log('request timeout');
};
// 监听变化，异步请求才可以使用
xhr.onreadystatechange = callback
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  } else {
    console.error('请求出错！')
  }
}
```

### 3.4 一次简单的XMLHttpRequest请求
```js
function getJSON() {
  const xhr = new XMLHttpRequest()
  // 初始化请求
  xhr.open('GET', 'https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest')
  // 设置请求头
  // xhr.setRequestHeader(..., ...)

  // 用回调函数监听变化并做相应处理
  xhr.onreadystatechange = function() {
    // 请求完成
    if (xhr.readyState === 4) {
      // 请求状态时200的情况
      if (xhr.status === 200) {
        // 打印返回的数据
        console.log(xhr.response);
      } else {
        // 404,401等错误的处理
        // 需要与后端字段配合
        console.error(xhr.response.errorMessage)
        console.error(xhr.statusText)
      }
    }
  }
  xhr.onerror = function() {
    new Error('network error')
  }

  // 发送请求
  xhr.send()

  return xhr
}
getJSON()
```

## 参考

- [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)