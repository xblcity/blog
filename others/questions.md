# 我的疑问与待做

解决了可能就会直接从这里删除，记录在其他部分

redux/dva 中

是 dispatch().then

还是 dispatch 与获取数据分开比较好

let 不存在变量提升，但是声明依然会被收集。但是不会被初始化，var 会被初始化为 undefined

```js
console.log(a)

console.log(a)
let a = 10 //  Cannot access 'a' before initialization
```

两段代码报错信息不一样

开心最重要，我现在

## 待做

### Jest/Enzyme 测试框架初识

[官网](https://jestjs.io)

#### Using Matchers

```js
test("two plus two is four", () => {
  expect(2 + 2).toBe(4)
})
```

非常的语义化，测试...希望...结果...

```js
test("object assignment", () => {
  expect({ name: "lili" }).toEqual({ name: "lili" })
})
```

这里要用 toEqual 而不是 toBe，因为两个对象的指针指向不同

#### 针对 react 的测试，Enzyme[ˈenzaɪm]

`yarn add enzyme enzyme-adapter-react-16`
