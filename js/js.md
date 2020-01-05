# JS常用工具函数/代码片段

- 发送验证码倒计时
- 节流
- 防抖
- 时间格式的处理
- 配置axios拦截器

## 发送验证码倒计时

```js
const countDown = (ms = 60, cb = f => f) => {  // 短信服务(Short Message Service) millisecond 毫秒 cb callback
  const timer = setInterval(() => {
    ms --
    if (ms < 1) {
      clearInterval(timer) // 当倒计时为0时，自动清理定时器，否则需要在外面手动清理
      cb(true, ms) // 执行回调函数
      return
    }
    cb(false, ms)
  }, 1000)
  return timer // 返回timerID
}
```

## 节流

## 防抖

## 时间格式的处理

## 配置axios拦截器
