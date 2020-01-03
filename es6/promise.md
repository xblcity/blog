# Promise与AJAX

Promise可以解决异步代码的执行顺序问题，通过then实现异步函数的链式调用

MDN中这样解释：

> Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象

一个Promise有下面几种状态

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

```js
// 在控制台打印Promise函数
// Promise构造函数对象
{
  all: ƒ all(iterable)
  race: ƒ race(iterable)
  reject: ƒ reject(reason) 返回一个状态为rejected的Promise对象
  resolve: ƒ resolve(value) 返回一个状态为fulfilled的Promise对象
  prototype: Promise {Symbol(Symbol.toStringTag): "Promise", constructor: ƒ, then: ƒ, catch: ƒ, finally: ƒ} // 原型对象
}

// Promise prototype对象
{
  catch: ƒ catch(onRejected) 返回Promise对象，并且可以被链式调用
  then: ƒ then(onFulfilled, onRejected) 返回Promise对象，并且可以被链式调用
  finally: ƒ finally(onFinally)
  constructor: ƒ Promise()
}
```

因为 Promise.prototype.then 和  Promise.prototype.catch 方法返回promise 对象， 所以它们可以被链式调用。

## 1. 使用

### 1.1 创建Promise

```js
const myFirstPromise = new Promise((resolve, reject) => {
  // ?做一些异步操作，最终会调用下面两者之一:
  //
  //   resolve(someValue); // fulfilled
  // ?或
  //   reject("failure reason"); // rejected
});
```

想要某个函数拥有promise功能，只需让其返回一个promise即可。

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
```

模拟异步

```js
let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
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
  },1000)
})

myPromise.then(value => {
  console.log(value) 
}, err => {
  console.error(err) // 'error'
})

// 或者使用下面这个方法，推荐，可以对多个Promise出现的错误进行统一处理
myPromise.then(value => {
  console.log(value) 
}).catch(err => {
  console.error(err) // 'error'
})
```

## 2. Promise与ajax

### 2.1 Promise实现ajax get请求
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
myAsyncFunction('a.example.com').then(response => {
  console.log(response)
}).catch(error => {
  console.error(error)
})
```

## 2.2 处理Promise的错误

获取数据的操作是会有副作用(effect)的，所以我们需要处理数据请求的报错  
常用的数据请求库axios就是基于XMLHttpRequest与Promise的封装  
这里，我们用定时器模拟数据请求  
现在，我们有两个请求数据的函数，如下  
```js
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      reject('获取数据错误1')
    }, 2000)
  })
}

function fetchAnotherData() {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      reject('获取其他数据错误2')
    }, 3000)
  })
}
```

接下来，我们用几种方法来模拟数据请求出错的情况  
以下函数都是基于上面两个函数已经声明的情况  

### 2.4.1普通执行

```js
function myFetch() {
  fetchData()
  fetchAnotherData()
}
myFetch() 
// 输出： '获取数据错误1' '获取其他数据错误2'
// 由于`fetchData`和`fetchAnotherData`是一起发出的请求，所以会依次报两个Promise的错误
```

### 2.4.2 使用Promise.all方法
```js
function myFetch() {
  Promise.all([fetchAnotherData(), fetchData()]) // Promise.all()数组参数是执行函数，即加括号（）
}
myFetch()  
// 输出：'获取数据错误1'，可以证实两个请求函数是一起发出的，其中有一个reject则不继续执行了，Promise.all([]) 如果迭代的第一项就报错，就会停止迭代
```

### 2.4.3 使用async await
```js
async function myFetch() {
  await fetchAnotherData()
  await fetchData()
}
myFetch() // '获取其他数据错误2' 说明await Promise对象是按照顺序执行的
```

### 2.4.4 使用try catch
普通执行
```js
function myFetch() {
  try {
    fetchData()
    fetchAnotherData()
  } catch(err) {
    console.error('错误信息', err)
  } finally {
    console.log('执行完毕')
  }
}
myFetch()
// 执行完毕 '获取数据错误1' '获取其他数据错误2'
```
可以看到Promise.reject并没有被catch捕获到  
try...catch结构 只能是同步的，无法用于异步代码模式

改造一下，帮助理解
```js
function myFetch() {
  try {
    fetchData().then().catch(err => console.error(22, err))
    // fetchAnotherData()
    console.log(111)
  } catch(err) {
    console.error('错误信息', err)
  } finally {
    console.log('执行完毕')
  }
}
myFetch()
// 111 执行完毕 22：获取数据错误1(这个是在promise中出现的错误)
```

```js
async function myFetch() {
  try {
    await fetchData()
    await fetchAnotherData()
  } catch(err) {
    console.error('错误信息', err)
  } finally {
    console.log('执行完毕')
  }
}
myFetch()
// '错误信息 获取数据错误1' 执行完毕
// 错误信息被捕获到了
```
~~await做了什么操作呢 await fetchData() 相当于在后面加了一个catch()处理方法，方法返回了出错信息~~ 待考证  

下面这个例子，我们先不要声明fetchData函数
```js
async function myFetch() {
  try {
    fetchData()  
  } catch(err) {
    console.error('错误信息', err)
  } finally {
    console.log('执行完毕')
  }
}
myFetch()
// '错误信息 ReferenceError: fetchData is not defined' 执行完毕
```
可以证实，同步的代码错误是会被捕获到的

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
body是可选参数，可以是Bolb?等？ 一般不传

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
const xhr = new XMLHttpRequest()
// 初始化请求
xhr.open('GET', 'https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest')
// 设置请求头
xhr.setRequestHeader(..., ...)

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
```

## 4. 使用Promise发送ajax请求
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

## 参考

- [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)