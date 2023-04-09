# React 性能优化

React 性能优化的主要思路是减少 Render 次数。官方提供的一些 Api 可以帮助我们手动减少 Render 次数，达到性能优化的目标。

[codesandbox 地址](https://codesandbox.io/p/sandbox/reactxing-neng-you-hua-mfrznd)

## React.memo

应用了 React.memo，该组件会对 props 使用 Object.is 进行一层浅比较。当检测到 Props 未发生变化时，不会渲染该组件。

```tsx
// 子组件 Counter
const Counter1: FC<Props> = (props) => {
  const { plusCount } = props;
  console.log('counter1 render');
  return (
    <div>
      <div>currentPlusCount: {plusCount} </div>
    </div>
  );
};

export default Counter1;

// 父组件
function App() {
  const [count, setCount] = useState(0);
  const [plusCount, setPlusCount] = useState(0);
  const [MinusCount, setMinusCount] = useState(0);

  return (
    <div className='App'>
      <button
        onClick={() => {
          setCount((count) => count + 1);
          setPlusCount((count) => count + 1);
        }}
      >
        Plus
      </button>
      <button
        onClick={() => {
          setCount((count) => count - 1);
          setMinusCount((count) => count - 1);
        }}
      >
        Minus
      </button>
      <div>count is {count}</div>
      <Counter1 plusCount={plusCount} />
    </div>
  );
}

export default App;
```

Counter 组件仅接收一个 plusCount props，当父组件 plusCount 更新，Counter 组件重新渲染是合理的，但是当 minusCount 更新，Counter 组件仍然渲染了，显然不是我们想要的。这个时候只需要在 Counter 组件用 memo 包裹就能达到我们想要的效果

## React.useCallback

在刚才 Counter 基础上，增加一个 回调函数 props，如下

```tsx
<Counter3
  plusCount={plusCount}
  onPlus={() => setPlusCount((count) => count + 1)}
/>
```

当我们点击 minus button 时，counter3 打印了，说明 props 发生了变化，plusCount 没变化，只能说明是 onPlus 发生了变化。因为我们使用的是行内箭头函数，每次 render 父组件，onPlus props 都会重新生成一个新的引用地址，地址发生了变化，所以 React 判断两次 props 不相等，所以会导致重新渲染

```tsx
const handlePlus = useCallback(() => {
  setPlusCount((count) => count + 1);
}, []);

<Counter4 plusCount={plusCount} onPlus={handlePlus} />;
```

需要注意的是，当对 props callback 应用了 useCallback 之后，子组件需要用 memo 包裹才能生效

## React.useMemo

React.useMemo 和 useCallback 类似，但是可以实现的效果比 useCallback 多，因为 useMemo 支持返回各种类型的值，甚至是 ReactNode

抽离部分 ReactNode

```tsx
const renderCounterContent = useMemo(() => {
  console.log('memo render');
  return <div>render Plus Count {plusCount}</div>;
}, [plusCount]);

return (
  <div className='App'>
    {/* ... */}
    {renderCounterContent}
    {/* ... */}
  </div>
);
```

使用 debounce

```tsx
import { debounce } from 'lodash';

const debounceWithMemo = useMemo(() => {
  return debounce(() => {
    setCount((count) => count - 1);
    setMinusCount((count) => count - 1);
  }, 1000);
}, []);

<button onClick={debounceWithMemo}>Minus with memo debounce</button>;
```

但如果我们使用 useCallback 就实现不了这样的效果，比如

```tsx
import { debounce } from 'lodash';

const debounceWithCallback = useCallback(() => {
  return debounce(() => {
    setCount((count) => count - 1);
    setMinusCount((count) => count - 1);
  }, 1000);
}, []);

<button onClick={debounceWithCallback}>Minus with callback debounce</button>;
```

## 自定义hook执行多次，里面的内容会执行多次吗

```ts
import { useEffect } from "react";

const useCounter = () => {
  console.log("useCounter执行");
  useEffect(() => {
    console.log("useCounter挂载");
  }, []);
  return {};
};

export default useCounter;


function App() {
  // state change...
  // useCounter 执行多次
  useCounter()
}
```

useCounter执行 会打印多次，但useCounter挂载只会执行一次

## React18 StrictMode useEffect 开发模式执行两次的问题

```ts
// How to support Reusable State in Effects
// https://github.com/reactwg/react-18/discussions/18
import { useRef, useEffect } from 'react';

/**
 * 仅在挂载时执行的effect，支持 React 18 的 Reusable State
 */
const useMount = (fn: () => void) => {
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current === false) {
      isMounted.current = true;
      fn?.();
    }
  }, [fn, isMounted]);
};

export default useMount;
```
