# JS常用工具函数/代码片段

- [发送验证码倒计时](#发送验证码倒计时)
- [节流](#节流)
- [防抖](#防抖)
- [时间格式的处理](#时间格式的处理)
- [url参数取值](#url参数取值)
- [配置axios拦截器](#配置axios拦截器)
- [jquery的ajax配置](#jquery的ajax配置)

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

节流(throttle): 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms执行一次即可。

```js
function throttle(fn, interval) {
  let last = 0
  return function() {
    // 记录本次触发回调的时间
    let now = Date.now() // 当前毫秒ms值
    if (now - last >= interval) {
      // 如果时间间隔大于设定的时间间隔
      last = now
      fn.apply(context, args)
    }
  }
}

const better_scroll = throttle(() => {console.log('触发了滚动事件')}, 1000)
document.addEventListener('scroll', better_scroll)
```

## 防抖

防抖 (debounce): 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。

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
    if(timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)

// 改变this与arguments
let b = {a: 555}, c = 5 
better_scroll.call(b, c)
```

## 时间格式的处理

```js
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}' // year month day hour minute second
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
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
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
```

## url参数取值

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
```

## 配置axios拦截器

参照 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/request.js)

```js
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
```

自有项目的配置

```js
import axios from 'axios';
import { Toast } from 'antd-mobile';
import config from '@/config';
import { clearToken } from '@/utils/token';

const request = axios.create();
request.defaults.baseURL = config.baseUrl;

request.interceptors.request.use(
  //拦截器,对参数进行验证
  async config => {
    // const token = getToken();
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

request.interceptors.response.use(
  async response => {

    // if (response.status === 200 && response.data instanceof Blob) {  //文件下载
    //   if (response.data.type === 'application/json') {
    //     const resData = await blobToJson(response.data);
    //     Toast.fail(resData.Message);
    //     return Promise.reject(resData.Message);
    //   }
    //   const contentDisposition = response.headers['content-disposition'];
    //   return {
    //     data: response.data,
    //     filename: decodeURIComponent(contentDisposition.split(';')[1].split('=')[1]),
    //   };
    // }

    if (response.data.RespCode === 200 && response.data.State === true) {
      return response.data;
    } else {
      const errMsg = response.data.Message;
      Toast.fail(errMsg);
      console.error('请求出错：', response);
      return Promise.reject(new Error(errMsg));
    }
  },
  async error => {
    if (error.response && error.response.status === 401) {
      console.error(error);
      clearToken();
      Toast.fail('请登录!');
      window.location.replace(`/login?redirect=${window.location.pathname}`);
      return false;
    }

    Toast.fail(error.message);
    return Promise.reject(error.message);   // 返回接口返回的错误信息
  },
);
```

## jquery的ajax配置