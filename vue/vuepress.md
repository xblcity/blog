# vuepress一些自定义配置

## 页面内的超链接

页面内的markdwon#标题超链接都被转为小写了，所以原先标题中包含大写的标题跳转不了

在vuepress源码中搜索toLowerCase()

`packages/@vuepress/shared-utils/src/slugify.ts`这个是用于解析路由链接的，其中有lowerCase，用于转换侧栏以及页面内超链接的格式

`markdown-it`用于把markdown转换成HTML

它的插件 `markdown-it-anchor` 库将markdown标题转换为链接，并且转换为小写，[例子](https://jsfiddle.net/9ukc8dy6/)

接着查找react官网以及github的md文件，发现标题超链接都是小写，并且标题中含 `.` 都给去掉了。vuepress是把`.`转换成`-`了，所以统一一下，把vuepress中把`.`替换成`-`注释掉,修改的是slugify.js文件

并且当markdown标题为数字开头时，前面会加上`_`，在上面那个文件继续修改`.replace(/^(\d)/, '_$1')`注释掉

所以最终解决方案就是把之前的页面内的跳转链接进行修改啦~~符合行内标准~~