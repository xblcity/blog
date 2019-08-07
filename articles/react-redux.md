# react-redux

> 思考：为什么使用react-redux  
这里参考官方文档：[文档](https://react-redux.js.org/introduction/why-use-react-redux)  
- react-redux是一个把react和redux绑定的库,redux官方开发
- 使用redux的组件必须要成为有状态组件，而使用了react-redux则可以成为无状态组件，state通过connect进行分发，组件更容易复用
- react-redux内部进行了优化，可以避免不必要的re-render

核心部分
- Provider: 从外部封装了整个应用，并向connect模块传递store
- connect: 1.包装原组件，将state和action通过props的方式传到原组件内部 2.监听store tree的变化，使其包装的原组件可以响应state变化

不使用/使用react-redux分发state与提交action的方式区别
- 状态分发：前者使用 store.getState(), 后者通过connect传递的第一个回调函数拿到
- action提交：前者通过 store.dispatch(action), 后者通过connect传递的第二个回调里面写dispatch(action)  

## 例子
TodoList.js
```js
const TodoList = (props) => (
  <div>
    <div>
      <input placeholder={props.inputValue} onChange={props.inputChange} />
      <button onClick={props.clickButton}>提交</button>
    </div>
    <ul>
      {
        props.list.map((item, index) => {
          return (<li key={index}>{item}</li>)
        })
      }
    </ul>
  </div>
)

// store向下分发状态(state)
const stateToProps = (state) => {
  return {
    inputValue: state.inputValue,
    list: state.list
  }
}

// 向reducer提交action
const dispatchToProps = (dispatch) => {
  return {
    inputChange(e) {
      let action = {
        type: 'change_input',
        value: e.target.value
      }
      dispatch(action)
    },
    clickButton() {
      let action = { type: 'add_item' }
      dispatch(action)
    }
  }
}

export default connect(stateToProps, dispatchToProps)(TodoList)
```