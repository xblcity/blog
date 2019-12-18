# 常用工具函数/代码片段

- 发送验证码倒计时
- 节流
- 防抖
- 时间格式的处理
- 配置axios拦截器
- 多行文本与单行文本超出省略号

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

## 多行文本与单行文本超出省略号

单行文本,限制宽
```js
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

多行文本，限制宽与高
```js
// 使用
overflow: hidden;
text-overflow: ellipsis;

-webkit-box-orient: vertical; 
display: -webkit-box;
-webkit-line-clamp: 2; 

// umi中
overflow: hidden;
text-overflow: ellipsis;

/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
display: -webkit-box;
-webkit-line-clamp: 2;
```