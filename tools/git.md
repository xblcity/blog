# git 的使用

## git基本使用

以github为例

创建仓库，这时候默认是master分支，接下来再创建一个develop分支用于开发

git命令行操作

```js
git clone 仓库地址

git branch  // 查看本地所有分支，当前分支用绿色表示

git branch -a // 查看所有分支，远程仓库会用红色表示出来，一般是 remote/origin/master

git checkout develop // 切换至develop分支，没有则会新建

git status // 查看当前文件状态，如果修改了文件，则会显示一个修改文件的List

git add . // 添加所有文件至暂存区

git commit -m message // 提交暂存文件至分支, message为字符串，是提交的信息

git push // 将分支推送至远程线上仓库
```

本地同步远程仓库代码

```js
git pull  // git pull 是git fecth 与 git merge的集合

// 或者
git fetch

git merge
```

## git 其他命令/知识

remote branch 也叫远程分支，一般分支名为 origin/master 等

```js
git branch -d develop // 删除本地develop分支

git push origin --delete develop // 删除远程仓库develop分支

git checkout -b 本地分支名 origin/远程分支名  // 拉取远程分支，并在本地创建一个与远程分支名字一样的分支

git push // 如果是接上一条命令，本地分支与远程已建立了联系，会直接push到origin/远程分支

git push origin/远程分支名  // 这种情况用于没有从远程仓库拉取到过的情况，即没有使用过 git checkout -b 本地分支名 origin/远程分支名 命令

git remote // 列出远程分支，比如 origin

// 更多关于remte的命令
```

## 合并仓库
- [git之两个仓库的合并操作](https://www.jianshu.com/p/42a10bbfbf97)

## git常见问题

### 回退版本，放弃修改

### 报错信息
#### git push fatal: No configured push destination.
git本地仓库没有远程分支连接  
git remote -v #察看当前远程分支列表  
如果不显示,git remote add origin url  
再次推送  

#### git push fatal: The current branch master has no upstream branch.
本地分支没有与远程仓库的分支进行关联
To push the current branch and set the remote as upstream, use git push --set-upstream origin master
