# vuepress一些自定义配置

## 页面内的超链接

> What: 

页面内的markdown#标题超链接都被转为小写了，所以原先标题中包含大写的markdown#标题跳转不了

> Why:

在`vuepress`源码中搜索`toLowerCase()`

`packages/@vuepress/shared-utils/src/slugify.ts`这个是用于解析路由链接的，其中有lowerCase，用于转换侧栏以及页面内超链接的格式

`markdown-it`用于把markdown转换成HTML

它的插件 `markdown-it-anchor` 库将markdown标题转换为链接，并且转换为小写，[例子](https://jsfiddle.net/9ukc8dy6/)

> 另一个why, 其他文档 markdown 是不是也是小写的呢？

查找react官网以及github的md文件，发现标题超链接都是小写，并且标题中含 `.` 都给去掉了。`.vuepress`是把`.`转换成`-`了，所以统一一下，把vuepress中把`.`替换成`-`注释掉,修改的是slugify.js文件

并且当markdown标题为数字开头时，前面会加上`_`，在上面那个文件继续修改`.replace(/^(\d)/, '_$1')`注释掉

> How:

修改了上述文件，并且

把之前的页面内的不规范的markdown跳转链接进行修改啦-_-符合行内标准 |--