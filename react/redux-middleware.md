# Redux中间件

在redux里面，有一个重要的问题没有处理：异步请求。  
dispatch action 之后， reducer立即计算出state, 这是同步更新state。  
dispatch action 之后， 过一段事件才执行reducer计算出state, 这是异步更新state。  
所以如何让reducer过一会才执行呢，就要用到redux的中间件  
其中比较出名的中间件是redux-thunk和redux-saga，也是是 redux 应用中最常用的两种异步流处理方式。 

如果在组件内部进行异步请求的处理，处理完成之后再`dispatch`对应action，这样违背了redux是数据源的理念，并且数据请求分散在各个组件内部，不易维护  

异步请求开始的时候，dispatch一个action通知reducer异步请求已发出，异步请求结束的时候，再dispatch一个action通知reducer异步请求结束，传回数据，改变state，更新view视图

## redux-thunk
引入redux插件后，我们可以在actionCreator内部编写异步逻辑  
redux-thunk作用即是将action从一个对象变成一个函数  

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
      payload: response.data
    })
  }
}
// 如果开始fetchData的时候，也记录一个状态，需要有两个dispatch
export const increment = (data) => {
  return async (dispatch) => {
    dispatch({type: 'fetch_request'})
    fetch(url).then(data => dispatch({
      type: 'fetch_success',
      data
    }))
  }
}
```
引入之前，actionCreator return 一个需要dispatch的对象
引入之后，actionCreator return 一个函数，这个函数里面包含异步请求，函数的最后dispatch一个对象

在view层，我们只需要dispatch increment这个 creator，并传入参数就可以了
```js
import store from './store/index'
import {increment} from './store/actionCreator'

class ... {
  componentDidMount() {
    store.dispatch(increment(...))
    // dispatch一个异步函数，这个函数由redux-thunk处理，处理完成之后，自动dispatch一个对象给reducer处理
  }
}
```

thunk中间件在store.js的引入
```js
import {applyMiddle, createStore, compose} from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer.js'
const store = createStore(reducer, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))
```

redux-thunk缺点
- action虽然被拓展了，但是变得复杂了，后期可维护性降低
- 协调并发任务困难?

## redux-saga
在redux-saga中，UI组件不会主动去触发任务，它们会dispatch一个action来通知需要做何种变化，即dispatch一个对象???  
saga包括三个部分
- worker saga 做所有的工作，如调用 API，进行异步请求，并且获得返回结果，如`call put`这些api
- watcher saga 监听被dispatch的action，当接收到action或者知道它被触发时，调用worker saga 执行任务，主要是由`take takeEvery`来监听  
- root saga 立即启动sagas的唯一入口

saga中间件在store.js的引入
```js
import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer.js'
import saga from './saga'

const sagaMiddleware = createSagaMiddle()

const store = createStore(reudcer, applyMiddle(sagaMiddleware), )
sagaMiddleware.run(saga)
```

### redux-saga处理提交action
```js
// 获取数据的generator
function* fetchProducts(dispatch) {
  const products = yield call(Api.fetch, '/products')
  dispatch({ type: 'PRODUCTS_RECEIVED', products })
}
// 缺点，在generator直接调用了fetch，不容易测试
// 改造，使用put api
import { call, put } from 'redux-saga/effects'

