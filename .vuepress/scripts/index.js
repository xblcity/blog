// 根据YML自动生成MD
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const preUrl = "https://github.com/xblcity/blog/blob/master";
const mdPath =  path.resolve(__dirname, "../../README.md");
const preContent = `# Blog

:seedling: 记录前端学习的笔记，总结、记录成长的过程。:four_leaf_clover: 构建自己的知识体系。

:whale: [线上版本](https://blog.xblcity.com)

接触一样技术或者工具时，最先了解的是概念部分，紧接着是它的实践应用。随着实践应用的深入，我们可能需要通过了解原理来更好的解决问题，更好的优化实践应用。

_是什么(WHAT)-怎么做(HOW)-为什么(WHY)_

通过./vuepress/script脚本可实现readme自动生成
`;

const handleMdTitle = (mdDir) => {
  const mdPath =  path.resolve(__dirname, `../..${mdDir}.md`);
  const data = fs.readFileSync(mdPath, "utf8");
  const stringData = data.toString();
  const start = stringData.indexOf("#");
  const end = stringData.indexOf("\n");
  const title = stringData.substring(start + 2, end - 1);
  return title;
};

const handleContent = (docConfig) => {
  let mdContent = [];
  const docConfigList = docConfig.filter((item, index) => index > 0);
  docConfigList.slice(0).forEach((item) => {
    let subTitle = item.title;
    let subLine = [];
    item.children.forEach((mdDir) => {
      const thirdTitle = handleMdTitle(mdDir);
      subLine.push(`- [${thirdTitle}](${preUrl}${mdDir}.md)`);
    });
    const subContent = `## ${subTitle}
     \n${subLine.join(`\n`)}
    `;
    mdContent.push(subContent);
  });
  const content = `${preContent}\n${mdContent.join("\n")}`;
  if (fs.existsSync(mdPath)) {
    fs.unlinkSync(mdPath);
  }
  fs.writeFileSync(mdPath, content);
};

try {
  const configFile = path.resolve(__dirname, "../config.yml");
  const doc = yaml.load(fs.readFileSync(configFile, "utf8"));
  const docConfig = doc.themeConfig.sidebar;
  if (docConfig) {
    handleContent(docConfig);
  }
} catch (e) {
  console.log(e);
}
