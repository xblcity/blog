# 概念/应用篇-CSS

在CSS中需要注意一些效果的实现与控制，同时注意一些“意外”的情况是如何产生的。以及兼容移动端H5的一些举措。

- 选择器
- 如何实现单行文本溢出？
- 如何实现多行文本溢出？
- 移动端1px如何实现？
- 如何实现瀑布流(需要结合JS,在后面的文章)？
- 哪些情况会产生margin重叠？

BFC 看个例子 margin 重叠

## 选择器

常见的选择器比如id, class选择器

属性选择器也比较常见，比如 `input[type]`或者 `input[type="text"]`

伪类选择器也比较常见，

树结构伪类选择器：nth-child(even)表示选中偶数节点，first-child或者nth-child(1)表示选中第一个子节点，

链接伪类选择器: :link :visited :hover :active

## 多行文本与单行文本超出省略号

单行文本,限制宽

```js
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

多行文本，限制宽与高

```js
// 使用
overflow: hidden;
text-overflow: ellipsis;

-webkit-box-orient: vertical;
display: -webkit-box;
-webkit-line-clamp: 2;

// umi中
overflow: hidden;
text-overflow: ellipsis;

/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
display: -webkit-box;
-webkit-line-clamp: 2;
```
