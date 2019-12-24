# 异步的实践&注意事项

异步, asynchronous，在js中非常常见，是提高性能与改善用户体验的一种手段

## umi中

```js
const getData = async () => {
  await dispatch({}) // effect1 包含api请求
  await dispatch({}) // effect2
  await console.log(123)
  await dispatch({}) // reducer1
}
```
都是effect, reducer以及普通js表达式，按顺序执行

其中一个场景是，首先需要获取买房的allCondition，接着获取用户填写的部分condition，通过对condition与allCondition进行比对，产生新的params作为props传入组件中

```js
const getData = async () => {
  await dispatch({}) // 页面redux，获取allCondition
  await dispatch({}) // global redux，获取用户condition
  // 进行数据处理。。省略
  await dispatch({}) // 将处理后的数据通过reducer进行updateState
}
```