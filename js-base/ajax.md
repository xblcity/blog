# AJAX

## 1. Promise 与 Ajax

### 1.1 Promise 实现 ajax get 请求

简单模拟

```js
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}
// 使用
myAsyncFunction('https://douban.uieee.com/v2/movie/top250?start=1&count=1')
  .then((response) => {
    console.log('response', response)
  })
  .catch((error) => {
    console.error('error', error)
  })
```

```js
function ajaxFetch(url) {
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.onload = function() {
      if (request.status === 200) {
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

### 1.2 异步加载图片

```js
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image()

    image.onload = function() {
      resolve(image)
    }

    image.onerror = function() {
      reject(new Error('Reject: Could not load image at ' + url))
    }

    image.src = url
  })
}

loadImageAsync('https://w.wallhaven.cc/full/vg/wallhaven-vg3wm5.jp')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
```

### 1.3 异步错误处理

获取数据的操作是会有副作用(effect)的，比如常见的 400, 401, 404 等错误，所以我们需要处理数据请求可能会出现的错误

`try-catch`只能捕获同步代码中的错误，如果想要在执行 `Promise` 的时候捕获错误，需要使用`generator`或者`async`将其改造成同步代码

## 2. XMLHttpRequest 对象/函数

### 2.1 XMLHttpRequest 实例对象包含以下方法

#### 2.1.1 open()

```js
// 初始化请求
XMLHttpRequest.open(method, url, async, user, password)
```

- method 可以是 "GET", "POST", "PUT", "DELETE", etc
- url 是一个 string 字符串，发送请求去向的链接
- async 可选参数，默认是 true
- 后面两个是 authentication 权限认证时使用到，暂时没用过

#### 2.1.2 setRequestHeader()

设置请求头
`XMLHttpRequest.setRequestHeader(header, value)`  
header 表示键名，value 是设置的值

#### 2.1.3 send()

发送请求
`XMLHttpRequest.send(body)`  
body 是可选参数，可以是 Bolb?等, Bolb 一般是上传文件才会用到 一般不传

### 2.2 XMLHttpRequest 实例对象包含以下属性

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

### 2.3 XMLHttpRequest 实例对象发送请求后的回调函数

```js
let xhr = new XMLHttpRequest()
// 请求成功回调函数
// e是request事件...暂时不了解
xhr.onload = (e) => {
  console.log('request success')
}
// 请求结束
xhr.onloadend = (e) => {
  console.log('request loadend')
}
// 请求出错
xhr.onerror = (e) => {
  console.log('request error')
}
// 请求超时
xhr.ontimeout = (e) => {
  console.log('request timeout')
}
// 监听变化，异步请求才可以使用
xhr.onreadystatechange = callback
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText)
  } else {
    console.error('请求出错！')
  }
}
```

### 2.4 一次简单的 XMLHttpRequest 请求

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
        console.log(xhr.response)
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
