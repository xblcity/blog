
## TEST
### js基础
- 函数声明会提升，函数表达式用var定义会提升
- 函数声明可能会引起混淆，因为被提升的缘故
- String是构造函数，string是变量类型， typeof String, typeof string, typeof "string", 在执行string类型时，会被强制转化成String类型
- `typeof xx` 得到的结果会是基础类型(除去null),和`function`以及`object`
- if 括号内 会通过`Boolean()` 方法进行强制转换， 被转换成false有以下4中情况 `空字符串'', 数字0， NaN, null或者undefined`
- 函数执行时，会创建一个上下文执行环境，当前执行的变量存在于上下文执行环境中
- `var e = {g: setTimeout(function(){alert(123)}, 1000)}` 执行 `alert(123)`
- `var t = {g: function() {setTimeout(function(){alert(123)}, 1000)}}` 无反应
- > 函数重载：同一个函数名，但参数不一样，系统会根据你输入的参数类型或者参数的个数来判断要点用的函数！

### ES6
- ... 扩展运算符 扩展 Object和Array类型数据
- 类似 `{bb: {cc: 123}}` 可以使用`...bb` 解构出 {cc: 123}，而 `bb = {cc: 123}`无法使用`...bb` bb不是键值对的形式？
```js
const {name, ...others} = {
  name: 'jack',
  age: 17,
  gender: 'male'
}
console.log(others)
console.log({...others})

const [num, ...rest] = [1,2,3,4,5]
console.log(rest)
console.log([...rest])
//? es5实现
```
- `const bb = { cc: 123, dd: 456}` 打印 `{...bb}` 与 `bb` 相同结果
- `new Promise(resolve => f => f, reject => f => f)` 与 `Promise.resolve(f => f)` 区别


### CSS
- 直系父元素有高度，height: 100%才生效

### react基础
- 组件状态销毁时机，redux在SPA销毁时销毁
- react 组件更新机制，校验state是否改变，改变则重新渲染组件
- layout的公共部分，状态不改变的话，不会被重新挂载， `render() ===> DidComponentMount ===> render()`
- React在 mounting和Updating阶段 会触发render,,
- 动态路由 /book/:id 可以是 /book/1 book/2 等等，用route.params取出, params: {id: 1}
- /book?id=1， 参数路由， 用route.query查出


