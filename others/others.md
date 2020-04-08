# 其他待整理

- mongoDB安装出现的问题以及解决办法
- 记录一些在配置云服务器的事项

## mongoDB安装出现的问题以及解决办法

#### 安装包名是86x 但是实际上是64位
- 安装的MongoDB版本是4.0.4，操作系统是Windows8.1 64位

##### 安装选项
- 倒数第二步，勾选Install MongoDB Compass可能会导致安装不成功

##### 错误
- 在moongoDB官网下载二进制文件，选择默认安装目录后，进行安装，会提示`Service 'MongoDB Server' failed to start. Verify that you have sufficient privileges to start system services.`这个先不管
- 安装完成，在`C:\Program Files\MongoDB\Server\4.0\bin` 文件夹下打开命令行(shift+右键)，运行mongod命令发现会有错误弹窗，提示信息 `api-ms-win-crt-runtime-l1-1-0.dll`文件缺失
- 此时需要安装 `Visual C++ Redistributable for Visual Studio 2015` 这个软件，[下载地址](https://www.microsoft.com/zh-cn/download/details.aspx?id=48145)
- 安装完成后再次运行mongod命令，如果仍然出错，需要先把`C:\Windows\SysWOW64下api-ms-win-crt-runtime-l1-1-0.dll`文件先删除（可以备份）
- 然后将 `Visual C++ Redistributable for Visual Studio 2015` 先卸载再次安装
- 再次运行 mongod 命令，发现生效，无报错，此时需要在 C盘 根目录下新建 data 文件夹，data文件夹下再新建 db 文件夹（否则直接运行mongod命令无法连接数据库）
- 然后在命令行运行`C:\mongodb\bin\mongod --dbpath c:\data\db` 修改默认的存储目录
- 至此安装运行成功
- 推测前面产生错误的原因是电脑自带的 Visual C++ Redistributable 版本是 2012，可能版本太老需要安装新版本 2015

##### 配置环境变量
- 配置环境变量的作用是，执行monogo命令时，不必每次都找到安装目录执行，可以在任意文件夹执行
- 把mongoDB安装包bin文件夹完整路径拷贝至window环境配置路径中，注意加入的是文件夹哦！
- 计算机--右击属性--高级系统设置--环境变量--path--编辑--加入末尾即可，注意要在前面加入分号
- mongoDB安装的时候默认已经加入windows服务



## 记录一些在配置云服务器的事项
> SSL证书申请，在腾讯云申请的免费的，还是比较方便的

- 申请免费SSL证书时，如果选择自动生成DNS验证时，解析记录会多一条TXT记录，用于验证域名的所有权，也可以选择自己手动添加，SSL证书颁发完成后，可以选择删除这条TXT记录（因为看着比较别扭...）
- [参考链接1](https://cloud.tencent.com/document/product/400/4142#2.E3.80.81.E6.89.8B.E5.8A.A8dns.E9.AA.8C.E8.AF.81) [参考链接2](https://cloud.tencent.com/document/product/400/6815) [TXT记录链接](https://cloud.tencent.com/document/product/302/12648)

> windows文件传输 SSL方式

- [参考链接](https://cloud.tencent.com/document/product/213/8042)

> DNS解析 域名解析

- 腾讯云默认提供了
- 可以添加二级域名，记录值要添加成A
- 之前SSL申请证书产生的TXT记录可以删除

> 小程序相关

- 自行部署node.js [参考链接](https://cloud.tencent.com/document/product/619/11445)

> pm2常用命令

- pm2 start app.js --name="api"  指定任务名字为api
- pm2 start app.js --watch 文件变化时自动重启 可以和上面任务连写
- pm2 list  pm2所有应用程序列表
- pm2 show api 显示名为api的应用信息
- pm2 reload api 重载指定的应用
- pm2 restart api 重启指定的应用
- pm2 stop all 停止所有应用程序
- pm2 stop 0 停止id为0的应用

> 使用pm2与git自动更新项目

- 需要在server根目录下创建ecosystem.json配置pm2选项
- windows cmd命令输入`NETSTAT -a -n`查看当前被占用的 端口号

> windows 安装服务

- sc create 服务名 binPath= "目录\xxx.exe"
- net start xxx
- net stop xxx
- sc delete xxx

> node.js框架搭建https接口

```js
const fs = require('fs')
const https = require('https')
const express = require('express)
const options = {
  key : fs.readFileSync("./xblcity/2_xblcity.com.key"),
  cert: fs.readFileSync("./xblcity/1_xblcity.com_bundle.crt")
}
...
https.createServer(options, app).listen(8090)

// 或者
const Koa = require('koa')
const fs = require('fs')
const https = require('https')
const config = require('./config.js') // 配置的端口
...
https.createServer(options, app.callback()).listen(config.port);
```

## Event事件

## 常见的HTML事件种类
 
### window事件
window事件常见的有  
- onload 页面加载之后执行  
- onresize 浏览器大小窗口被调整时触发

### Form表单控件事件
由HTML表单内的动作触发的事件，常用在form表单控件元素中  
- onblur 元素失去焦点
- onchange 元素值被改变时
- onfocus 元素获得焦点
- oninput 用户输入时
- onsubmit 提交表单时触发  
`onchange和input事件的区别：onchange事件需要在input输入框失去焦点才能触发，oninput事件是在表单value值发生变化后立即执行，oninput可以通过设置定时器节流控制触发的频率`

### Keyboard事件(一般用于表单输入框)
- onkeydown 用户按下按键
- onkeypress 用户敲击按键
- onkeyup 用户释放按键

### Mouse事件
- onclick 鼠标点击  

- onmousedown 按下鼠标
- onmousemove 鼠标指针移动到元素
- onmouseout  鼠标指针移出元素  

- onmouseover 鼠标指针移动到元素
- onmouseup 在元素上释放鼠标  

- onscroll 元素滚动条滚动时  
`如果要捕获页面的滚动事件，对document添加scroll事件即可，即document.addEventListener(scroll, () => {})`

### Media事件
由媒介（比如视频、图像和音频）触发的事件，适用于所有HTML元素，但常见于媒介元素中，比如`<audio>、<video>、<img>`
- oncanplay 文件就绪可以开始播放
- onpause 媒介被用户暂停
- onplay 媒介可以开始播放
- onplaying 媒介开始播放时

### DOM的属性
需要注意的是，event事件是无法直接获取DOM的client/offset系列属性值的  
client/offset系列值是 只读属性  
假设有以下代码
``` html
<!DOCTYPE html>
<style>
  body {
    margin: 0;
    padding: 0;
  }
  #container {
    width: 50px; 
    height: 50px; 
    margin: 10px; 
    border: 10px solid #ccc;
  }
  #box {
    width: 20px; 
    height: 20px;
    margin: 5px;  
    padding: 5px; 	
    border: 5px solid skyblue;
  }
</style>
<body>
  <div id="container">
    <div id="box"></div>
  </div>

  <script>
    var box = document.getElementById('box')
    // 没有offsetRight/offsetBottom/clientRight/clientBottom 等属性
    console.log(box.offsetTop, box.offsetLeft)  // 25 25 margin+距离页面边距，包含滚动条 
    console.log(box.offsetHeight, box.offsetWidth)  // 40 40 width+padding+border
    console.log(box.clientTop, box.clientLeft) // 5 5 border宽度
    console.log(box.clientHeight, box.clientWidth) // 30 30 width+padding
  </script>
</body>
</html>
```

### 事件的属性
Event对象，以鼠标click事件为例，一般需要关注的是触发事件的元素和触发的相对坐标
- e.target 触发事件的当前DOM元素  
获取当前事件点的相对坐标和获取DOM节点的相对坐标的属性不一样，是可能混淆的点

接上部分代码
```js
box.addEventListener('click', function(e) {
  console.log(e.target) // <div id="box"></div>
  console.log(e.offsetX, e.offsetY) // 距离事件触发元素元素border内边框的值
  console.log(e.clientX, e.clientY) // 距离页面边距 
  console.log(e.x, e.y) // 同上
  console.log(e.pageX, e.pageY) // 同上，但包含滚动条
  console.log(e.screenX, e.screenY) // 相对于用户屏幕，用不到
})
```




- [babel执行机制](https://github.com/MuYunyun/blog/blob/master/BasicSkill/%E7%95%AA%E5%A4%96%E7%AF%87/babel%E6%89%A7%E8%A1%8C%E6%9C%BA%E5%88%B6.md)