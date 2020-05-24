# git 的使用

[git 官方文档中文版](https://git-scm.com/book/zh/v2)

## 创建远程仓库

以github为例，创建仓库，这时候默认是 `master` 分支，可以再创建一个 `develop` 分支用于开发(当然也可以本地创建develop同步到远程仓库)

## 本地仓库 git 命令行操作

```js
git clone 仓库地址

git branch  // 查看本地所有分支，当前分支用绿色表示

git branch -a // 查看所有分支，远程仓库会用红色表示出来，一般是 remote/origin/master

git checkout develop // 切换至develop分支，没有则会新建

git status // 查看当前文件状态，如果修改了文件，则会显示一个修改文件的List

git add . // 添加所有文件至暂存区

git commit -m 'message' // 提交暂存文件至分支, message为字符串，是提交的信息

git push // 将分支推送至远程线上仓库

// 如果在本地创建了一个分支推送的时候想在远程分支创建一个相同的分支名

git push --set-upstream origin dev // 本地dev推送至origin远程dev分支
```

## 与远程仓库相关的操作

本地同步远程仓库代码

```js
git pull  // git pull 是git fecth 与 git merge的集合

// 或者
git fetch

git merge // git merge实际上是本地分支与remote分支进行合并
```

## 合并分支

合并分支在远程仓库也包括 `PR` (pull request)

如果是在本地进行分支合并，可以使用下面的步骤

```js
git checkout dev // 切换至dev分支

git pull // 拉取remote远程dev分支的代码

// 更改文件并进行commit之后...

git checkout master // 切换至本地master分支

git merge dev // 本地master分支与 本地dev分支进行合并

git push -u origin master // 将本地 master分支推送至 remote master  存在多个远程仓库才会用到 -u

```

## 推送至远程分支

将当前分支推送到 origin 主机的对应分支。

```js
git push origin
```

如果当前分支只有一个追踪分支，那么主机名都可以省略。

`git push`

如果当前分支与多个主机存在追踪关系，那么这个时候 `-u`(`--set-upstream`)选项会指定一个默认主机，这样后面就可以不加任何参数使用`git push`。

`git push -u origin master` 上面命令将本地的 master 分支推送到 origin 主机，同时指定 origin 为默认主机，后面就可以不加任何参数使用 git push 了。

不带任何参数的 git push，默认只推送当前分支，这叫做 simple 方式。此外，还有一种 matching 方式，会推送所有有对应的远程分支的本地分支。Git 2.0 版本之前，默认采用 matching 方法，现在改为默认采用 simple 方式。

## git 其他命令/知识

remote branch 也叫远程分支，一般分支名为 origin/master 等

```js
git branch -d develop // 删除本地develop分支

git push origin --delete develop // 删除远程仓库develop分支

git checkout -b 本地分支名 origin/远程分支名  // 拉取远程分支，并在本地创建一个与远程分支名字一样的分支

git push // 如果是接上一条命令，本地分支与远程已建立了联系，会直接push到origin/远程分支

git push origin/远程分支名  // 这种情况用于没有从远程仓库拉取到过的情况，即没有使用过 git checkout -b 本地分支名 origin/远程分支名 命令

// 更多关于remote的命令
// 远程remote创建了分支，本地并没有查看到？
git remote // 列出远程所有主机，比如 origin
git branch -r // 列出远程分支
// 如果没有更新到最新的分支
git remote update origin --prune // 重新获取origin上面的分支
git branch -vv // 查看本地分支和远程分支对应关系
git checkout -b front-end origin/front-end // 新建本地分支front-end与远程front-end分支相关联
// 删除本地分支
git branch -D develop // 删除develop分支
git push origin --delete develop // 删除远程分支
git checkout --orphan develop  // 创建新的分支
git rm -rf . // 删除，不留git记录
git commit -am "new branch for documentation" // 提交分支,提交一个无版本记录分支
// 新建文件，这样才会有版本记录
git push -u origin develop // 本地推送到远程
git merge back-end --allow-unrelated-histories // 允许合并两个无相关记录的两个分支
```

## 合并仓库

- [git 之两个仓库的合并操作](https://www.jianshu.com/p/42a10bbfbf97)

## git版本切换

回滚到历史版本

```js
// 使用git log命令查看所有的历史版本，获取你git的某个历史版本的id
git log

// git log 默认只显示四条，按 ↓ 键会显示更多记录

// 假设需要回滚这条commit
git reset --hard b87d84885b5d3fd74c4e658c0ed6a6260d8d849a
```

从历史版本切换到最新版本

```js
git reflog // 查看命令的记录
git reset --hard 580361e  //  git reset 来返回到相应的版本即可，HEAD前面的一串字符为我们简写的ID
```

## git 贮藏

[git工具贮藏与清理](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E8%B4%AE%E8%97%8F%E4%B8%8E%E6%B8%85%E7%90%86#_git_stashing)

有时，当你在项目的一部分上已经工作一段时间后，所有东西都进入了混乱的状态， 而这时你想要切换到另一个分支做一点别的事情。 问题是，你不想仅仅因为过会儿回到这一点而为做了一半的工作创建一次提交。 针对这个问题的答案是 git stash 命令。

```js
git status

git stash // 执行贮藏命令，当前工作目录是干净的了

git stash list // 贮藏列表

git checkout xxx // 切换到另一个分支

// 做出改动之后，切换至原分支

git checkout xxx

git stash apply // 应用最近一次的贮藏
```

## git 常见问题

### 放弃本地修改

`git checkout 文件名`

或者 `git reset xxx` 后面根据提示进行修改


### 报错信息

#### git push fatal: No configured push destination.

git 本地仓库没有远程分支连接  
git remote -v #察看当前远程分支列表  
如果不显示,git remote add origin url  
再次推送

#### git push fatal: The current branch master has no upstream branch.

本地分支没有与远程仓库的分支进行关联
To push the current branch and set the remote as upstream, use git push --set-upstream origin master

## 参考

- [在 GIT 中创建一个空分支](https://segmentfault.com/a/1190000004931751)
