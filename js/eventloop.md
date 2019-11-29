# JS与Node事件队列/循环(Event Loop)

## js事件队列

### js两种任务

js包含宏观任务(macrotask)和微观任务(microtas),在ES6规范中分别为tasks和jobs  
宏任务里面包含多个微任务
宏任务开始执行..多个微任务依次执行(其中同步代码先执行)..执行第二个宏任务..再执行一队微任务  
宏任务包括：script, setTimeout, setTimeInterval, setImmediate, I/O, UI rendering
微任务包括: Promise

```js
async function async1() {
  await async2()
  console.log('async1 执行完毕')
}
async function async2() {
  await console.log('async2 执行完毕')
}
async1()

setTimeout(function () {
  console.log('定时器执行完毕')
}, 0)

new Promise((resolve, reject) => {
  console.log('Promise开始执行')
  resolve()
}).then(function () {
  console.log('Promise.then执行')
})

console.log('script同步队列执行完毕')

// 分别输出：async2 执行完毕， Promise开始执行，script同步队列执行完毕，Promise.then执行，aynsc1执行完毕，定时器执行完毕
```

## 2. Node事件循环

## 参考

[Event Loop详解](https://github.com/xiaomuzhu/front-end-interview/blob/master/docs/guide/eventLoop.md)