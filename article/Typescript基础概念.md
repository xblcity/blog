# Typescript类型

## 基础类型，数组，对象
```ts
//! 六种基础类型，数组，对象
// number
let num: number = 123
num = 456
// boolean
let bool: boolean = true
bool = false
// string
let str: string = '345'
str = '789'
// undefined
let u: undefined = undefined
u = undefined
// null
let n: null = null
n = null

// symbol
const sym: symbol = Symbol() // Symbol
const myobj = {
  [sym]: 'value'
}

// 数组，需要指定数组元素的类型
let arr: number[] = [4, 5, 6] // 数组
arr = [7, 7, 7]
let arr1: Array<string> // 也可以这样声明
arr1 = ['1', '2']
// object，可用于函数参数类型限制
let obj: object = { name: 'age' } // 对象
obj = { age: 'name' }
```

## TS独有类型，元组，枚举等
```ts
//! 元组，枚举，any,never,unknown,void
// 元组 tuple 类型
let tu: [string, number, number] = ['2', 1, 1] // tuple类型
tu[0] = '铁憨憨'
tu[0].split('')

// 枚举类型
enum codeStatus { 
  unAuth = 401,
  redirect = 403
}
console.log(codeStatus.unAuth) // 401
enum roles {
  superAdmin = 2,
  admin,
  user,
  badRequest = 400,
  unAuth
}
console.log(roles.user) // user
// 反向映射
console.log(roles[roles['unAuth']]) // unAuth

// 字符串枚举
enum eMessage {
  Error = 'sorry,error',
  Success = 'success'
}
// 异构枚举?

// any
let value: any = 45
value = '456'

// void,一般用于函数返回值
const consoleText = (text: string): void => {
  console.log(text)
}

// never，永不为true
const errFunc = (message: string): never => {
  throw new Error(message)
}

// unknown
```



## ts接口类型以及type关键字
```ts
//! 接口interface
const getFullName = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  return `${firstName}${lastName}`
}
interface Info {
  firstName: string,
  lastName: string
}
const getMyFullName = ({ firstName, lastName }: Info) => {
  return `${firstName}${lastName}`
}
interface AddFunc {
  (num1: number, num2: number): number
}
const add: AddFunc = (n1, n2) => n1 + n2

// 接口的继承
interface Vegetables {
  color: string
}
interface Tomato extends Vegetables {
  radius: number
}
const tomato: Tomato = {
  color: 'green',
  radius: 1.3
}
// 函数类型的接口，为接口定义一个函数，并且添加一个属性
interface Counter {
  (): void,
  count: number
}
const getCounter = (): Counter => {
  const c = () => {
    c.count++
  }
  c.count = 0
  return c
}
// 接口使用泛型
interface Cc5<T> {
  (name: T): T
}
interface ChildrenProps<T> {
  children: (value: T) => Object,
  test: (value: string) => string
}
const RootConsumer = ({ children }: ChildrenProps<unknown>): null => null
const testString = (someText: ChildrenProps<string>): string => someText.toString()
```

