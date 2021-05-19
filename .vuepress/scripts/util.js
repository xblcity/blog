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

const handleContent = (docConfig, url, mdPath, preContent, suffix) => {
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
  const content = `${preContent}\n${mdContent.join("\n")}`;
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

module.exports.handleContent = handleContent;
// module.exports.replaceRoute = replaceRoute;
