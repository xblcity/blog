# 框架/库/实践面试题

- [react](#react)
- [vue](#vue)
- [小程序与公众号](#小程序与公众号)
- [webpack](#webpack)
- [babel](#babel)
- [实践应用](#实践应用)

## react

基础部分

- [React 生命周期总结&应用](https://github.com/xblcity/blog/blob/master/react/lifecycle.md)
- [React-Hooks 总结&实践](https://github.com/xblcity/blog/blob/master/react/react-hooks.md)

一些面试题例子：

生命周期类

- React生命周期分为哪几个阶段，分别对应的是？
- React的请求应该放在哪个生命周期中?
- class组件constructor和super(props)起什么作用
- setState是同步还是异步 [你真的理解setState吗？](https://juejin.im/post/5b45c57c51882519790c7441)
- setState第二个参数有什么用
- React性能优化，减少渲染次数，使用ShouldComponentUpdate,PureComponent以及React.memo的第二个参数
- react性能优化，使用hooks的userReducer和useMemo
- 哪些函数会触发React的重新渲染，setState方法被调用

原理设计类

- react怎么判断需要重新渲染组件, props改变或者setState
- React组件通信如何实现?
- 有状态组件和无状态组件的使用场景
- ref作用是什么，有哪些应用场景(获取组件对应的DOM元素)，在render中无法获取ref，因为此时DOM没有渲染完毕
- 函数组件如何使用ref, useRef, forwardRef, useImperativeHandle作用,React.forwardRef在高阶组件中转发ref
- React.Fragment使用场景
- React合成事件，如何阻止事件冒泡e.stopPropagation()
- 受控组件与非受控组件
- context如何理解与使用

应用类

- React高阶组件怎么使用，应用场景
- axios如何去统一封装处理

比较全的面试题目及解答，有些问题已经过时和答案错误，需选择看

[「2021」高频前端面试题汇总之React篇（上）](https://juejin.cn/post/6941546135827775525#heading-11)
[「2021」高频前端面试题汇总之React篇（下）](https://juejin.cn/post/6940942549305524238)

HOOKS相关

- hooks可以在条件语句中使用吗？
- useEffect如何使用，相当于哪些生命周期事件，清除副作用(卸载时触发清除函数)，useEffect第二个参数有什么用
- useCallBack作用，如何使用
- useMemo有什么作用，如何使用
- useRef如何使用
- 使用过自定义HOOK吗

## vue

- 如何理解MVVM模型
- vue/react传值，父传子，子传父，没有父子关系（代码）
- vue v-if v-show区别
- v-for vue生命周期 create和mounted请求页面数据的区别
- vuex如何保持数据刷新不丢失

## 小程序与公众号

- 小程序登录
- 小程序支付
- 小程序的生命周期和路由以及setData原理
- 公众号openid和unionid区别

## webpack

- webpack load原理
- webpack如何优化
- webpack如何自动分离本地和线上环境
- webpack基本配置，具体哪些loader和plugin

配置项：

loader test 配置 include exclude选项

resolve 配置 alias extensions

- [带你深度解锁Webpack系列](https://juejin.cn/post/6844904079219490830)
- [你可能不知道的9条Webpack优化策略](https://juejin.cn/post/6854573213171580941)

## babel

- [babel执行机制](https://github.com/MuYunyun/blog/blob/master/BasicSkill/%E7%95%AA%E5%A4%96%E7%AF%87/babel%E6%89%A7%E8%A1%8C%E6%9C%BA%E5%88%B6.md)

## 实践应用

- 如何进行错误监控
- 项目中难点坑点以及如何解决