# 常用CSS代码片段

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