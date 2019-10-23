# 函数式编程

高阶函数：把函数作为参数，或是将函数作为返回值的函数，如`forEach, map, reduce, reduceRight, filter, every, some`

偏函数：根据不同的参数可以产生不同的返回函数  
柯里化函数：处理一个参数，返回一个函数，再处理一个参数，再返回一个函数
```js
// 柯里化
function add(x) {
  return function(y) {
    return x+y
  }
}

var inc = add(1)
var dev = add(1)
inc(1) // 2
dev(1) // 0

// 偏函数
function list() {
  return Array.prototype.slice.call(arguments)
}
// 创建一个有预设参数的函数
var leadingThirtysevenList = list.bind(undefined, 37)
var list2 = leadingThirtysevenList() // [37]
var list2 = leadingThirtysevenList(1,2,3) // [37,1,2,3]
```
举个例子，假设有一个Add(x,y,z)函数，接收x,y,z三个参数，返回x+y+z  
对于偏函数
```js
AddBySeven = Partial(Add, 7)
AddBySeven(5, 10) // return 22
```
偏函数固定了函数的一个或者多个参数，返回一个新的函数，接收剩下的参数，参数可能是一个或者多个

对于柯里化函数
```js
curryAdd = Curry(Add)
AddBySeven = curryAdd(7)
AddBySeven(5)(10)
```
柯里化函数是把一个有n个参数的函数变成只有一个参数的函数  
`Add = (x,y,z) => x+y+z` 变成了 ` curryAdd = x => y => z => x+y+z `


## 参考
- [偏函数与柯里化函数的区别](https://segmentfault.com/q/1010000008626058)