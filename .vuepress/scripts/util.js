const path = require("path");
const fs = require("fs");

const handleMdTitle = (mdDir) => {
  const mdPath = path.resolve(__dirname, `../..${mdDir}.md`);
  const data = fs.readFileSync(mdPath, "utf8");
  const stringData = data.toString();
  const start = stringData.indexOf("#");
  const end = stringData.indexOf("\n");
  const title = stringData.substring(start + 2, end - 1);
  return title;
};

const handleContent = (
  docConfig,
  url,
  mdPath,
  preContent,
  endContent,
  suffix
) => {
  let mdContent = [];
  const docConfigList = docConfig.filter((item, index) => index > 0);
  docConfigList.slice(0).forEach((item) => {
    let subTitle = item.title;
    let subLine = [];
    item.children.forEach((mdDir) => {
      const thirdTitle = handleMdTitle(mdDir);
      subLine.push(`- [${thirdTitle}](${url}${mdDir}${suffix})`);
    });
    const subContent = `## ${subTitle}
     \n${subLine.join(`\n`)}
    `;
    mdContent.push(subContent);
  });
  const content = `${preContent}\n${mdContent.join("\n")}${endContent}`;
  if (fs.existsSync(mdPath)) {
    fs.unlinkSync(mdPath);
  }
  fs.writeFileSync(mdPath, content);
};

const replaceRoute = (filePath, sourceRegx, targetStr) => {
  fs.readFile(filePath, function(err, data) {
    if (err) {
      return err;
    }
    let str = data.toString();
    str = str.replace(sourceRegx, targetStr);
    fs.writeFile(filePath, str, function(err) {
      if (err) return err;
    });
  });
};

const endContent = `
## 关于

本项目使用\`vuepress\`框架

项目启动:

\`yarn dev\`

项目发布至\`Github Page\`(使用git bash客户端):

\`yarn deploy\`
`;

module.exports.handleContent = handleContent;
// module.exports.replaceRoute = replaceRoute;

module.exports.endContent = endContent;
