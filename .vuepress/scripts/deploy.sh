#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn run build

# 进入生成的文件夹
cd ../dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git config --local user.name "xblcity"
git config --local user.email "hyaxie@163.com"
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:xblcity/xblcity.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:xblcity/blog.git master:gh-pages

cd -