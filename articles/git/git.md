# git 的使用

## 合并仓库
- [git之两个仓库的合并操作](https://www.jianshu.com/p/42a10bbfbf97)

## 常见命令
- git status
- git add
- git commit -m
- git push
- git checkout 分支
- git branch -a 查看所有分支
- git remote

## 回退版本，放弃修改

## 报错信息
#### git push fatal: No configured push destination.
git本地仓库没有远程分支连接  
git remote -v #察看当前远程分支列表  
如果不显示,git remote add origin url  
再次推送  

#### git push fatal: The current branch master has no upstream branch.
本地分支没有与远程仓库的分支进行关联
To push the current branch and set the remote as upstream, use git push --set-upstream origin master
