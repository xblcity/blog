# CSS 常见问题总结

## sticky 生效

- [sticky](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#%E5%8F%96%E5%80%BC)

元素根据正常文档流进行定位，然后相对它的最近滚动祖先，基于 top、right、bottom 和 left 的值进行偏移。偏移值不会影响任何其他元素的位置。 该值总是创建一个新的层叠上下文（stacking context）。

注意，一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上。

常见的 sticky 用法

当前元素的某个祖先元素（通常是 body）是滚动的，对该元素使用 sticky 属性，正常生效

sticky 失效原因【想相对于 body 进行粘性定位】

1.祖先元素使用了 overflow: hidden/hidden 等非 visible 属性值

最近的一个 overflow 不为 visible 的祖先元素不是 body，导致滚动的 sticky 粘性粘在的不是滚动的 bdoy 上面，而是最近的滚动祖先元素上面。

解决方案：将该元素提升至上层，使其最近的滚动元素是 body

父元素或者祖先元素没有 over: hidden/auto 属性 sticky 则能相对于 body 正常生效

## 行内元素 overflow: hidden 产生其他元素错位问题

原因：overflow:hidden的这个属性影响了inline-block元素baseline的位置；
vertical-align属性的默认值时baseline

## 正则选择器

在 CSS 中需要注意一些效果的实现与控制，同时注意一些“意外”的情况是如何产生的。以及兼容移动端 H5 的一些举措。

- 布局
- 选择器, 伪类, 伪元素
- 以@开头的
- CSS 中的函数值
- 动画

效果类/应用

- 兼容移动端
- 移动端 1px 如何实现？
- 单行/多行文本溢出效果
- 如何实现瀑布流(需要结合 JS,在后面的文章)？

## 布局

布局相关, 盒模型, BFC, IFC 等等。可以参考[可能是最好的 BFC 解析了](https://juejin.im/post/5e6afcc9e51d45270f52d462)

常见的问题，比如普通文档流，元素外边距 margin 会自动折叠。可以设置`overflow`属性使其变成 BFC 元素。`display: flex`会触发 BFC，所以它们不会发生 margin 重叠。可以参考 [全面分析总结 BFC 原理及实践前言](https://juejin.im/post/5e60c2c7f265da574e22a1f5)。

## 选择器

常见的选择器比如 id, class 选择器，属性选择器也比较常见，比如 `input[type]`或者 `input[type="text"]`

伪类选择器也比较常见，链接伪类选择器: `:link :visited :hover :active`。表单选择器 `input[type="radio"]:checked`

树结构伪类选择器：nth-child(even)表示选中偶数节点，first-child 或者 nth-child(1)表示选中第一个子节点，选择最后一个 last-child

伪元素：::first-line, ::first-letter ::before ::after

## @开头的一些属性

@开头的一些值

@import 引入 css 文件; @media 对设备类型进行判断，比如设备宽度。@keyframes 用于定义动画关键帧 @font-face 定义一种字体，icontfont 就是基于这个实现的

```css
@import 'mystyle.css';
@import url('mystyle.css');

@media print {
  body {
    font-size: 10pt;
  }
}
@media screen and (max-width: 300px) {
  body {
    background-color: lightblue;
  }
}

.move {
  transform: translate(-50%, -50%) rotate(0);
  animation: diagonal-slide 3s cubic-bezier(0.93, 1.32, 0.89, 1.15) infinite;
}
@keyframes diagonal-slide {
  from {
    left: 0;
    top: 0;
  }
  to {
    left: 100px;
    top: 100px;
  }
}

@font-face {
  font-family: Gentium;
  src: url(http://example.com/fonts/Gentium.woff);
}
```

## 函数

列举常用的一部分

```js
// 1. 图片

filter: blur() 可以用来模糊背景

// 2. 图形绘制
conic-gradient() // 圆渐变
linear-gradient() // 线性渐变颜色

// 3. 布局
calc() // 计算

// 4. 变形/动画
transform
  matrix()
  matrix3d()
  perspective()
  rotate() // 2d旋转
  rotate3d() // 3d旋转
  rotateX()
  rotateY()
  rotateZ()
  scale() // 缩放
  scale3d()
  scaleX() // x轴缩放
  scaleY()
  scaleZ()
  skew()
  skewX()
  skewY()
  translate() // 移动
  translate3d()
  translateX() // x轴移动
  translateY()
  translateZ()

// 5. 环境与元素
var()
env()
attr()
```

## 动画

比如

```js
@keyframes mykf {
  0% {
    top: 0;
  }
  50% {
    top: 30px;
  }
  75% {
    top: 10px;
  }
  100% {
    top: 0;
  }
}
div {
  animation: mykf 5s infinite;
}
```
上面就是一个简单的动画，其中0%, 100%可以写成from/to

animation分成6个部分: 
- animation-name 动画的名称，这是一个 keyframes 类型的值（keyframes 产生一种数据，用于定义动画关键帧）；
- animation-duration 动画的时长；
- animation-timing-function 动画的时间曲线；
- animation-delay 动画开始前的延迟；
- animation-iteration-count 动画的播放次数；
- animation-direction 动画的方向。

与动画相关还有一个属性`transition`

```js
@keyframes mykf {
  from {
    top: 0;
    transition: top ease;
  }
  50% {
    top: 30px;
    transition: top ease-in;
  }
  75% {
    top: 10px;
    transition: top ease-out;
  }
  to {
    top: 0;
    transition: top linear;
  }
}
```
transition包含四个部分

- transition-property 要变换的属性；
- transition-duration 变换的时长；
- transition-timing-function 时间曲线；
- transition-delay 延迟。

## 常见应用

技巧相关 [灵活运用 CSS 开发技巧](https://juejin.im/post/5d4d0ec651882549594e7293)

动画相关 [我写 CSS 的常用套路](https://juejin.im/post/5e070cd9f265da33f8653f00)

技巧相关 [你未必知道的 49 个 CSS 知识点](https://juejin.im/post/5d3eca78e51d4561cb5dde12)

### 移动端 1px 边框

需要注意的是 input[type="text"]是不能使用伪元素的

```js
.box {
  pisition: relative;
}
// 下边框
.box:after {
  position: absolute;
  content: '';
  width: 100%;
  height: 1px;
  transform: scaleY(0.5)
  background-color: #ccc;
}
```

### 多行文本与单行文本超出省略号

单行文本,限制宽

```js
width: 80px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

多行文本，限制宽与高

```js
width: 80px;
overflow: hidden;
text-overflow: ellipsis;
-webkit-box-orient: vertical;
display: -webkit-box;
-webkit-line-clamp: 2;
```

### 更多效果实现

- [滚动视差？CSS 不在话下](https://juejin.im/post/5b6d0756e51d4562b31ad23c)

## sticky 生效

sticky 失效原因

祖先元素使用了 overflow: hidden

解决方案：将该元素提升至上层

## 行内元素 overflow: hidden 产生其他元素错位问题

原因：overflow:hidden的这个属性影响了inline-block元素baseline的位置；
vertical-align属性的默认值时baseline

## 文中未提到的值得借鉴的文章

- [CSS 基础](https://juejin.im/post/5ce607a7e51d454f6f16eb3d)
- [css3 新特性](https://juejin.im/post/5a0c184c51882531926e4294)