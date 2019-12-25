# 关于数组的各种数据操作

- 一维数组去重
- 数组每一项为引用类型的去重
- 二维数组转一维数组，从数组里取对象并合并对象成数组
- 对路由数组进行递归处理
- 对后端传回树结构数据进行递归处理
- 数组循环中止

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

## 二维数组转一维数组，从数组里取对象并合并对象成数组

```js

// 数据格式
const arrList = [
  [
    type: 'home',
    news: [
      {
        name: 'home1',
        content: 'home111'
      },
      {
        name: 'home2',
        content: 'home222'
      }
    ]
  ],
  [
    type: 'user',
    news: [
      {
        name: 'user1',
        content: 'user111'
      },
      {
        name: 'user2',
        content: 'user222'
      }
    ]
  ],
  [
    type: 'friends',
    news: [
      {
        name: 'friends1',
        content: 'friends111'
      }
    ]
  ],
]
```

如上所示，是一个二维数据，我们想分别取出数组的第一项和剩余的项，

```js
const [arr1, ...arr2] = arrList
```

现在arr1和arr2都是一维数组了,我们想把arr数组里面每一项的news对象数据，把他们合并为一个数组

```js
const newsList = news.reduce((prev, item) => {
  return [...prev, ...item.News]
}, [])
```

reduce第二个参数必须要给，否则由于第一个prev不是可迭代的而报错(因为第一个是{type: ....,}这种形式的对象，不可迭代，不可使用...展开运算符)

## 对后端传回字段进行递归处理

```js
// 如下字段
const data = [
  {
    Name: '买房',
    ID: '123',
    Items: [
      {
        ID: '123123',
        Name: '新房'
      },
      {
        ID: '123456',
        Name: '买房风险'
      },
    ]
  },
  {
    Name: '卖房',
    ID: '456',
    Items: [
      {
        ID: '123167',
        Name: '卖旧买新'
      },
      {
        ID: '126890',
        Name: '卖房流程'
      },
    ]
  }
]
```

现在的需求是把字段ID变为value, Name改为value, Items改成children 

```js

```