## 函数
```ts
//! 为函数定义类型
// 1.普通函数声明
function add1(arg1: number, arg2: number): number {
  return arg1 + arg2
}
// 2.,函数表达式，先定义函数类型,即先声明
let add2Func: (x: number, y: number) => number // 包含参数和返回值的类型
add2Func = (arg1: number, arg2: number): number => arg1 + arg2
// 3.使用接口定义函数类型
interface Add3Func {
  (x: number, y: number): number
}
let add3: Add3Func = (arg1: number, arg2: number) => arg1 + arg2
// 4.使用类型别名，即使用type关键字，推荐
type Add4 = (x: number, y: number) => number
let add4: Add4 = (arg1: number, arg2: number): number => arg1 + arg2

// 函数参数
type Add5 = (x: number, y?: number) => number // 可选参数必须在后面
const add6 = (x: number, y = 2) => x + y // 设置参数默认值, 在类型中无法使用默认值，在函数中可以使用
const add7 = (x: number, y: number = 2) => x + y // 设置参数默认值，并给定类型
const add8: (x: number, y: number) => number = (x, y = 2) => {
  return x + y
}
const handleData = (arg1: number, ...arg2: number[]) => { } // 剩余参数

// 定义回调函数
const getNum = (arr: number[],
  callback: (...args: number[]) => number)
  : number => callback(...arr)
getNum([1, 2], (...args: number[]) => args.length)

// 默认参数
function buildName(name: string, name2 = 'd'): string {
  return 'age'
}
buildName('hello', 'woi')

// 函数重载
// 函数重载，根据输入的不同，返回对应的输出
let suits = ["hearts", "spades", "clubs", "diamonds"];
function pickCard(x: { suit: string; card: number; }[]): number;
function pickCard(x: number): { suit: string; card: number; };
function pickCard(x): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}
let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

## 交叉类型，联合类型，类型断言等
```ts
// 交叉类型和联合类型 |
const getLength = (content: number | string): number => {
  if (typeof content === 'string') return content.length
  else return content.toString().length
}

// 类型断言
const getMyLength = (target: string | number): number => {
  if ((target as string).length) {
    return (target as string).length
  } else {
    return target.toString().length
  }
}
```

## 泛型
```ts
//! 使用泛型而不是any
const getArray = <T>(value: T, times: number = 5): T[] => {
  return new Array(times).fill(value)
} // T代表同一种不确定的类型
getArray([2], 3).forEach(item => {
  console.log(item.length)
})
getArray('2', 3)
// const getLength1 = <T>(params:T):number {
//   return params.length
// }
// 报错，有些类型是没有length属性的
// 使用泛型简单定义函数，函数表达式
const getArray2: <A>(arg: A, times: number) => A[] = (arg, times) => {
  return new Array(times).fill(arg)
}
// 使用类型别名，泛型
type GetArray3 = <T>(arg: T, times: number) => T[]
const getArray3: GetArray3 = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg)
}
// 使用泛型，接口形式定义函数
interface GetArray4 {
  <T>(arg: T, times: number): T[]
}
const getArray4: GetArray4 = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg)
}
// 类型推论，类型断言，泛型
const getMyLength1 = (name: string | number): number => {
  if ((name as string).length) {
    return (name as string).length
  } else {
    return name.toString().length
  }
}
// 泛型
const getAllArray = <T>(value: T, times: number = 5): T[] => {
  return new Array(times).fill(value)
}
getMyLength1('aa')
// 三元表达式
type TypeName<T> = T extends any ? T : never;
type Type1 = TypeName<string | number>; // Type1的类型是string|number
```

## 类
```ts
// 类的概念
class Parent {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class Child extends Parent {
  constructor(name: string) {
    super(name)
  }
}

interface Counter {
  (): void; // 这里定义Counter这个结构必须包含一个函数，函数的要求是无参数，返回值为void，即无返回值
  count: number; // 而且这个结构还必须包含一个名为count、值的类型为number类型的属性
}
const getCounter1 = (): Counter => { // 这里定义一个函数用来返回这个计数器
  const c = () => { // 定义一个函数，逻辑和前面例子的一样
    c.count++;
  };
  c.count = 0; // 再给这个函数添加一个count属性初始值为0
  return c; // 最后返回这个函数对象
};
const counter: Counter = getCounter1(); // 通过getCounter函数得到这个计数器
counter();
console.log(counter.count); // 1
counter();
console.log(counter.count); // 2
```

## 修饰器
```ts
let sign = null;
function setName(name: string) {
  return function (target: Function) {
    sign = target;
    console.log(target.name);
  };
}
@setName("lison") // Info
class Info {
  constructor() { }
}
console.log(sign === Info); // true

console.log(sign === Info.prototype.constructor); // true

function addName(constructor: { new(): any }) {
  constructor.prototype.name = "lison";
}
@addName
class A { } // A.prototype.name = 'li'
const a1 = new A();
// console.log(a1.name); // error 类型“A”上不存在属性“name”
```