function* fetchProducts() {
  const products = yield call(Api.fetch, '/products')
  // create and yield a dispatch Effect
  yield put({ type: 'PRODUCTS_RECEIVED', products })
}
```
使用：在componentDidMount的时候,dispatch一个actions,begin_fetch_data,  
redux监听到这个begin_fetch_data执行了，然后执行fetchData的generator操作，fetchData的最后dispatch一个get_data的action,并传递参数data  
最后dispatch一个action,fetch_end，通知reducer数据获取完毕

#### 下面是一个例子
reducer.js
```js
const initState = {
  isFetching: false
  list: null
}
// constant
const FETCH_START = 'fetchStart'
const FETCH_END = 'fetchEnd'
const FETCH_LIST = 'fetchList'
// reducer
const reducer = (state = initState, actions) => {
  switch(actions.type) {
    case FETCH_START:
    case FETCH_END:
      return {...state, actions.state}
    case FETCH_LIST:
      return {...state, actions.list}
    default：
      return state
  }
}
// actionCreators
export const getListStart = (state) => {
  return {
    type: FETCH_START,
    data: state
  }
}
export const getListEnd = (state) => {
  return {
    type: FETCH_END,
    data: state
  }
}
export const getList = (data) => {
  return {
    type: GET_LIST,
    data
  }
}
```

store.js  
立即启动saga的入口，rootSaga
```js
import {createStore, applyMiddle, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducer'
import sagas from './saga'
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, compose(applyMiddleware(sagaMiddleware)), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

sagaMiddleware.run(sagas)
export default store
```

saga.js
处理effect的workerSaga，监听action变化的watchSaga
```js
import {takeEvery, put, call} from 'redux-saga/effects'
import { GET_LIST, GET_LIST_START} from './reducer' // constance 常量
import { getList, getListEnd } from './reducer' // actionCreators
import axios from 'axios'

function *sagas() {
  // 如果GET_LIST_START action触发，则执行getListSaga这个generator
  yield takeEvery(GET_LIST_START, getListSaga)
}

function *getListSaga() {
  // call用于发送ajax请求
  const res = yield call(axios.get, 'http://yapi.demo.qunar.com/mock/80729/api/redux/todolist')
  // put用于提交action至reducer
  yield put(getList(res.data.data.list))
  // 发送一个数据获取完成的action
  yield put(getListEnd(false))
}

export default saga
```

List.js
```js
import store from './store'
import React from 'react'
import {getListStart} from './reducer'

class List extends React.Component {
  state = {
    list: store.getState().list
  }
  componentDidMount() {
    store.dispatch(getListStart(true))
  }
  render() {
    return(
      <div>{this.state.list}</div>
    )
  }
}
```

### redux-saga api 处理副作用
#### put
put 用于函数参数是一个对象，发送给reducer处理的action

#### call
call 是发送异步请求时使用的api，第一个参数时fetchApi（函数，且不带参数），第2-n个参数是传递给fetchApi的参数

#### select
指示`middleware`调用选择器获取store上的state数据，与redux中`store.getState()`作用一致
```js
function *watchData() {
  const state = yield select()
  // 或者传递参数，获取部分state?
  const state = yield select().userInfo
  // 或者解构
  const {info} = yield select()
}
```

#### fork
fork与call类似，但是是非阻塞函数，执行完`yield fork(fn, args)`,会立即向下执行，而不会等待fn执行返回的结果

#### take
参数：pattern，也就是一个action
take函数可以监听未来的action，创建一个命令对象，告诉middleware等待一个特定的action，generator会暂停，等待一个与pattern匹配的action被发起，才会继续执行下面的语句  
通常写法如下
```js
// 当`FETCH_REQUEST`这个type的action触发时，会执行doSomething这个操作
function *watchFetchData() {
  while(true) {
    yield take('FETCH_REQUEST')
    // doSomething
  }
}
```
#### takeEvery
参数：(pattern, saga, ...args)  
第一个是action，第二个是generator函数
```js
function *fetchUser(action) {
  ...
}
function *watchFetchUser() {
  yield takeEvery('USER_REQUEST', fetchUser)
}
```
以上代码：每次dispatch `USER_REQUEST`这个action时，都会自动执行fetchUser这个generator函数  
takeEvery基于take和fork实现
```js
const takeEvery = (patternOrChannel, saga, ...args) => fork(function*() {
  while (true) {
    const action = yield take(patternOrChannel)
    yield fork(saga, ...args.concat(action))
  }
})
```

#### all
并行执行effect


### 参考
- [Redux 入门教程（二）：中间件与异步操作](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)
- [react+redux，异步请求为什么要写在action creator里面？](https://segmentfault.com/q/1010000011463009)
- [redux-thunk文档](https://www.npmjs.com/package/redux-thunk)
- [redux-saga框架使用详解及Demo教程](https://www.jianshu.com/p/7cac18e8d870)
- [聊一聊 redux 异步流之 redux-saga](https://www.jianshu.com/p/e84493c7af35)
- [redux-saga文档](https://redux-saga.js.org/docs/api/)