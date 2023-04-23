# 开发中常用的 Typescript 技巧

## type

type(类型别名) 可以用于定义一种新的类型

```ts
/** 表示一种类型为string的Name类型 */
type Name = string;
const a: Name = 'cc';
/** 表示联合类型 */
type Names = string | number;
type Names = 'cc' | 'dd';
/** 定义函数类型别名 */
type Fuc = (name: string) => string;
/** 定义对象 */
type Props = {
  name: string;
  age: number;
};
/** 继承(表示交叉类型) */
type FullProps = Props & {
  gender: string;
};
```

## 继承相关 extends Omit Pick

比如封装一个 react input 基础组件，在 input 基础上添加属性

```ts
import type {HTMLAttribute} from 'react'

/** type 继承 */
export InputProps = HTMLAttribute<HTMLInputElement> & {
  clearable?: boolean
}

/** interface 继承 */
export InputProps extends HTMLAttribute<HTMLInputElement> {
   clearable?: boolean
}
```

原生 placeholder 支持 string 或者 undefined,如果我们想 placeholder 支持 ReactNode，这个时候 ts 会提示类型错误。如果改变原生 input props 类型？需要用到 Omit

```ts
import type {HTMLAttribute, ReactNode} from 'react'
export InputProps = Omit<HTMLAttribute<HTMLInputElement>, 'placeholder'> & {
  placeholder?: ReactNode
}
```

如果我们只需要原生 Input props 中的几个，可以使用 Pick

```ts

import type {HTMLAttribute, ReactNode} from 'react'

/** Pick需要的属性 */
export InputProps = Pick<HTMLAttribute<HTMLInputElement>, 'placeholder' | 'value' | 'onChange'>
```

## 使用 Partial 进行属性提示

```ts
interface State {
  email: string;
  password: string;
}

const Cop = () => {
  const reducer = (state: State, { ...newState } : Partial<IParams>) => {
    return { ...state, ...newState };
  };
  const [data, dispatch] = useReducer(reducer, defaultState);

  // dispatch 会进行属性提示, 非 state 里面的值会抛错
  const handleEmailChange = (v) => dispatch({})
}
```

## 使用枚举

获取枚举属性值的联合类型

```ts

export enum State1 {
  major = 1,
  minor = 2,
  patch = 3,
}

export enum State3 {
  major = "Major",
  minor = "Minor",
  patch = "Patch",
}

type ValuesOfEnum<T> = T[keyof T];
type MyState1 = ValuesOfEnum<typeof State1>;
type MyState3 = `${State3}`;

const test1: MyState1 = 1;
const test2: MyState1 = 1000;

const test5: MyState3 = "Major";
const test6: MyState3 = "major";
```

## 定义函数类型

不使用interface

```ts
const getFullName = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): string => {
  // :string可以省略。ts函数返回值可以省略，让ts自己去推断
  return `${firstName}${lastName}`;
};
```

使用 interface

```ts
// 第一种
interface Info {
  firstName: string; // 这里写 , ; 或者不写都可以
  lastName: string;
}
const getMyFullName = ({ firstName, lastName }: Info): string => {
  // :string可以省略。ts函数返回值可以省略
  return `${firstName}${lastName}`;
};

// 第二种
interface InfoFuc {
  (num1: number, num2: number): number;
}
const add: AddFunc = (n1, n2) => n1 + n2;
```

使用 type(略)

函数声明与函数表达式

```ts
// 1.普通函数声明
function add(arg1: number, arg2: number): number {
  return arg1 + arg2;
}

// 2.函数表达式
let myAdd = function (x: number, y: number): number {
  return x + y;
};
```

需要注意一点：可选函数要放在必选函数后面，后者会有 ts 警告

## 泛型

更广泛的约束类型

不知道返回的类型，但是用不想用 any，而是根据输入值决定返回值。一般在处理的时候可能会多次用到

```ts
function identity<T>(arg: T): T {
  // 这里T仅仅是一个表示，可以是其他字母比如 P,U等
  return arg;
}
// 明确指定 T 是 string类型
let output = identity<string>('myString'); // type of output will be 'string'

// 下面这种方法更普遍.利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型
let output = identity('myString');

// 接口使用泛型
interface Co<T> {
  (name: T): T;
}
```

## 在React中使用泛型

useState,

通常 useState 不一定要给泛型类型，因为 ts 会进行类型断言，根据你给的初始值进行判断

event

```ts
interface IProps {
  className?: string
}

const Box: React.FC<IProps> = (props) => {
  const { className } = props
  const [value, setValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 定义event的接口类型
  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <div  className={className}>
      <input ref={inputRef} type="text" value={value} onChange={handleValue} />
      <div>{value}</div>
    </div>
  )
}

export default Box
```

## 交叉类型与联合类型

交叉类型，需要符合全部

```ts
type Name = string & number
```

上述类型时错误的，因为没有值既能满足 string 又能满足 number

联合类型，符合其中一部分即可

```ts
type Name = string | number
```

## 类型断言 as


```ts
// 比如any类型的但我知道它现在应该是更精确的值，比如string
let someValue: any = 'this is a string';
let strLength: number = (<string>someValue).length;

// 另一种 as 写法 JSX只能用这种类型断言
let someValue: any = 'this is a string';
let strLength: number = (someValue as string).length;

// 类型断言
const getMyLength = (target: string | number): number => {
  if ((target as string).length) {
    return (target as string).length;
  } else {
    return target.toString().length;
  }
};
```

## 函数重载

函数重载，根据输入的不同，返回对应的输出。可以定义多种参数类型。好处是可以让开发者不用去函数的内部去查找到底应该传几个值，以及有怎样的输出

```ts
// 这个函数可以传 1个参数，2个参数，4个参数
interface Direction {
  top: number;
  bottom?: number;
  left?: number;
  right?: number;
}
function assigned(all: number): Direction;
function assigned(topAndBottom: number, leftAndRight: number): Direction;
function assigned(
  top: number,
  right: number,
  bottom: number,
  left: number
): Direction;

function assigned(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d,
  };
}

assigned(1);
assigned(1, 2);
assigned(1, 2, 3);
assigned(1, 2, 3, 4);
```

## 命名空间

有了模块系统之后明明空间可能并不是那么常用了，通常在一些非 TypeScript 原生代码的 .d.ts 文件中使用,主要是由于 ES Module 过于静态，对 JavaScript 代码结构的表达能力有限。

```js
// 比如 Validation.ts 文件 声明了 Validation命名空间
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}

// 使用declare
declare namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}

// 或者使用下面写法
export as namespace Validation
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```

外部命名空间 `declare` 关键字

## 推荐阅读

- [深入理解 TypeScript, 比较完整的介绍，是 typescript-book 中文翻译版](https://jkchao.github.io/typescript-book-chinese/)
- [一篇朴实的文章带你 30 分钟捋完 TypeScript,方法是正反对比](https://juejin.im/post/5d53a8895188257fad671cbc)

