# 关于数组的各种数据操作

- [一维数组去重](#一维数组去重)
- [数组元素为对象的去重](#数组元素为对象的去重)
- [二维数组转一维数组，从数组里取对象并合并对象成数组](#二维数组转一维数组，从数组里取对象并合并对象成数组)
- [树结构数据进行递归处理](#树结构数据进行递归处理)
- [树结构数据进行遍历查找](#树结构数据进行遍历查找)
- [Array 原型对象上的遍历方法](#array原型对象上的遍历方法)


## 一维数组去重

```js
const arr = [1, 3, 5, 5, 5, 5]

const distinct = (arr) => {
  return [...new Set(arr)] // new Set() 返回一个可迭代对象，将其转换成数组
}

distinct(arr) // [1,3,5]
```

## 数组元素为对象的去重

```js
function distinct(arr, key) {
  const map = new Map()
  return arr.filter((item) => !map.has(item[key]) && map.set(item[key], null)) // 检测map中没有[key]，有则返回false，无则向Map中设置值
}
const list = [
  {
    name: 'xbl',
    age: 15,
  },
  {
    name: 'xbl',
    age: 25,
  },
  {
    name: 'cc',
    age: 13,
  },
]
distinct(list, 'name')
```

## 二维数组转一维数组，从数组里取对象并合并对象成数组

```js
// 数据格式
const arrList = [
  [
    (type: 'home'),
    (news: [
      {
        name: 'home1',
        content: 'home111',
      },
      {
        name: 'home2',
        content: 'home222',
      }
    ]),
  ],
  [
    (type: 'user'),
    (news: [
      {
        name: 'user1',
        content: 'user111',
      },
      {
        name: 'user2',
        content: 'user222',
      }
    ]),
  ],
  [
    (type: 'friends'),
    (news: [
      {
        name: 'friends1',
        content: 'friends111',
      }
    ]),
  ],
]
```

如上所示，是一个二维数据，我们想分别取出数组的第一项和剩余的项，

```js
const [arr1, ...arr2] = arrList
```

现在 arr1 和 arr2 都是一维数组了,我们想把 arr 数组里面每一项的 news 对象数据，把他们合并为一个数组

```js
const newsList = news.reduce((prev, item) => {
  return [...prev, ...item.News]
}, [])
```

reduce 第二个参数必须要给，否则由于第一个 prev 不是可迭代的而报错(因为第一个是{type: ....,}这种形式的对象，不可迭代，不可使用...展开运算符)

## 树结构数据进行递归处理

```js
// 如下字段
const data = [
  {
    Name: '买房',
    ID: '123',
    Items: [
      {
        ID: '123123',
        Name: '新房',
      },
      {
        ID: '123456',
        Name: '买房风险',
      },
    ],
  },
  {
    Name: '卖房',
    ID: '456',
    Items: [
      {
        ID: '123167',
        Name: '卖旧买新',
      },
      {
        ID: '126890',
        Name: '卖房流程',
      },
    ],
  },
]
```

为了使数据能够适配，ant-mobile 的多级选择，现在的需求是把字段 ID 变为 value, Name 改为 value, Items 改成 children

```js
const filterData = (data) => {
  return data.map((item) => {
    const { Name, ID, Items = [] } = item
    return {
      label: Name,
      value: ID,
      children: Items && Items.length > 0 ? filterData(Items) : Items,
    }
  })
}
```

## 树结构数据进行遍历查找

在省市区选择的时候，根据已选择的 ID 进行查找对应的节点

比如现在有这么个数据结构

```js
const example = [
  {
    value: 1,
    label: '河北省',
    children: [
      {
        value: 11,
        label: '保定市',
        children: [
          {
            value: 111,
            label: '满城区',
            children: [],
          },
        ],
      },
      {
        value: 12,
        label: '石家庄市',
        children: [],
      },
    ],
  },
]
```

现在已知用户选择的是[1,11,111]，如何输出['河北省','保定市','满城区']

```js
let res = []
;[1, 11, 111].reduce((prev, current) => {
  const c = prev.find((v) => v.value === current)
  res.push(c.label)
  return c.children
}, example)
```

## Array 原型对象上的遍历方法

- for-in, 使用`break`可以终止循环，(只能跳出一层)，使用`continue`可以跳出本次循环
- for-of, 可以终止/跳出循环，

打断循环，在 h5 使用`rc-form`获取错误信息的时候用到了(如果是数组的话，建议用 find,filter 等实现)。比如：

```js
let info = {
  xblcity: {
    age: 17,
    message: '年龄过小',
  },
  xbl: {
    age: 37,
    message: '年龄过大',
  },
}

// 现在我们想获取info的第一个对象的message
let message
for (let i = 0; i < Object.keys(info).length; i++) {
  let findObj = info[Object.keys(info)[i]]
  message = findObj.message
  break
}
console.log(message) // 年龄过小
```

接着上述的例子，由于对象没有自带的迭代器，我们无法通过`for(item of info) {console.log(item)}`对其进行遍历，可以给该对象定义`Symbol.iterator`属性，使用`for-of`的时候会调用该方法

```js
let info = {
  xblcity: {
    age: 17,
    message: '年龄过小',
  },
  xbl: {
    age: 37,
    message: '年龄过大',
  },
}
info[Symbol.iterator]
```

- forEach arr.forEach(callback(currentValue [, index [, array]])[, thisArg])

不支持链式操作(因为没有返回值), 不能跳出循环，可以在迭代中使用`arr[index] = xxx`进行改变数组的操作

### 参数均为函数，且函数都有三个可选参数，第一个是项，第二个是下标，第三个是数组本身。

- every 数组的每一次循环都返回 true，则返回 true
- some 有一项循环返回 true，则返回 true，对性能比较友好
- find 返回符合的 **第一个项**， 否则返回 undefined
- findIndex 返回符合的项的**下标**
- indexOf 返回符合项的下标，与 findIndex 类似，用于一元简单数组
- filter 返回符合条件的数组
- map "map"即"映射"，也就是原数组被"映射"成对应新数组。 返回 数组每一项 的 全新值，**每一次遍历都要有 return 值，否则返回值是 undefined**

```js
let arr = [1, 2, 3]
arr = arr.map((item) => {
  return item * 2
})
```

### sort() 对数组进行排序 会改变原数组

```js
const arr = [
  {
    name: 'xbl',
    age: 17,
  },
  {
    name: 'city',
    age: 20,
  },
  {
    name: 'xblcity',
    age: 18,
  },
]
// 从大到小进行排序
let newArr = arr.sort((current, next) => {
  if (current.age < next.age) {
    // 前面的值 小于 后面的值, 交换顺序
    return 1 //  返回true, next在前，current在后
  } else if (current.age > next.age) {
    return -1 // 返回false, current在前，next在后
  } else {
    return 0 // 保持原来的顺序
  }
})
// 简洁写法
let anotherNewArr = arr.sort((current, next) => {
  return next.age - current.age // 小的在前，交换顺序
})
console.log(newArr)
console.log(anotherNewArr)
console.log(arr)
```

### reduce() 对数组进行计算

参数有两个，第一个是函数，函数有四个可选参数，上一次返回值，项，下标，原数组。 第二个参数用于第一次计算的返回值

```js
const arr = [1, 2, 3, 4, 5]
arr.forEach((item) => {
  console.log(item)
  if (item > 3) return
})
```