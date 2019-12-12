# 常用工具函数

## 发送验证码倒计时

```js
const countDown = (ms = 60, cb = f => f) => {  // 短信服务(Short Message Service) millisecond 毫秒 cb callback
  const timer = setInterval(() => {
    ms --
    if (ms < 1) {
      clearInterval(timer)
      cb(true, ms) // 执行回调函数
      return
    }
    cb(false, ms)
  }, 1000)
  return timer // 返回timerID
}
```