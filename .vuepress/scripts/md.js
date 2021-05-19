const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const chalk = require("chalk");
const { handleContent } = require("./util.js");

const preWbeSiteUrl = "https://xblcity.github.io/blog";
const mdWebsitePath = path.resolve(__dirname, "../../README.md");

try {
  const configFile = path.resolve(__dirname, "../config.yml");
  const doc = yaml.load(fs.readFileSync(configFile, "utf8"));
  const docConfig = doc.themeConfig.sidebar;
  if (docConfig) {
    handleContent(docConfig, preWbeSiteUrl, mdWebsitePath, '');
    console.log(chalk.blue("WEBSITE-README创建完成!"));
  }
} catch (e) {
  console.log(e);
}
