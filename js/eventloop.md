# JS 与 Node 事件队列/循环(Event Loop)

## JS 事件循环

### js 两种异步任务

js 包含同步代码与异步代码

js 异步任务包含宏观任务(macrotask)和微观任务(microtask),在 ES6 规范中分别为 tasks 和 jobs，宏任务里面可能包含多个微任务。

**宏任务开始执行** ——> **遇到微任务就将其 push 到微任务队列中** ——> **...同步代码执行完毕** ——> **微任务队列内的任务依次执行...** ——> **执行第二个宏任务...**

宏任务包括：`script(整体代码), setTimeout, setTimeInterval, postMessage, setImmediate, I/O, UI rendering`

微任务包括: `Promise process.nextTick(Node.js环境)`

如果**async 多层嵌套与 Promise 结合使用**会怎么样？这里不是很好理解。

### 示例 1

```js
setTimeout(function() {
  console.log(1)
})
new Promise(function(resolve, reject) {
  console.log(2)
  resolve(3)
}).then(function(val) {
  console.log(val)
})
console.log(4)
// 输出顺序 `2,4,3,1`
```

1. 开始执行整个代码块，`new Promise()`是立即执行的。所以输出 2。`promise实例.then()`是 Promise，微任务，被推进微任务执行队列中

2. `console.log(4)`输出 4

3. 宏任务同步代码执行完毕，执行微任务队列的任务，`promise实例.then()`输出 3

4. 宏任务同步代码与微任务均执行完毕，执行下一个宏任务`setTimeout`，输出 1

### 示例 2

```js
async function async1() {
  await async2()
  console.log("async1 执行完毕")
}
async function async2() {
  await console.log("async2 执行完毕")
}
async1()

setTimeout(function() {
  console.log("定时器执行完毕")
}, 0)

new Promise((resolve, reject) => {
  console.log("Promise开始执行")
  resolve()
})
  .then(function() {
    console.log("Promise.then执行")
  })
  .then(function() {
    console.log("Promise.then222执行")
  })

console.log("script同步队列执行完毕")

// 分别输出：async2 执行完毕， Promise开始执行，script同步队列执行完毕，Promise.then执行，async1执行完毕，Promise.then222执行,定时器执行完毕
```

这个例子比上面多了一个`async`异步函数，`async()`函数返回的是`Promise`实例对象，每次我们使用 await, async 会停下来执行 await 的代码，然后把剩下的 async 函数中的操作放到 then 回调函数中。

这里建议 async 可以看一下[阮一峰-ES6-async](http://es6.ruanyifeng.com/#docs/async)

1. 宏任务，即该段 JS 代码，执行`async1()`函数(即 new Promise())，执行`async2()`函数(即 new Promise())，`async2()`执行完毕，并返回一个 promise 实例，async1 之后的被推送至微任务执行队列

2. `new Promise()`立即执行， `promise实例.then()`被推送至微任务队列

3. 宏任务同步代码执行完毕，打印`script同步队列执行完毕`

4. 宏任务 的微任务队列任务依次执行，分别打印 `async1 执行完毕`(这个先打印是因为有 await) `Promise.then执行` `Promise.then222执行`

5. 第一个宏任务执行完毕，执行第二个宏任务`setTimeout`，打印`定时器执行完毕`

### 再一个例子

```js
console.log("script start")
async function async1() {
  await async2()
  console.log("async1 end")
}
async function async2() {
  console.log("async2 end")
}
async1()
setTimeout(function() {
  console.log("setTimeout")
}, 0)
new Promise(resolve => {
  console.log("Promise")
  resolve()
})
  .then(function() {
    console.log("promise1")
  })
  .then(function() {
    console.log("promise2")
  })
console.log("script end")

// 一次打印 script start  async2 end  Promise script end  async1 end promise1  promise2 setTimeout
```

对于微任务队列 打印的顺序是 `async1 end promise1 promise2` Chrome73 版本及之后，先执行 async1 再执行 promise1 和 promise2。区别在于`RESOLVE(thenable)`和`Promise.resolve(thenable)。`之间的区别

```js
async function f() {
  await p
  console.log("ok")
}
// 简化理解为
function f() {
  return RESOLVE(p).then(() => {
    console.log("ok")
  })
}
```

### 实际中的一个例子

```js
// ajax发送
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", url)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send()
  })
}

// 统一获取数据
fetchData()
async function fetchData() {
  // 获取查询条件
  const res1 = await getFilterData().next().value // 返回的是个promise
  console.log("res1", res1)
  // 根据查询条件进行匹配与设置参数
  const res2 = await getWant() //
  console.log("res2", res2)
  // 根据参数进行数据请求
  const res3 = await getData() //
  console.log("res3", res3)
}

// 获取数据1
function* getFilterData() {
  yield myAsyncFunction(
    "https://douban.uieee.com/v2/movie/top250?start=1&count=1"
  )
}

// 获取数据2
async function getWant() {
  const type = 1
  if (type === 1) {
    await getWantType1().next().value
  } else {
    await getWantType2().next().value
  }
}

// 获取数据3
async function getData() {
  return await getList().next().value // 使用return 拿到返回值
}

function* getWantType1() {
  yield myAsyncFunction(
    "https://douban.uieee.com/v2/movie/top250?start=1&count=2"
  )
}

function* getWantType2() {
  yield myAsyncFunction(
    "https://douban.uieee.com/v2/movie/top250?start=1&count=3"
  )
}

function* getList() {
  yield myAsyncFunction(
    "https://douban.uieee.com/v2/movie/top250?start=1&count=10"
  )
}
// 分别打印res1 Promise res2空 res3 Promise
```

async async 嵌套使用 return 拿到返回的 Promise

## 2. Node 事件循环

## 参考

- 较基础[Js 的事件循环(Event Loop)机制以及实例讲解](https://juejin.im/post/5b24b116e51d4558a65fdb70)

- 较详细[Event Loop 详解](https://github.com/xiaomuzhu/front-end-interview/blob/master/docs/guide/eventLoop.md)
