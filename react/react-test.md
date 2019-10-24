# Jest测试框架使用
[官网](https://jestjs.io)

## Using Matchers
```js
test('two plus two is four', () => {
  expect(2 + 2).toBe(4)
})
```
非常的语义化，测试...希望...结果...
```js
test ('object assignment', () => {
  expect({name: 'lili'}).toEqual({name: 'lili'})
})
```
这里要用toEqual而不是toBe，因为两个对象的指针指向不同

## 针对react的测试，Enzyme[ˈenzaɪm]
`yarn add enzyme enzyme-adapter-react-16`