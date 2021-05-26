# Event事件

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
