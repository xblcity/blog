# Next.js 踩坑点

## 首页 SSR 升级改造

### 开启 SSR

需要用到 `getServerSideProps` API。注意，SSR 和 SSG 同时只能使用一个

### react-hydration-error

`xt-dev.js:24 Warning: Expected server HTML to contain a matching <div> in <div>.`

`caught Error: Hydration failed because the initial UI does not match what was rendered on the server.`

首页升级 SSR 的时候有如上报错，主要是因为在 SSR 的时候使用了一些 非 Node 层的 API。

如何区分是 Server 层还是 Client 层，不要用 `typeof window !== 'undefined'` 判断，而是用 `useEffect(() => {}, [])` 进行判断，因为 useEffect 空依赖在 Server 层是不执行的。

可参考官方文档[react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)

### 对上面错误进行排查

- 非首页没有走 SSR 的不报错 

进行以下几点排查

- _app 的 Layout - 注释仍报错
- _app 的 Script 及 Head - 注释仍报错
- _document - 注释不报错

```jsx
const [showChild, setShowChild] = useState(false)
useEffect(() => {
  setShowChild(true)
}, [])
if (!showChild && router.pathname !== '/') {
  return null
}
```
在 _app 中这段代码导致报错，因为这句话会导致 server render 返回为 null