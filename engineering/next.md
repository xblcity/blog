# Next.js 项目搭建及踩坑

## 为什么要使用 Next.js 框架

## Next.js 和普通的 React 项目有什么区别

- `Next.js` 是一个支持 `SSR` 的框架。和常见的打包 `React` 项目不同的是，`Next.js` 返回给客户端的 `HTML` 可能是动态渲染的，而不是直接打包出 `index.html` 和一些 `.js` 文件。`Next.js` 也支持打包出静态文件，取决于你的项目里有没有用到即时渲染的功能。 [Static HTML Export](https://nextjs.org/docs/advanced-features/static-html-export)
- 因为支持 `SSR`，意味着

## 有哪些要注意的点

### 请求转发

如果使用了 `Node` 中间层，那么在代码里写的以 `/api` 开头的请求会自动被转发到 `Node` 层。