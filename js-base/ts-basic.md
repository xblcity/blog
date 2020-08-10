# Typescript 认知

- [1.常见类型](#1.常见类型)
- [2.接口类型](#2.接口类型)
- [3.函数](#3.函数)
- [4.高级类型](#4.高级类型)
- [5.基础知识补充](#5.基础知识补充)
- [6.类](#6.类)
- [7.装饰器](#7.装饰器)
- [8.模块](#8.模块)
- [9.命名空间](#9.命名空间)
- [10.声明合并](#10.声明合并)
- [声明文件](#声明文件)

## 1.常见类型

### 1.1 七种 JS 中的基本类型，number, string, boolean, undefined, null, symbol, bingint

```ts
// number
let num: number = 123;
num = 456;
// boolean
let bool: boolean = true;
bool = false;
// string
let str: string = "345";
str = "789";
// undefined
let u: undefined = undefined;
u = undefined;
// null
let n: null = null;
n = null;
// symbol
const sym: symbol = Symbol(); // Symbol
const myobj = {
  [sym]: "value",
};
```

### 1.2 any,never,unknown,void

```ts
// any，用户输入或者第三方库不知道的输出类型
let value: any = 45;
value = "456";

// void,一般用于函数返回值为空
const consoleText = (text: string): void => {
  console.log(text);
};

// never，永不为true
const errFunc = (message: string): never => {
  throw new Error(message);
};

// unknown
// 大多数情况下可以使用unknown来代替any
```

### 1.3 数组

```ts
let arr: number[] = [4, 5, 6]; // 数组
arr = [7, 7, 7];
let arr1: Array<string>; // 也可以这样声明
arr1 = ["1", "2"];
```

### 1.4 对象

`object`，建议都用`interface`来替代

```js
declare function create(o: object | null): void;
create({ prop: 0 }); // OK
create(null); // OK
create(42); // Error
// 使用interface限制对象属性类型，关于interface后面再说
interface Obj {
  name: string;
}
let obj: Obj = {
  name: "luffy",
};
```

### 1.5 元组(tuple)

```ts
let tu: [string, number, number] = ["2", 1, 1]; // tuple类型
tu[0] = "铁憨憨";
tu[0].split("");
```

### 1.6 枚举(enum 关键字)

```ts
enum codeStatus {
  unAuth = 401,
  redirect = 403,
}
console.log(codeStatus.unAuth); // 401
```

枚举可以进行反向映射

## 2. 接口类型

关键字 `interface`，限制对象参数的属性类型

```ts
// 不使用interface
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

// 使用interface表示对象类型
interface Info {
  firstName: string; // 这里写 , ; 或者不写都可以
  lastName: string;
}
const getMyFullName = ({ firstName, lastName }: Info): string => {
  // :string可以省略。ts函数返回值可以省略
  return `${firstName}${lastName}`;
};
// 定义函数参数类型及返回值类型
interface AddFunc {
  (num1: number, num2: number): number;
}
const add: AddFunc = (n1, n2) => n1 + n2;
```

interface 也可以定义 **可选属性**， **只读属性**。

### implements

使用 interface 强制一个类(class) 符合某种约定，关键字**implements**

```ts
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

### extends

接口的继承

```ts
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
// 这种 <Type>name 的格式 意思是 name的类型是Type类型，在类型推断，泛型中都有用到
square.color = "blue";
square.sideLength = 10;
```

## 3.函数

可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript 能够根据返回语句自动推断出返回值类型，因此我们通常省略它。

### 为函数定义类型

```ts
// 1.普通函数声明，最便捷的一种？
function add(arg1: number, arg2: number): number {
  return arg1 + arg2;
}

// 2.函数表达式
let myAdd = function (x: number, y: number): number {
  return x + y;
};
```

### 书写完整函数类型

函数类型包含两部分：参数类型和返回值类型。 当写出完整函数类型的时候，这两部分都是需要的。

```ts
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  // 注意，返回值要用 => 符号
  return x + y;
};
```

### 参数类型

**可选参数**，**默认参数**，**剩余参数**

```ts
// 可选参数必须要放在必选参数后面
function buildName(firstName: string, lastName?: string) {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

### ts 还可以使用接口以及 type 关键字定义函数类型

```ts
// 使用接口定义函数类型
interface Add3Func {
  (x: number, y: number): number;
}
let add3: Add3Func = (arg1: number, arg2: number) => arg1 + arg2;
// 使用类型别名，即使用type关键字，推荐
type Add4 = (x: number, y: number) => number;
let add4: Add4 = (arg1: number, arg2: number): number => arg1 + arg2;
```

ts 中为 this 指定类型，这部分等用到了再做记录

```ts
// 定义回调函数
const getNum = (
  arr: number[],
  callback: (...args: number[]) => number
): number => callback(...arr);
getNum([1, 2], (...args: number[]) => args.length);
```

### 函数重载

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

## 4.高级类型

### 交叉类型（Intersection Types） &

把多种类型叠加为一种类型

```ts
function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{};
  for (let id in first) {
    (<any>result)[id] = (<any>first)[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<any>result)[id] = (<any>second)[id];
    }
  }
  return result;
}
```

### 联合类型（Union Types） |

希望传入的参数是`string`或者`number`类型

```js
function padLeft(value: string, padding: any) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value; // 长度是padding+1的空数组。join(" ")用于产生数组长度的空格
  }
  if (typeof padding === "string") {
    return padding + value; // 将字符串排列在value前面
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

// 这么做ts不会报错，但存在过度设计，
function padLeft(value: string, padding: string | number) {
  // ...
}
```

## 5.类型断言, 泛型, 类型别名

### 5.1 类型断言

```ts
// 比如any类型的但我知道它现在应该是更精确的值，比如string
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 另一种 as 写法 JSX只能用这种类型断言
let someValue: any = "this is a string";
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

### 5.2 泛型

更广泛的约束类型

不知道返回的类型，但是用不想用 any，而是根据输入值决定返回值

```ts
function identity<T>(arg: T): T {
  // 这里T仅仅是一个表示，可以是其他字母比如 P,U等
  return arg;
}
// 明确指定 T 是 string类型
let output = identity<string>("myString"); // type of output will be 'string'

// 下面这种方法更普遍.利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型
let output = identity("myString");

// 接口使用泛型
interface Co<T> {
  (name: T): T;
}
```

更多泛型的应用

```ts
//! 使用泛型而不是any
const getArray = <T>(value: T, times: number = 5): T[] => {
  return new Array(times).fill(value);
}; // T代表同一种不确定的类型
getArray([2], 3).forEach((item) => {
  console.log(item.length);
});
getArray("2", 3);
// const getLength1 = <T>(params:T):number {
//   return params.length
// }
// 报错，有些类型是没有length属性的
// 使用泛型简单定义函数，函数表达式
const getArray2: <A>(arg: A, times: number) => A[] = (arg, times) => {
  return new Array(times).fill(arg);
};
// 使用类型别名，泛型
type GetArray3 = <T>(arg: T, times: number) => T[];
const getArray3: GetArray3 = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};
// 使用泛型，接口形式定义函数
interface GetArray4 {
  <T>(arg: T, times: number): T[];
}
const getArray4: GetArray4 = <T>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};
// 类型推论，类型断言，泛型
const getMyLength1 = (name: string | number): number => {
  if ((name as string).length) {
    return (name as string).length;
  } else {
    return name.toString().length;
  }
};
// 泛型
const getAllArray = <T>(value: T, times: number = 5): T[] => {
  return new Array(times).fill(value);
};
getMyLength1("aa");
// 三元表达式
type TypeName<T> = T extends any ? T : never;
type Type1 = TypeName<string | number>; // Type1的类型是string|number
```

### 5.3 类型别名（type 关键字）

类型别名有时候和接口很像，但是可以作用于原始值，联合类型，元组以及其他任何需要你手写的类型。

```js
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver) : Name {
  if (typeof n === 'string') {
    return n
  } else { // 函数类型
    return n()
  }
}

// 泛型
typeof Container<T> = {
  value: T
}
```

类型别名和接口很像，但是类型别名不能被 `extends` 和 `implements` 。不过类型别名可以很好的表示交叉类型和联合类型。不过两者还有其他细小的差别...

## 6.类

类中的关键字

`extends`(继承) `public`(完全开放) `private`(对自己开放) `protected`(对子类开放) `readonly` `get set` `static`(静态属性) `abstract`

抽象类(abstract 关键字)做为其它派生类的基类使用。 它们一般不会直接被实例化。

ts 中与 js 有不同的是静态属性的表示，比如

```js
// js
class Print {
  count = 1
}

// ts
class Print {
  count: 1
}
// 或
interface MyPoint<T> {
  count: number;
  name: T
}

// 强制约束某个class符合某种interface
class Print implements MyPoint<string> {
  count: 123  // Print类上面的count属性值是string类型
  name: 'xbl'
}

class People {
  name  // 默认是public
  age
  protected weight // 定义protected属性，自己或子类可以访问
  constructor(name, age) {
    this.name = name
    this.age = age
    this.weight = 120
  }
}
class Student extends People {
  number
  private girlfriend // 定义private属性
  constructor(name, age, number) {
    super(name, age)
    this.number = number
    this.girlfriend = 'li'
  }
  getWeight() {
    alert(this.weight)
  }
}

let xiaoming = new Student('xiaoming', 10, 'A1')
xiaoming.getWeight()
console.log(xiaoming.girlfriend) // 编译之前就报错
console.log(xiaoming.weight) // 编译之前就报错
```

抽象类只能被继承，无法被实例化

```ts
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log("roaming the earch...");
  }
}
const animal = new Ainmal(); // 报错

class Cat extends Animal {
  makeSound() {
    console.log("miao miao");
  }
}

const cat = new Cat();

cat.makeSound(); // miao miao
cat.move(); // roaming the earch...
```

## 7.装饰器

ES6+目前还是在 stage2，如果需要支持修饰器，需要安装 babel 插件`babel-plugin-transform-decorators-legacy` tsconfig 配置`"experimentalDecorators": true`

## 8.模块

ts1.5 之后，**外部模块**被称作**模块**，**内部模块**被称作**命名空间**

ts 中的模块与 js 中类似，任何包含顶级 import 或者 export 的文件都被当成一个模块。

相反地，如果一个文件不带有顶级的 import 或者 export 声明，那么它的内容被视为全局可见的。

```js
// 导出接口声明
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
// 导出别名
export type Person {
  name: string
}
// 导出变量
export const numberRegexp = /^[0-9]+$/
// 导出类
export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}
```

## 9.命名空间

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

## 10.声明合并

如 **接口** **命名空间** 的声明都可以合并

```js
// 合并接口
interface Box {
  height: number
  width: number
}
interface Box {
  scale: number
}
let box: Box = {height: 5, width: 6, scale: 10}

// 合并命名接口
namespace Animals {
  export class Zebra { }
}
namespace Animals {
  export interface Legged { numberOfLegs: number; }
  export class Dog { }
}
// 等同于
namespace Animals {
  export interface Legged { numberOfLegs: number; }
  export class Zebra { }
  export class Dog { }
}
```

## 声明文件

示例

mylib.d.ts

```ts
export as namespace myLib;

// 为模块定义函数类型
export function myMethod(a: string): string;
export function myOtherMethod(a: number): number;
// 为模块定义接口类型
export interface someType {
  name: string;
  length: number;
  extras?: string[];
}
// 为模块定义属性
export const myField: number;

// ... ?
export namespace subProp {
  export function foo(): void;
}
```

<!-- ====================================

## 接口

```ts
interface Counter {
  (): void // 这里定义Counter这个结构必须包含一个函数，函数的要求是无参数，返回值为void，即无返回值
  count: number // 而且这个结构还必须包含一个名为count、值的类型为number类型的属性
}
const getCounter1 = (): Counter => {
  // 这里定义一个函数用来返回这个计数器
  const c = () => {
    // 定义一个函数，逻辑和前面例子的一样
    c.count++
  }
  c.count = 0 // 再给这个函数添加一个count属性初始值为0
  return c // 最后返回这个函数对象
}
const counter: Counter = getCounter1() // 通过getCounter函数得到这个计数器
counter()
console.log(counter.count) // 1
counter()
console.log(counter.count) // 2
```

## 修饰器

```ts
let sign = null
function setName(name: string) {
  return function(target: Function) {
    sign = target
    console.log(target.name)
  }
}
@setName('lison') // Info
class Info {
  constructor() {}
}
console.log(sign === Info) // true

console.log(sign === Info.prototype.constructor) // true

function addName(constructor: { new (): any }) {
  constructor.prototype.name = 'lison'
}
@addName
class A {} // A.prototype.name = 'li'
const a1 = new A()
// console.log(a1.name); // error 类型“A”上不存在属性“name”
``` -->

## 参考

- [typescript3.1 中文文档](basic-types)
- [深入浅出 Typescript](https://juejin.im/book/5da08714518825520e6bb810)

## 推荐关于 TS 的书/文章

- [深入理解 TypeScript, 比较完整的介绍，是 typescript-book 中文翻译版](https://jkchao.github.io/typescript-book-chinese/)
- [一篇朴实的文章带你 30 分钟捋完 TypeScript,方法是正反对比](https://juejin.im/post/5d53a8895188257fad671cbc)
