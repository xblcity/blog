# vscode 插件与配置

一款好的编辑器可以更好的提升开发效率，VS Code 可以通过配置插件达到很好的可用性

一些常见的插件可能需要一定配置才能达到很好的使用效果，比如 emmet, prettier, eslint 等等。当然，现在 vscode 的插件可以直接在设置里进行配置，而不用打开 setting.json 文件进行编辑配置，在设置中改变的配置会自动保存到 setting.json 文件中

想要 VS 有 webstorm 大而全的功能还是比较难，目前存在以下问题：markdown 文件路径引入不提示，当路径为别名比如`@`时，`@/`不提示下一级路径，必须要把`/`删掉才提示，且别名提示非常慢(在 ts 项目中比较正常)

建议每个项目都配一个[jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig)，比如可以配置路径别名提示等等

## 常用插件

### emmet

该插件是 vs 内置的，可以使用该插件快速创建 HTML 标签。修改`emmet.triggerExpansionOnTab`为 true 即可在 html 中按 tab 快捷生成一对标签。

```js
"emmet.triggerExpansionOnTab": true,
```

在.vue 文件中，如果想要支持 tab 键生成 html 标签，需要配置`emmet.includeLanguages`，

在 js 中书写 react JSX 快捷生成标签也需要配置，如下

```js
"emmet.includeLanguages": {
  "vue-html": "html",
  "javascript": "javascriptreact"
}
```

### prettier

prettier 是一款格式化插件，规则只有几个，可以自行配置。结合 eslint 使用是较为广泛的应用

配置，比如`printWidth`行的长度限制, `semi`是否在行尾加分号，`singleQuote`使用单引号等等。以下是个人配置

```js
"prettier.semi": false,
"prettier.singleQuote": true,
"prettier.printWidth": 180,
```

vsCode 默认的格式化快捷方式是 shift+alt+f，如果想要编辑器保存的时候自动格式化，需要配置

```js
// 自动保存
"editor.codeActionsOnSave": {
  "source.fixAll": true
},
// 配置缩进两个字符
"editor.tabSize": 2,
```

如果需要配置 vue, js 等文件的默认格式化工具(通常这种文件有多种格式化工具可用)，可以通过配置如下

```js
// vue文件默认格式化工具
"[vue]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
// js格式化工具
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

### eslint/tslint

eslint 插件有两种作用, 1.警告提示 2.代码修复警告

### 其他重要插件（不需要配置或仅需简单配置）

- gitlens 用于在文件中展示git提交记录

- ES7 React/Redux/GraphQL/React-Native snippets, 作用：快捷生成 react 引入等等。具体要参考文档

- umi pro，使用 Umi 的时候，reducer 以及 effect 的提示，并且可以点击进入对应文件。

- vetur, 使用 vue 的时候用到，可以对.vue 文件进行代码高亮，格式化等。

- Chinese (Simplified) Language Pack for Visual Studio Code, vs code 的中文简体包

- EditorConfig for VS Code，使用 .editorconfig 文件 覆盖编辑器本身设置
- bracket pair colorizer, 效果：一组括号具有相同色彩标识
- guides, 作用：代码块左对齐会有竖线标识
- code spell checker, 作用：对单词拼写进行检查，错误的会进行波浪线标识
- open in browser, 作用：右键菜单文件在浏览器打开
- Markdown Preview Enhanced, 作用：markdown 文件可以进行效果预览
- better comments, 作用：对注释进行不同颜色的标识，可以参照文档进行使用哦
- CSS Modules, 作用：使用 css 模块化时，可以提示样式名
- auto rename tag, 作用：修改一对标签中的一个时，另一个自动修改。个人觉得不太好用，经常出问题，f2 快捷键修改有点问题
- koroFileHeader, 作用：使用快捷键在文件头部生成注释，也可以生成函数注释，不经常用
- Doxygen Document Generator, 作用：使用快捷键可以生成函数参数的详细注释，不用安装，vs 自带了这个功能
- stylelint，与 eslint 类似，不过是针对 css 样式方面的。本人暂时没有使用。
- vscode-stylesheet-beautify，对 less 等 css 样式进行格式化，因为有 prettier 了，这个可以不使用
- Material Icon Theme， 文件图标展示，vs 其实已经自带了，可以不用
- auto close tag，emmet 已经有这种功能了，弃用
- path intellisence，可以弃用,vs 针对 Import 和 require 有路径提示，配置别名[参考](https://code.visualstudio.com/docs/languages/jsconfig)

### 主题相关插件

浅色主题

- Atom One Light Theme 浅灰色亮色背景的主题
- Brackets Light Pro 浅灰色背景的主题，两个
- One Light Pro 浅绿色背景主题，常用
- Eva Theme 浅色系有两种浅灰色背景
- Tiny Light 浅绿色亮色背景

深色主题

- One Dark Pro
- Eva Theme 深色类似 Atom One Dark

## 常用快捷键

记录一些常用的快捷键，在 vscode 键映射中可以设置对应的快捷键。列一下比较常用的快捷键

选中与当前选中文相同的下一个: Ctrl+D
查找: Ctrl+F
替换: Ctrl+H

## 如何制作自己的主题

[VSCode 自定义配色方案](https://www.cnblogs.com/garvenc/p/vscode_customize_color_theme.html) 可以参考下
