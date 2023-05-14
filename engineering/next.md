# Next.js 踩坑点

## 首页 SSR 升级改造

### 开启 SSR

需要用到 `getServerSideProps` API。注意，SSR 和 SSG 同时只能使用一个

再开启 `getServerSideProps` 后，报了如下错误

### react-hydration-error

`xt-dev.js:24 Warning: Expected server HTML to contain a matching <div> in <div>.`

`caught Error: Hydration failed because the initial UI does not match what was rendered on the server.`

翻译过来就是因为客户端的首页渲染和服务端渲染没有保持一致，导致水合失败

可参考官方文档[react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)

### 对上面错误进行排查

#### 错误可能1

SSR 的时候使用了一些 非 Node 层的 API。

如何区分是 Server 层还是 Client 层，不要用 `typeof window !== 'undefined'` 判断，而是用 `useEffect(() => {}, [])` 进行判断，因为 useEffect 空依赖在 Server 层是不执行的。

#### 错误可能2

因为非首页没有走 SSR 的不报错，所以还是如报错原因所述，客服端与服务端渲染内容不一致

_app.js 有以下一部分代码，会导致服务端渲染返回为 null

```jsx
const [showChild, setShowChild] = useState(false)
useEffect(() => {
  setShowChild(true)
}, [])
if (!showChild) {
  return null
}
return ...
```

之前为什么加这个逻辑，因为有些 API 在 Node 端运行会报错。比如埋点需要用到 localStorage 

如何让首页的服务端渲染不走 retuen null 这个逻辑呢，可以用路由进行判断

```js
const router = useRouter();

if (!showChild && router.pathname !== '/') {
  return null
}

return ...
```