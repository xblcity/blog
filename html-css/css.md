# 概念/应用篇-CSS

在CSS中需要注意一些效果的实现与控制，同时注意一些“意外”的情况是如何产生的。以及兼容移动端H5的一些举措。

- 布局
- 选择器, 伪类, 伪元素
- CSS中的函数值
- 以@开头的
- 动画
- [CSS基础](https://juejin.im/post/5ce607a7e51d454f6f16eb3d)
- 总结CSS3[css3新特性](https://juejin.im/post/5a0c184c51882531926e4294)

效果类

- 移动端1px如何实现？
- 单行/多行文本溢出效果
- 如何实现瀑布流(需要结合JS,在后面的文章)？

## 布局

布局相关, 盒模型, BFC, IFC等等。可以参考[可能是最好的 BFC 解析了](https://juejin.im/post/5e6afcc9e51d45270f52d462)

常见的问题，比如普通文档流，元素外边距margin会自动折叠。可以设置`overflow`属性使其变成BFC元素。`display: flex`会触发BFC，所以它们不会发生margin重叠。可以参考 [全面分析总结BFC原理及实践前言](https://juejin.im/post/5e60c2c7f265da574e22a1f5)。

## 选择器

常见的选择器比如id, class选择器，属性选择器也比较常见，比如 `input[type]`或者 `input[type="text"]`

伪类选择器也比较常见，链接伪类选择器: `:link :visited :hover :active`。表单选择器 `input[type="radio"]:checked`

树结构伪类选择器：nth-child(even)表示选中偶数节点，first-child或者nth-child(1)表示选中第一个子节点，选择最后一个last-child

## CSS中函数值

## @开头

## 动画

## 常见应用

技巧相关 [灵活运用CSS开发技巧](https://juejin.im/post/5d4d0ec651882549594e7293)

动画相关 [我写CSS的常用套路](https://juejin.im/post/5e070cd9f265da33f8653f00)

技巧相关 [你未必知道的49个CSS知识点](https://juejin.im/post/5d3eca78e51d4561cb5dde12)

### 移动端1px边框

需要注意的是input[type="text"]是不能使用伪元素的

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