const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const chalk = require("chalk");
const { handleContent } = require("./util.js");

const preWbeSiteUrl = "https://xblcity.github.io/blog";
const mdWebsitePath = path.resolve(__dirname, "../../README.md");

const preWebContent = `# Blog

:seedling: 记录前端学习的笔记，总结、记录成长的过程。:four_leaf_clover: 构建自己的知识体系。

接触一样技术或者工具时，最先了解的是概念部分，紧接着是它的实践应用。随着实践应用的深入，我们可能需要通过了解原理来更好的解决问题，更好的优化实践应用。

_是什么(WHAT)-怎么做(HOW)-为什么(WHY)_
`;

try {
  const configFile = path.resolve(__dirname, "../config.yml");
  const doc = yaml.load(fs.readFileSync(configFile, "utf8"));
  const docConfig = doc.themeConfig.sidebar;
  if (docConfig) {
    handleContent(docConfig, preWbeSiteUrl, mdWebsitePath, preWebContent, "");
    console.log(chalk.blue("WEBSITE-README创建完成!"));
  }
} catch (e) {
  console.log(e);
}
