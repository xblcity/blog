# TS在React中的应用 

- [在React组件中使用]()
- [配置axios拦截器]()

## 在React组件中使用

### 声明文件

除了安装 `react` 之外，还需要安装react的声明文件 `@types/react`，因为在ts中引入的是react的声明文件`/node_modules/@types/react/index.d.ts`，如果不安装，则没有声明文件，ts识别不了路径。会报错。

`.d.ts`声明文件一般会有个唯一的`namespace`。可以根据项目需要新建自己的`.d.ts`文件，使用的时候不需要引入

```ts
declare namespace User { // 大小写均可, declare关键字，意为声明
  interface UserInfo {
    name: string
    age: number
  }
}

// 也支持这种写法
export as namespace User
export interface UserInfo {
  name: string
  age: number
}
```

在其他地方直接使用

```ts
const person:User.UserInfo = {
  name: 'xx',
  age: 18
}
```



// ts配置axios拦截器


## 参考

- [JSX](https://www.tslang.cn/docs/handbook/jsx.html)
- [TypeScript：React、拖拽、实践！](https://mp.weixin.qq.com/s?__biz=MzI4NjE3MzQzNg==&mid=2649866098&idx=1&sn=2eef2647ca9ced21bd43a335215a9a4b&chksm=f3e5eee1c49267f7e39a92e9ab7b6a3513049b6e4bcc8d7f1f66bf172a01ac5706d82e682f61&mpshare=1&scene=1&srcid=&sharer_sharetime=1578881558670&sharer_shareid=3c2d78ca14f9f527dcd56a0864355767&key=dfb23297fbb00589f0b34ab320ebeeb7567c97ae1779e62130fb1c4ff34881bc31713e65843bd9cff9961ddb290ece4a6a2c77cc8df43a3538dab65de843879f0506e21d8eb5f9a3a095870d6353cbf3&ascene=1&uin=MjQ2NTEwMDU4Mg%3D%3D&devicetype=Windows+10&version=62070158&lang=zh_CN&exportkey=AaK9ZDwifPaXgENqjtTp4rg%3D&pass_ticket=qvOz4xGAcFOeFSHrmiSbgUXQ8p4JajyWZPfE4H%2FxYXfOsuHSQh1VsbBW99I7hsUU)