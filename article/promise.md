# Promise与处理错误

## Promise概念
Promise是一个构造函数
语法：new Promise( function(resolve, reject) {...} /* executor */  );
- executor(执行者)是一个带有resolve和reject两个参数的函数
- Promise构造函数执行时立即调用executor，当resolve函数执行时，promise的状态变为fulfilled(完成)，当reject函数执行时,promise状态变为rejected(失败)、
- exector函数的返回值会被忽略，exector返回的是Promise对象 

基本用法
```js
const myPromise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve('foo')
  },1000)
})
myPromise.then(value => {
  console.log(value) // 'foo'
})
```
Promise原型对象上有then和catch两个方法，它们都返回Promise对象，并且可以被链式调用  
其中then方法可以传入两个参数，第二个参数用于处理错误
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

// 或者使用下面这个方法，推荐，可以对出现的错误进行统一处理
myPromise.then(value => {
  console.log(value) 
}).catch(err => {
  console.error(err) // 'error'
})
```
### Promise提供的方法
```js
Promise.resolve(reason) // 返回一个状态为fulfilled的Promise对象
Promise.reject(value) // 返回一个状态为rejected的Promise对象
Promise.all(itrable) // 传入一个可迭代对象，如数组
```

### Promise原型上的方法
```js
Promise.prototype.then(onFulfilled, onRejected)
Promise.prototype.catch(onRejected)
Promise.prototype.finally(onFinally)
```
### Promise实现ajax get请求
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

## 处理Promise的错误
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
1.普通执行
```js
function myFetch() {
  fetchData()
  fetchAnotherData()
}
myFetch() 
// 输出： '获取数据错误1' '获取其他数据错误2'
// 由于`fetchData`和`fetchAnotherData`是一起发出的请求，所以会依次报两个Promise的错误
```

2.使用Promise.all方法
```js
function myFetch() {
  Promise.all([fetchAnotherData(), fetchData()]) // Promise.all()数组参数是执行函数，即加括号（）
}
myFetch()  
// 输出：'获取数据错误1'，可以证实两个请求函数是一起发出的，其中有一个reject则不继续执行了，Promise.all([]) 如果迭代的第一项就报错，就会停止迭代
```

3.使用async await
```js
async function myFetch() {
  await fetchAnotherData()
  await fetchData()
}
myFetch() // '获取其他数据错误2' 说明await Promise对象是按照顺序执行的
```

4.使用try catch
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
// 111 执行完毕 22：获取数据错误1
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



- 参考 [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)