# 一些 CSS 开发技巧

- 如何覆盖 input placeholder 样式

```css
input:-webkit-input-placeholder {
  color: #ccc;
  font-size: 14px;
}
```

- input 标签支持伪元素 :before :after 吗

不支持

- input 聚焦状态如何修改父元素的类样式

```css
.fa:focus-within {
  border: 1px solid red;
}
```

- css 选择器模糊匹配

```css
/* 所有class包含"icon"字符串的元素都会被选中 */
[class*=“icon”]{
  color: red;
}
/* 所有class以"icon"开头的字符串的元素都会被选中 */
[class^=“icon”]{
  color: red;
}
```

- 一行三个元素，如何布局出 2:1:1 比例宽度

```css
.fa {
  display: flex;
}
.child1 {
  flex-grow: 2;
}
.child2 {
  flex-grow: 1;
}
.child3 {
  flex-grow: 1;
}
```

- 弹性布局，控制子元素不被压缩

```css
flex-shrink: 0;
```

- 父元素高度塌陷，如何改造

```css
.fa {
  display: inline-block;
}
```
