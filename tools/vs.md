# vscode插件与配置

## 常用插件

### emmet

该插件是vs内置的，可以使用该插件快速创建HTML标签。修改`emmet.triggerExpansionOnTab`为true即可在html中按tab快捷生成一对标签。

在.vue文件中，如果想要支持tab键生成html标签，需要配置`emmet.includeLanguages`

### Chinese (Simplified) Language Pack for Visual Studio Code

vs code的中文简体包

### bracket pair colorizer

效果：一组括号具有相同色彩标识

### guides

作用：代码块左对齐会有竖线标识

### better comments

作用：对注释进行不同颜色的标识

### code spell checker

作用：对单词拼写进行检查，错误的会进行波浪线标识

### Doxygen Document Generator

作用：使用快捷键可以生成函数参数的详细注释

### koroFileHeader

作用：使用快捷键在文件头部生成注释，也可以生成函数注释(但不如上一个插件详细)

### path intellisence

作用：路径提示。也可以设置路径别名的提示，比如@标识src目录，需要配合jsconfig文件进行配置使用

### open in browser

作用：右键文件在浏览器打开

### eslint

作用：编辑器不符合eslint规范会有提示。需要项目安装eslint的依赖才能有对应提示

### tslint

作用同eslint

### beautify

作用：可以对代码进行格式化，规则只有几个，可以自行配置。结合eslint使用是较为广泛的应用

### stylelint

效果：与eslint类似，不过是针对css样式方面的。本人暂时没有使用。

### vscode-stylesheet-beautify

作用：对less等css样式进行格式化

### CSS Modules

作用：使用css模块化时，可以提示样式名

### ES7 React/Redux/GraphQL/React-Native snippets

作用：快捷生成react引入等等。具体要参考文档

### auto rename tag

作用：修改一对标签中的一个时，另一个自动修改

### Markdown Preview Enhanced

作用：markdown文件可以进行效果预览

### Material Icon Theme

文件图表展示

### umi pro

作用：使用Umi的时候，reducer以及effect的提示，并且可以点击进入对应文件。

### auto close tag

作用：自动闭合标签，已经使用了emmet插件的vs，是否还在需要？

### EditorConfig for VS Code

使用 .editorconfig文件 覆盖编辑器本身设置

### vetur

使用vue的时候用到

### 主题相关插件

浅色主题

- Atom One Light Theme 浅灰色亮色背景的主题
- Brackets Light Pro 浅灰色背景的主题，两个
- One Light Pro 浅绿色背景主题，常用
- Eva Theme 浅色系有两种浅灰色背景
- Tiny Light 浅绿色亮色背景

深色主题

- One Dark Pro
- Eva Theme 深色类似Atom One Dark 

## 常用快捷键

记录一些常用的快捷键，在vscode键映射中可以设置对应的快捷键。列一下比较常用的快捷键

选中与当前选中文相同的下一个: Ctrl+D
查找: Ctrl+F
替换: Ctrl+H


## 如何制作自己的主题


