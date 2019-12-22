# React生命周期总结&应用

## React16.3之前的生命周期

### 加载阶段

React组件是一个class类(也可以理解为函数)

class在被调用执行的时候，首先会调用constructor()方法，该方法在class中的作用是

1. 继承 
2. 赋予class实例属性
3. 初始化this

通常在react中，会这样使用

```js
// Child类继承自React.Component类
class Child extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'xbl'
    }
  }
}
```

如果props是确定的值，而不是动态获取的，那么Child的props在constructor里面就可以拿到(也可以使用defaultProps设置默认的props)


componentWillMount()

render()

react一个重要方法，用于把JSX语法转换成虚拟DOM，只要组件有更新，都有可能触发该方法

componentDidMount()

组件渲染完成

### 更新阶段

componentWillReceiveProps(nextProps)

组件加载时不调用，组件接受新的props时调用

shouldComponentUpdate(nextProps, nextState)

组件接收到新的props或者state时调用，return true就会更新dom（使用diff算法更新），return false能阻止更新（不调用render）

componentWillUpdate(nextProps, nextState)

组件加载时不调用，只有在组件将要更新时才调用，此时可以修改state

render()

把JSX语法转换成虚拟DOM

componentDidUpdate()

组件更新完成后调用

### 卸载阶段

componentWillUnmount()




- componentWillReceivedProps

- shouldComponentUpdate

- componentWillUpdate

  - render

- componentDidUpdate

- componentWillUnmount

- componentDidUnmount

## React16.3及之后的生命周期


## 使用生命周期的注意事项

React构建的App是单页面应用，所以一旦刷新浏览器，React该页面内的所有组件会重新执行componentDidMount()，也就是说，该页面所需要的数据，必须重新拉取一下才能重新获得。

所以为了能够获得之前的状态，我们需要把一些参数存放在**路由参数里**，比如`/news?type=1`，

如果两个同级页面a,b，用户需要先进入a，才能进入b。假设我们在a中请求api获取了数据存在redux里面，然后在b页面就可以直接从redux中拿到数据。但是，如果我们在b页面刷新浏览器。就会拿不到想要的数据，因为请求api是在a页面发起的。解决方案 1. 在a,b的容器组件获取数据 2. 在a,b页面都进行api的请求。


所以，在构建一个页面组件时，我们需要考虑，用户可以通过哪些手段来进入这个页面，比如是浏览器刷新？比如从路由连接直接进入？又或者从同级动态路由进入？(这个不会触发componentDidMount，会触发props change)。如何维持或者更新状态/数据是一个值得思考的问题

## 一个例子


## 参考

- [React-新的生命周期（React16版本）](https://segmentfault.com/a/1190000016617400)

- [React新生命周期--getDerivedStateFromProps](https://www.jianshu.com/p/50fe3fb9f7c3)