# 细碎知识点

## 对象的普通属性和可计算属性
普通属性可以通过`obj.propertyName`访问，也可以通过`obj[propertyName]`访问，后者propertyName必须是字符串。
可计算属性名字用`[]`包裹,访问也只能通过`obj[propertyBName]`访问，而不能通过obj.propertyName访问。
```js
const b = Symbol('b')
const c = 'my'
const obj = {
  a: 1,
  [b]: 2,
  [c + 'luffy']: 3
}
console.log(obj.a) // 1
console.log(obj.b) // undefined,可计算属性以obj.xx 的方式访问不到
console.log(obj['a']) // 1
console.log(obj[b]) // 2
console.log(obj[c + 'luffy']) // 3
```  

所有属性都具备**数据属性描述符**(data property descriptor)
或者**存取器属性描述符**(accessor property descriptor) 二者选一  
通过`Object.defineProperty()` 可以修改或者重新定义属性的一些特征
```js
const obj = {}
Object.defineProperty(obj, 'name', {
  value: 'jack',
  writable: true,
  enumerable: true,
  configurable: true
})
Object.defineProperty(obj, 'activity', {
  get() { return bValue; }, // 取值操作
  set(newValue) { bValue = newValue; }, // 设置值
  enumerable: true,
  configurable: true
})
```

## 多个箭头函数在一行
```js
const fooFunc = (firstNum) => (secondNum) => (thirdNum) => {
  console.log(firstNum, secondNum, thirdNum)
}
const fooFunc1 = fooFunc(1)
console.log(fooFunc1)
  // (secondNum) => (thirdNum) => {
  //   console.log(firstNum, secondNum, thirdNum)
  // }
const fooFunc2 = fooFunc1(2)
console.log(fooFunc2)
  // (thirdNum) => {
  //   console.log(firstNum, secondNum, thirdNum)
  // }
fooFunc2(3)
```
变量firstNum, secondNum为什么会缓存呢？？  
fooFunc是函数柯里化的应用？