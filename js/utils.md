# JS 常用工具函数/代码片段

- [发送验证码倒计时](#发送验证码倒计时)
- [节流](#节流)
- [防抖](#防抖)
- [时间格式的处理](#时间格式的处理)
- [url 参数取值](#url参数取值)
- [配置 axios 拦截器](#配置axios拦截器)
- [jquery 的 ajax 配置](#jquery的ajax配置)
- [css 样式转换为 js 驼峰写法](#css属性转换为驼峰写法)

## 发送验证码倒计时

```js
const countDown = (ms = 60, cb = f => f) => {
  // 短信服务(Short Message Service) millisecond 毫秒 cb callback
  const timer = setInterval(() => {
    ms--
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

## 防抖

防抖 (debounce): 将多次高频操作优化为只在最后一次执行。通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。比如防止用户频繁的表单提交。

```js
function debounce(fn, delay) {
  // 定时器
  let timer = null
  return function() {
    // 保留调用时的this上下文, 因为setTimeout回调函数this是window，使用箭头函数就不用保留this了
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 每次事件被触发时，都去清除之前的旧定时器
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log("触发了滚动事件"), 1000)

document.addEventListener("scroll", better_scroll)

// 改变this与arguments
let b = { a: 555 },
  c = 5
better_scroll.call(b, c)
```

## 节流

节流(throttle): 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms 执行一次即可。

```js
function throttle(fn, interval) {
  let last = 0
  return function() {
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = Date.now() // 当前毫秒ms值
    if (now - last >= interval) {
      // 如果时间间隔大于设定的时间间隔
      last = now
      fn.apply(context, args)
    }
  }
}

const better_scroll = throttle(() => {
  console.log("触发了滚动事件")
}, 1000)
document.addEventListener("scroll", better_scroll)
```

## 时间格式的处理

```js
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}" // year month day hour minute second
  let date
  if (typeof time === "object") {
    date = time
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  // String.replace(regexp|substr, newSubstr|function)
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value]
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  return time_str
}
```

## url 参数取值

```js
// ?name=jack&age=18
function getQueryStringArgs(search = '') {
  const qs = search.length > 0 ? search.substring(1) : ''  // name=jack&age=18
  const args = {} // 保存数据的对象
  const items = qs.length > 0 ? qs.split('&') : [] // ['name=jack', 'age=18']
  const len = items.length

  for (let i = 0; i < len; i++) {
    const item = items[i].split('=') // ['name', 'jack']
    const name = decodeURIComponent(item[0])
    const value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value  // {name: 'jack'}
    }
  }
  return args
}
getQueryStringArgs(window.location.search)


// 正则表达式
function getQueryString (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return decodeURI(r[2]);
  return null;
},
```

## 配置 axios 拦截器

可以参照 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/request.js)

## jquery 的 ajax 配置

// 业务中用到的 ajax，需要根据自己的实际项目进行修改

```js
const config = { baseURL: "api.xxx.com" }
// params: url(请求路径), type(请求类型), data(post参数), isNeedToken(是否需要token), success(成功回调), error(失败回调), finally(不论成功失败都执行的回调)
const request = function(params) {
  $.ajax({
    url: config.baseURL + params.url,
    type: params.type || "get",
    data: params.data,
    // Content-Type: 'application/json',
    // data: JSON.stringify(params.data)
    // 添加请求头
    beforeSend: function(request) {
      var isNeedToken = params.isNeedToken === undefined //isNeedToken 默认值为 true
      if (!isNeedToken) {
        return
      }
      var access_token = localStorage.getItem("access_token")
      if (access_token) {
        request.setRequestHeader("Authorization", "Bearer " + access_token)
      }
    },
    // 成功回调
    success: function(res) {
      if (res.State && parseInt(res.RespCode) === 200) {
        params.success && params.success(res)
      } else {
        const errMsg = res.Message ? res.Message : "请求失败"
        console.error(res.Message)
        params.error && params.error(new Error(errMsg))
      }
      params.finally && params.finally()
    },
    // 失败回调
    error: function(err) {
      if (err.status === 401) {
        //重新登录
        window.location.replace("/login")
        return
      }
      const errMsg = err.responseJSON ? err.responseJSON.Message : "请求失败"
      console.error(errMsg)
      params.error && params.error(new Error(errMsg))
      params.finally && params.finally()
    }
  })
}
```

## css 样式转换为 js 驼峰写法

```js
function transformToCamel(s) {
  return s.replace(/-\w/g, function(x) {
    // \w 匹配字母或数字或下划线或汉字
    return x.slice(1).toUpperCase()
  })
}
transformToCamel("font-size") // fontSize
```

## 参考
