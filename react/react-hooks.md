# React-Hooks总结&实践

## 简单介绍

- React.memo()，与React.PureComponent()功能一样，对props于state进行浅比较，减少组件不必要渲染的次数。建议每个函数组件都用React.memo()包裹。
- useState()，该函数接收一个值，返回一个数组，第一个是变量标识符，第二个是改变值的方法
- useEffect()，该函数接收两个参数，第一个是回调函数，第二个是依赖项，可以实现class组件的componentDidMount, componentWillUpdate, componentWillUnmount三个生命周期
- useRef()，接收一个参数(一般是null)，返回一个可变的ref对象，该对象会在组件存在期间一直存在。通常用其与JSX对象进行绑定。并用current属性获取该JSX对象的一些DOM属性及组件属性或状态。
- useMemo()，该函数接收两个参数，第一个是回调函数，第二个是依赖项，**该函数返回一个值**，该函数常用于缓存值。依赖项不变的话，该函数就不会执行，可以有效减少由于组件渲染带来的多次无意义组件内部函数的执行。
- useCallback()，该函数接收两个参数，第一个是回调函数，第二个是依赖项，**该函数返回一个函数**，常用于缓存函数，比如元素onCLick等事件回调函数，也可以结合useEffect()使用。
- useReducer()

下面重点说一下 useMemo 和 useCallback


## 参考

- [如何对 React 函数式组件进行优化.基础实用~](https://juejin.im/post/5dd337985188252a1873730f)
- [react Hook之useMemo、useCallback及memo](https://juejin.im/post/5d8dd1d6f265da5b950a431c)
- [useEffect使用大全，推荐~](https://segmentfault.com/a/1190000018639033)
- [使用useEffect从零实现，请求数据，事件处理，订阅](https://zhuanlan.zhihu.com/p/65773322)
- [理解 React Hooks 的 Capture Value 特性](https://segmentfault.com/a/1190000018685253?utm_source=tag-newest)
