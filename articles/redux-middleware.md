# redux中间件
在redux里面，有一个重要的问题没有处理：异步请求。  
dispatch action 之后， reducer立即计算出state, 这是同步更新state。  
dispatch action 之后， 过一段事件才执行reducer计算出state, 这是异步更新state。  
所以如何让reducer过一会才执行呢，就要用到redux的中间件  
其中比较出名的中间件是redux-thunk和redux-saga，也是是 redux 应用中最常用的两种异步流处理方式。 

如果在组件内部进行异步请求的处理，处理完成之后再`dispatch`对应action，这样违背了redux是数据源的理念，并且数据请求分散在各个组件内部，不易维护

## redux-thunk
引入redux插件后，我们可以在actionCreator内部编写异步逻辑、
redux作用即是将action从一个对象变成一个函数
```js
actionCreator.js
// 未引入之前
export const increment = (data) => {
  return {
    type: 'increment',
    payload: data
  }
}
// 引入之后
export const increment = (data) => {
  return async (dispatch) => {
    const response = await ajax(url, data)
    dispatch({
      type: 'increment',
      payload: response
    })
  }
}
```
引入之前，actionCreator return 一个需要dispatch的对象
引入之后，actionCreator return 一个函数，这个函数里面包含异步请求，函数的最后dispatch一个对象

在view层，我们只需要dispatch increment这个 creator，并传入参数就可以了

```js
import {increment} from './actionCreator'
class ... {
  componentDidMount() {
    increment()
  }
}
```

thunk中间件在store.js的引入
```js
import {applyMiddle, createStore} from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer.js'
const store = createStore(reducer, applyMiddleware(thunk))
```

redux-thunk缺点
- action虽然被拓展了，但是变得复杂了，后期可维护性降低
- 协调并发任务困难，当自己的action调用了别人的action，别人的action发生修改，则需要自己主动修改？

## redux-saga
在redux-saga中，UI组件不会主动去触发任务，它们会dispatch一个action来通知需要做何种变化  
saga包括三个部分
- worker saga 做所有的工作，如调用 API，进行异步请求，并且获得返回结果
- watcher saga 监听被dispatch的actions，当接收到action或者知道它被触发时，调用worker saga 执行任务  
- root saga 立即启动sagas的唯一入口

saga中间件在store.js的引入
```js
import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer.js'

const sagaMiddleware = createSagaMiddle()

const store = createStore(reudcer, applyMiddle(sagaMiddleware))
sagaMiddleware.run()
```

## 不使用中间件？异步处理写在mapStateToProps里面？
在view层的某个函数内部处理异步请求，处理完异步请求并获取到结果之后再dispatch一个action  
缺点是，
- 请求分散在很多view组件中，维护起来很麻烦 
- 如果有多个组件调用了这个请求，每个组件的mapDispatchToProps都需要写





### 参考
- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [react+redux，异步请求为什么要写在action creator里面？](https://segmentfault.com/q/1010000011463009)