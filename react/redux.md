# redux

## 概念和组成
- redux包含 `store, state, reducer, action, action creator`这些概念

其中store可以理解为redux整体部分，下面包含了reducer, state, action这几部分，action creator是用来创建action的

![redux流程](./images/redux.jpg)

### 初始化store
redux初始化, 即创建store, 调用createStore方法创建一个store
```js
import {createStore} from 'redux'
// createStore方法，接收的第一个参数是一个函数
// 传入参数函数是reducer
const store = createStore(reducer)
// store对象提供了三个方法
store.getState()
store.dispatch()
store.subscribe()
```

### 创建reducer
reducer是个函数,接收两个参数，一个是初始state,一个是action  
reducer函数return出一个新的state，传递给store用于改变state
```js
function reducer(state=0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```
为什么叫reducer，因为reducer可以作为 数组的 reduce()方法 的第一个参数 

reduce接收两个参数，第一个是个回调函数，第二个是初始值  

其中回调函数接收四个参数，accumulator(上次计算出的值/累加值), currentValue(当前传递的值/item),index(下标，可选)，array(原数组，可选)

在下面这个例子中，accumulator是state，currentValue是action
```js
function reducer(state=0, action) {
  switch (action.type) {
    case 'ADD':
      return state + action.payload // 执行一次，并返回accumulator
    default:
      return state
  }
}
const actions = [
  { type: 'ADD', payload: 1 },
  { type: 'ADD', payload: 2 }
]

actions.reduce(reducer, 0) // 输出3
```

### action && store.dispatch()

reducer里面定义了初始state和改变state的接口，我们只需要传入对应的action即可,如上面reducer所示

一个reducer需要传递state以及action，把这两个部分分解开来

用户在view层如何把action传给reducer,就要用到store提供的dispatch方法了
```js
// dispatch接收一个对象参数，也就是action，action必须要有type属性
// action是一个对象，其中必须要包含type属性，其他属性可以随意定义，只要在reducer有对应处理即可
const action = {
  type: 'INCREMENT'
}
store.dispatch(action)
```

现在我们要想reducer根据我们传递的action参数里面的值进行相应改变，如下  
组件
```js
// 传入的action
store.dispatch({
  type: 'INCREMENT',
  payload: {  // 这里不一定是payload，只要和reducer约定好即可,payload也不一定要是对象
    number: 3
  }
})
```
store.js
```js
import {createStore} from 'redux'

function reducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload.number
    default:
      return state
  }
}

const store = createStore(reducer)
```
这样state可以依据action的type以及payload参数，进行相应变化

### action creator
如果每次用户都在view层写这些`store.dispatch({})`,一方面，我们不知道用户到底dispatch哪些action,另一方面，action写起来比较繁琐，并且还有可能在多处调用相同的dispatch行为
所以我们可以定义action creator,即一个个函数，这些函数会返回action
```js
// 可以直接在reducer所在的文件进行定义
function increment(number) {
  return {
    type: 'INCREMENT',
    payload: {number}
  }
}
// 以下是在view调用
import store from './store'
import {increment} from './actionCreator'
// increment函数方法传入一个number参数
store.dispatch(increment(3))
```
action creator和action都可以通过`store.dispatch()`直接调用，只不过action creator封装了一个可以返回action的函数

### store.getState()
在view也就是用户页面如何获取store里面的state，需要用到上面store提供的getState方法
```js
import store from './store.js' // 这里为了方便，默认redux.js有暴露出的store对象
// getState方法不需要传参数
console.log(store.getState()) // 这里打印了 redux 的 state值
```

### 纯函数reducer
reducer函数的一个重要特征是，它是一个纯函数，也就是说，相同的输入，会得到相同的输出
和中学学的函数，如`y=2x`很相似，相同输入必有一样输出
在reducer里面不能直接重新给state赋值，而是返回一个新的state，由store自己对state进行改变
```js
function reducer(state, action) {
  return {...state, ...newState} // newState如果包含state里面的一部分值，会覆盖，否则，会新建
  // 或者
  return Object.assign({}, state, {...newState})
  // 也可以使用 JSON.parse(JSON.string(xxx)) 进行简单的深拷贝
}
// 如果state是一个数组
function reducer(state, action) {
  return [...state, newItem]
}
```

### store.subscribe()
`store.subscribe()`方法, 接收一个回调函数，在回调函数里我们做相应的处理
当redux的state改变时，会自动触发`store.subscribe()`方法
我们可以在subscribe方法处理我们的需求
```js
let listenSubscribe = store.subscribe(() => {
  console.log('state发生了变化！')
  console.log('当前state', store.getState())
})
```

### createStore的简单实现
```js
const createStore = (reducer) => {
  // 对reducer进行判断处理等等。。
  // 假设已经 处理好了 state
  let state
  let listeners = []

  const getState = () => state

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach()
  }

  const subscribe = (listener) => {

  }
}
```

### reducer的拆分

reducer函数负责生成state,由于整个应用只有一个 state对象，包含所有数据，对于大型应用来说，这个state会很庞大，导致reducer函数也很庞大  
这时候我们需要将reducer拆分成多个，对于不同页面或者不同功能，我们把它拆分成独立的部分
通过redux提供的combineReducers方法
```js
import {createStore, combineReducers} from 'redux'
import {aReducer} from './aReducer.js'
import {bReducer} from './bReducer.js'

const totalReducer = combineReducers({
  aReducer,
  bReducer
})

const store = createStore(totalReducer)
export default store
```

## 不使用react-redux缺点
- 对于有状态的组件，分发state需要使用store.getState api
- 当需要更新redux的状态时，需要使用store.subscribe监听
- 页面需要同步更新时，redux里面的数据需要获取到并保存到组件自身state里面
- 使用redux数据的组件必须要改成由状态组件

## 不使用中间件处理异步请求, 如redux-thunk或redux-saga
在view层的某个函数内部(如在组件刚挂载时)处理异步请求，处理完异步请求并获取到结果之后再dispatch一个action  
缺点是，
- 请求分散在很多view组件中，维护起来很麻烦 
- 如果有多个组件调用了这个请求，每个组件的mapDispatchToProps都需要写(如果使用了react-redux的话)，
- 小型项目可以像这样使用

## 使用react-redux
第三方库react-redux,该库提供了Provider和connect  
Provider是一个普通的组件，可以作为顶层app状态的分发点,它只需要store属性就可以了，它会将state分发给所有被`connect`的组件  
connect是一个柯里化函数，先接收两个函数参数，mapStateToProps和mapDispatchToProps,再接收一个参数(将要绑定的组件本身)  
mapStateToProps  
mapDispatchToProps参数是一个回调函数，参数是dispatch,


### 参考
- [理解 React，但不理解 Redux，该如何通俗易懂的理解 Redux？](https://www.zhihu.com/question/41312576?sort=created)
- [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)