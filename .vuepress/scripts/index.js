// 根据YML自动生成MD
const fsExtra = require("fs-extra");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const chalk = require("chalk");
const { handleContent, replaceRoute } = require("./util.js");

const preUrl = "https://github.com/xblcity/blog/blob/master";
const mdPath = path.resolve(__dirname, "../../README.md");

try {
  const distPath = path.resolve(__dirname, "../dist/");
  const docPath = path.resolve(__dirname, "../../docs/");
  if (fs.existsSync(docPath)) {
    fsExtra.removeSync(docPath);
  }
  if (fs.existsSync(distPath)) {
    const iFile = path.resolve(__dirname, "../dist/index.html");
    const tFile = path.resolve(__dirname, "../dist/404.html");

    replaceRoute(iFile, /\"\/asset/g, `"./asset`);
    replaceRoute(tFile, /\"\/asset/g, `"./asset`);
    replaceRoute(iFile, /\"\/avatar/g, `"./avatar`);
    fsExtra.move(distPath, docPath, (err) => {
      if (err) return console.log(chalk.red(err));
      console.log(chalk.green("文件移动成功!"));
    });
  }

  const configFile = path.resolve(__dirname, "../config.yml");
  const doc = yaml.load(fs.readFileSync(configFile, "utf8"));
  const docConfig = doc.themeConfig.sidebar;
  if (docConfig) {
    handleContent(docConfig, preUrl, mdPath);
    console.log(chalk.blueBright("README创建完成!"));
  }
} catch (e) {
  console.log(e);
}
