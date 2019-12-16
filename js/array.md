# 关于数组的各种数据操作

- 一维数组去重
- 对象数组去重
- 二维数组处理成一维数组
- 对路由数组进行递归处理

## 一维数组去重
```js
let arr = [1,2,2,3,3,5]
let newArr = new Set(arr) // [1,2,3,5]
```

## 对象数组去重
```js
let arr = [
  {
    name: 'ya',
    age: 17
  },
  {
    name: 'cc',
    age: 19
  },
  {
    name: 'ya',
    age: 20
  }
]

```

