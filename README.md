# Blog

:seedling: 记录前端学习的笔记，总结、记录成长的过程。:four_leaf_clover: 构建自己的知识体系。

:whale: [线上版本](https://xblcity.github.io/blog/)

接触一样技术或者工具时，最先了解的是概念部分，紧接着是它的实践应用。随着实践应用的深入，我们可能需要通过了解原理来更好的解决问题，更好的优化实践应用。

_是什么(WHAT)-怎么做(HOW)-为什么(WHY)_

## 前端基础
     
- [类与继承](https://github.com/xblcity/blog/blob/master/base/inherit.md)
- [赋值与深浅拷贝](https://github.com/xblcity/blog/blob/master/base/copy.md)
- [作用域与闭包](https://github.com/xblcity/blog/blob/master/base/scope-closures.md)
- [理解this](https://github.com/xblcity/blog/blob/master/base/this.md)
- [call, apply, bind手动实现](https://github.com/xblcity/blog/blob/master/base/call.md)
- [JS 事件队列/循环(Event Loop)](https://github.com/xblcity/blog/blob/master/base/eventloop.md)
- [AJAX](https://github.com/xblcity/blog/blob/master/base/ajax.md)
- [理解节流与防抖函数](https://github.com/xblcity/blog/blob/master/base/throttle.md)
- [Object 构造器及原型上的方法](https://github.com/xblcity/blog/blob/master/base/object-methods.md)
 
## 前端进阶

- [Typescript 认知](https://github.com/xblcity/blog/blob/master/advance/ts-basic.md)
- [高阶函数](https://github.com/xblcity/blog/blob/master/advance/func-program.md)
- [JS 设计模式](https://github.com/xblcity/blog/blob/master/advance/design-mode.md)
- [数据结构与算法](https://github.com/xblcity/blog/blob/master/advance/algorithm.md)
- [从omit读lodash源码](https://github.com/xblcity/blog/blob/master/advance/algorithm.md)
    
## React应用
     
- [React 生命周期总结&应用](https://github.com/xblcity/blog/blob/master/react/lifecycle.md)
- [React-Hooks 总结&实践](https://github.com/xblcity/blog/blob/master/react/react-hooks.md)
- [在 React 中使用 TS](https://github.com/xblcity/blog/blob/master/react/react-ts.md)
- [Redux/React-Redux](https://github.com/xblcity/blog/blob/master/react/redux.md)
- [Redux 中间件](https://github.com/xblcity/blog/blob/master/react/redux-middleware.md)
- [找房筛选条件表单封装](https://github.com/xblcity/blog/blob/master/react/find-house.md)
- [umi3 升级](https://github.com/xblcity/blog/blob/master/react/umi3.md)
- [组件设计模式](https://github.com/xblcity/blog/blob/master/react/component-design-mode.md)
    
## 前端综合知识
     
- [性能优化](https://github.com/xblcity/blog/blob/master/system/performance.md)
- [从输入网址到页面渲染经历了什么](https://github.com/xblcity/blog/blob/master/system/render.md)
- [http 知识体系](https://github.com/xblcity/blog/blob/master/system/http.md)
    
## 工程化
     
- [使用 webpack 从零配置 React 开发环境及打包优化](https://github.com/xblcity/blog/blob/master/engineering/webpack-react.md)
- [webpack 配置及优化](https://github.com/xblcity/blog/blob/master/engineering/webpack.md)
- [Next.js 踩坑](https://github.com/xblcity/blog/blob/master/engineering/next.md)
- [vscode 插件与配置](https://github.com/xblcity/blog/blob/master/engineering/vs.md)
- [git 的使用](https://github.com/xblcity/blog/blob/master/engineering/git.md)
- [Git 多账号配置](https://github.com/xblcity/blog/blob/master/engineering/git-account.md)
- [windows 系统搭建私有 npm 仓库](https://github.com/xblcity/blog/blob/master/engineering/private-npm.md)
- [前端从切分支到打包上线的流程整理](https://github.com/xblcity/blog/blob/master/engineering/workflow.md)
    
## 后端
     
- [node 知识点](https://github.com/xblcity/blog/blob/master/backend/little-points.md)
- [博客的后端实现](https://github.com/xblcity/blog/blob/master/backend/blog.md)
- [mysql 使用](https://github.com/xblcity/blog/blob/master/backend/mysql.md)
- [使用服务器](https://github.com/xblcity/blog/blob/master/backend/server.md)
- [nginx 在 window 下的配置与使用](https://github.com/xblcity/blog/blob/master/backend/nginx.md)
- [ubuntu服务器终端及图形界面连接](https://github.com/xblcity/blog/blob/master/backend/ubuntu.md)
    
## 第三方库
     
- [微信公众号网页登录与支付](https://github.com/xblcity/blog/blob/master/library/wx-web.md)
- [vue-element-admin 的使用](https://github.com/xblcity/blog/blob/master/library/vue-admin.md)
- [vuepress 一些自定义配置](https://github.com/xblcity/blog/blob/master/library/vuepress.md)
    
## 关于

本项目使用`vuepress`框架

项目启动:

`yarn dev`

项目发布至`Github Page`(使用git bash客户端):

`yarn deploy`

__其他__

- `yarn build` 会自动把 `README.md` `blob` 地址替换为 `github page` 地址
- `.vuepress/config.yml` 用于配置左侧菜单
