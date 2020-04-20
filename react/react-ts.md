# TS 在 React 中的应用

在`React`中使用和普通的ts使用基本类似，但是会使用到大量的泛型`<>`

## 声明文件

除了安装 `react react-dom ` 之外，还需要安装 `@types/react @types/react-dom` 等声明库

这些声明文件通常会包含库的`namespace`，我们可以直接使用`namespace`上的`interface`，比如我们安装的`@types/react`实际上是提供了`React`这个`namespace`，我们可以直接使用`React`这个`namespace`

`.d.ts`声明文件一般会有个唯一的`namespace`。可以根据项目需要新建自己的`.d.ts`文件，使用的时候不需要引入

```ts
declare namespace User {
  // 大小写均可, declare关键字，意为声明
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
const person: User.UserInfo = {
  name: 'xx',
  age: 18,
}
```

我们可以只在一处定义`namespace`，而在全局的多处使用`namespace`内定义的`interface`，并且不需要引入

## 函数组件

对于函数来说，TS 会自动推断类型，所以我们可以不用定义返回的类型值。

函数式组件可能会接收`props`，这样的话，就必须要定义 `props interface`了

```ts
import React from 'react'

interface IProps {
  name?: string
  className?: string,
  done?: () => void
}

const Box = (props : IProps) => {
  const {name, className} = props
  return (
    <div className={className}>
      <div onClick={done}>{name}</div>
    </div>
  )
}
```

如果我们要接受特殊的`props`，比如`React Node`节点类型，怎么办呢？`React`中已经内置了这种接口，我们直接使用即可，注意，需要把已经定义的`IProps`接口作为泛型传递给`React.FC`这个`interface`

```ts
interface IProps {
  name?: string
  className?: string,
  done?: () => void
}

const Box: React.FC<IProps> = (props) => {
  const { name, className, done, children } = props
  return (
    <div className={className}>
      <div onClick={done}>{name}</div>
      <div>{children}</div>
    </div>
  )
}


export default Box
```

在使用函数式组件的时候，我们可能会用到`useState, useRef`这些钩子，当然也可能会遇到event事件，这些类型如何定义呢

```ts
const Box = () => {
  // const [value, setValue] = useState('')
  // const inputRef = useRef(null)
  const [value, setValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 定义event的接口类型
  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <div>
      <input ref={inputRef} type="text" value={value} onChange={handleValue} />
      <div>{value}</div>
    </div>
  )
}

export default Box
```

上面注释的代码要注意的是`使用useState, inputRef`可以不传递泛型，React可以识别的

## class Component组件

## 参考

- [JSX](https://www.tslang.cn/docs/handbook/jsx.html)
- [TypeScript：React、拖拽、实践！](https://mp.weixin.qq.com/s?__biz=MzI4NjE3MzQzNg==&mid=2649866098&idx=1&sn=2eef2647ca9ced21bd43a335215a9a4b&chksm=f3e5eee1c49267f7e39a92e9ab7b6a3513049b6e4bcc8d7f1f66bf172a01ac5706d82e682f61&mpshare=1&scene=1&srcid=&sharer_sharetime=1578881558670&sharer_shareid=3c2d78ca14f9f527dcd56a0864355767&key=dfb23297fbb00589f0b34ab320ebeeb7567c97ae1779e62130fb1c4ff34881bc31713e65843bd9cff9961ddb290ece4a6a2c77cc8df43a3538dab65de843879f0506e21d8eb5f9a3a095870d6353cbf3&ascene=1&uin=MjQ2NTEwMDU4Mg%3D%3D&devicetype=Windows+10&version=62070158&lang=zh_CN&exportkey=AaK9ZDwifPaXgENqjtTp4rg%3D&pass_ticket=qvOz4xGAcFOeFSHrmiSbgUXQ8p4JajyWZPfE4H%2FxYXfOsuHSQh1VsbBW99I7hsUU)
