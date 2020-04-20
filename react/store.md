# 使用React-Hook封装全局状态管理

使用`React`最新的`hook api`完全可以实现`redux`一样的效果

使用之前我们，先来熟悉一下`useReducer`和`useContext`这两个`api`

## useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```
useReducer接收3个参数

第一个参数，reducer函数，这个函数和redux里面的reducer类似，该函数类似于`(state, action) => newState`

第二个参数，初始state，

返回两个参数，一个是state，一个是dispatch方法，用于改变state，这个和redux就很相似了
