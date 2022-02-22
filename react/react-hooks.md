# React-Hooks 总结&实践

## React.memo()

与 `React.PureComponent()` 功能一样，对 `props` 进行浅比较，减少组件不必要渲染的次数。建议每个函数组件都用 `React.memo()` 包裹。

当父组件更新时，使用 `React.memo()` 包裹的组件会对 `props` 进行浅比较，而不是一刀切将子组件全部更新

> 浅比较的策略

如果都是基本值类型，直接进行比较，不相等则更新
如果是引用类型，引用类型指针所指的地址不同则直接更新

## useState()

`useState()`，该函数接收一个值，返回一个数组，第一个是变量标识符，第二个是改变值的方法。

注意，useState 不能在条件语句中定义，useState 是根据声明的顺序来记住当前改变的是哪个 state

关于 useState 的一些原理，可以参考[这篇文章](https://www.jianshu.com/p/7dbac1e02f85)

## useEffect()

useEffect()，该函数接收两个参数，第一个是函数，第二个是数组依赖项(可以传递多个依赖)，

可以实现 class 组件的 `componentDidMount, componentDidUpdate, componentWillUnmount` 三个生命周期

useEffect还可以通过返回一个函数来指定如何“清除”副作用。

## useCallback()

接收两个参数，第一个是函数，第二个是依赖项，**该函数返回一个函数**，

因为 `React.memo` 只能进行浅比较，当传递的 props 是函数时，子组件还是会重新渲染，`useCallback` 可以弥补这个缺陷

```js
const App = () => {
  const [value, setValue] = useState(0)
  const [p, setP] = useState(0)

  // 如果是组件本身的函数，可以不用使用useCallback包裹
  const changeValue = () => {
    setValue(value + 1)
  }
  const test = () => {
    console.log(p)
  }
  // 不使用useCallback，每次组件更新，传递给子组件的函数引用不同
  const test2 = useCallback(test, [p])
  // 使用useMemo也可以
  // const test2 = useMemo(() => test, [p])

  return (
    <div>
      <button onClick={changeValue}>{value}</button> 
      <Child2 p={p} test={test2}>
    </div> 
  )
}

const Child = () => {
  console.log('child执行了')
  return <div>{props.p}</div>
}
const Child2 = React.memo(Child)
```

## useMemo()

useMemo()，该函数接收两个参数，第一个是函数,该函数必须要有返回值，这个返回值即是 useMemo() 调用后返回的值，这个值可以是值类型，也可以是引用类型(比如函数)，第二个是依赖项，

useMemo 常用于缓存值。依赖项不变的话，该函数就不会执行，可以有效减少由于组件渲染带来的多次无意义组件内部函数的执行。

useMemo 可以覆盖 useCallback 的用法

## useRef()

接收一个参数(一般是 null)，返回一个可变的 ref 对象，该对象会在组件存在期间一直存在**且不会改变**。通常用其与 JSX 对象进行绑定。并用 current 属性获取该 JSX 对象的一些 DOM 属性及组件属性或状态。

## forwardRef()

## useReducer()

## useContext()

## 注意事项

[Hook 规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)

只在最顶层使用 Hook
不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层以及任何 return 之前调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。

## 参考

- [如何对 React 函数式组件进行优化.基础实用~](https://juejin.im/post/5dd337985188252a1873730f)
- [react Hook 之 useMemo、useCallback 及 memo](https://juejin.im/post/5d8dd1d6f265da5b950a431c)
- [useEffect 使用大全，推荐~](https://segmentfault.com/a/1190000018639033)
- [使用 useEffect 从零实现，请求数据，事件处理，订阅](https://zhuanlan.zhihu.com/p/65773322)
- [理解 React Hooks 的 Capture Value 特性](https://segmentfault.com/a/1190000018685253?utm_source=tag-newest)
