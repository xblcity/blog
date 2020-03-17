/*
 * 练习测试用
 */

// 定时器

// ES5实现由属性和方法的对象
function Point(x, y) {
  this.name = x
  this.age = y
}
Point.prototype.sayName = function() {
  console.log(this.name)
}
const p = new Point("pp", 17)
p.sayName()
// ES6
class Point6 {
  job = "ddd"
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  sayName() {
    console.log(this.name)
  }
  sayAge() {
    console.log(this.age)
  }
}
const p6 = new Point6("p6", 88)
p6.sayAge()
// ES6 将实例属性定义在类的最顶端，与construtor(){ this.xx = yy}效果相同
class Point7 extends Point6 {
  constructor(props) {
    super(props)
  }
}
const p7 = new Point7("p6", 88)
p7.sayName()
p7.name // fangfang
Point7.name // Point7
Point7().name // fangfang
// ES6 静态属性/方法 静态属性或者方法不会被实例继承，只能直接通过类来调用
class Point8 {
  static name = "fangfang"
  sayAge(props) {
    console.log(props)
    console.log(this.name)
  }
}
const p8 = new Point8("p6", 88)
p8.sayAge("hehe")
p8.name // undefined
Point8.name // fangfang

function foo() {
  console.log(this)
  console.log(this.a)
}

function doFoo(fn) {
  // fn其实引用的是foo
  console.log(this)
  fn() // <-- 调用位置！
}

var obj = {
  a: 2,
  foo: foo
}

var a = "oops, global" // a是全局对象的属性

doFoo(obj.foo) // "oops, global"

var MyModules = (function Manager() {
  var modules = {}

  function define(name, deps, impl) {
    // string, array, function
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]] // 将传入的数组全部变成 [undefined, undefined, ...]
    }
    modules[name] = impl.apply(impl, deps) // 核心，为了模块的定义引用了包装函数(可以传入任何依赖)，并且将返回值(模块的API)，储存在一个根据名字来管理的模块列表中。
    // 把传入的function作为模块的name键对应的值，this指向 function,参数 为空数组？？
  }

  function get(name) {
    return modules[name]
  }

  return {
    define: define,
    get: get
  }
})()

MyModules.define("bar", [], function() {
  function hello(who) {
    return "Let me introduct: " + who
  }

  return {
    hello: hello
  }
})

MyModules.define("foo", ["bar"], function(bar) {
  var hungry = "hippo"

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase())
  }

  return {
    awesome: awesome
  }
})

var bar = MyModules.get("bar")
var foo = MyModules.get("foo")

console.log(bar.hello("hippo")) // Let me introduct: hippo

foo.awesome() // LET ME INTRODUCT: HIPPO

// 默认绑定，隐式绑定，显示绑定call,apply,bind
function foo1() {
  console.log(this)
  console.log(this.a)
}
const obj1 = {
  a: "objname"
}
var a = "windowname"
foo1.call() // 等同于 foo1() 或者 foo1.call(this),, 因为传入null或者undefined会被忽略
foo1.call(obj1)
const objC = Object.create(null)
foo1.call(objC)
// 函数声明,可以手动改变this的指向
// 箭头函数this是由词法作用域确定的，无法改变,
// 如果当前箭头函数没有this，可以继承父级函数的this ??
// 箭头函数用词法作用域取代传统的this机制

function foo() {
  console.log(this)
  console.log(this.a)
}
var a = 2
var o = { a: 3, foo: foo }
var p = { a: 4 }
console.log((p.foo = o.foo))

let emptyArray = new Array(5)
let randomNum = Math.ceil(Math.random() * 31 + 1)
function insertNum(someArray) {
  if (someArray.length > 1) {
    return insertNum()
  } else {
  }
}

function getQueryString() {
  var qs = location.search ? location.search.substring(1) : {}
  var items = qs.split("&")
  var args = {}

  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    var currentObj = item.split("=")
    var name = decodeURIComponent(currentObj[0])
    var value = decodeURIComponent(currentObj[1])
    args[name] = value
  }

  return args
}

const handleChange = async (files, type, index) => {
  console.log(files, type, index)
  setFiles(files)
  console.log(files)
  const response = await aliOss(ossSetting(token))
  // 上传至阿里云
  if (files.length > 0) {
    new Promise(async (resolve, reject) => {
      let imageList = []
      try {
        await files.forEach(async item => {
          const { file } = item
          const res = await response.multipartUpload(file.name, file)
          if (res.res.status === 200) {
            const { requestUrls } = res.res
            imageList.push(requestUrls[0])
            console.log("我ihi按时到货")
          }
        })
        await resolve(imageList)
        await console.log("最后的最后")
      } catch (err) {
        reject(err)
      }
    })
      .then(res => {
        console.log(res)
        done(res)
      })
      .catch(err => {
        console.error(err)
      })
  }
}
