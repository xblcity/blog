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

比如

```js
git checkout dev // 切换至dev分支
git pull // 拉取remote远程代码
git merge  // 远程 remote dev与本地dev进行合并
git checkout master // 切换至本地master分支
git merge dev // 本地master分支与 本地dev分支进行合并

git push -u origin master // 将本地 master分支推送至 remote master  存在多个远程仓库才会用到 -u
```

关于远程仓库的知识

 `git push origin` 该命令表示，将当前分支推送到origin主机的对应分支。

如果当前分支只有一个追踪分支，那么主机名都可以省略。`git push`

如果当前分支与多个主机存在追踪关系，那么这个时候 `-u`(`--set-upstream`)选项会指定一个默认主机，这样后面就可以不加任何参数使用`git push`。

`git push -u origin master` 上面命令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了。
不带任何参数的git push，默认只推送当前分支，这叫做simple方式。此外，还有一种matching方式，会推送所有有对应的远程分支的本地分支。Git 2.0版本之前，默认采用matching方法，现在改为默认采用simple方式。
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
