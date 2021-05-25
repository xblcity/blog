# vuepress 一些自定义配置

## 配置vuepress并生成README&推送至Github

使用的是`yml`配置文件方便书写

`Github`和线上网站各有一套`README.md`文件，通过`node`将`config.yml`文件转换成所需的`markdown`文件

通过`deploy.sh`脚本执行打包步骤和上传至`github page`分支

具体的文件见本项目的`.vuepress/script`
## 页面内的超链接(二级标题)

> What:

页面内的 markdown#标题超链接都被转为小写了，所以原先标题中包含大写的 markdown#标题跳转不了

> Why:

在`vuepress`源码中搜索`toLowerCase()`

`packages/@vuepress/shared-utils/src/slugify.ts`这个是用于解析路由链接的，其中有 lowerCase，用于转换侧栏以及页面内超链接的格式

`markdown-it`用于把 markdown 转换成 HTML

它的插件 `markdown-it-anchor` 库将 markdown 标题转换为链接，并且转换为小写，[例子](https://jsfiddle.net/9ukc8dy6/)

> 另一个 why, 其他文档 markdown 是不是也是小写的呢？

查找 react 官网以及 github 的 md 文件，发现标题超链接都是小写，并且标题中含 `.` 都给去掉了。`.vuepress`是把`.`转换成`-`了，所以统一一下，把 vuepress 中把`.`替换成`-`注释掉,修改的是 slugify.js 文件

并且当 markdown 标题为数字开头时，前面会加上`_`，在上面那个文件继续修改`.replace(/^(\d)/, '_$1')`注释掉

> How:

修改了上述文件，并且

把之前的页面内的不规范的 markdown 跳转链接进行修改啦-\_-符合行内标准 |--

## vuepress 安装插件

需要工作区先安装 vuepress(之前用的是全局的 vuepress)
