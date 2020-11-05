# git 的使用

[git 官方文档中文版](https://git-scm.com/book/zh/v2)，git 的操作在文档基本都能找到答案。

- 克隆仓库
- 添加文件至暂存区
- 把暂存区改动提交到本地的版本库
- 查看/切换/新建分支
- 本地同步远程仓库代码
- 删除分支
- 撤销本地 commit
- 版本切换/回滚
- 查看当前分支信息/上游分支
- git 贮藏
- 合并仓库
- 创建一个空分支
- 常见报错信息

## 克隆仓库

```js
git clone 仓库地址
```

克隆仓库的指定分支，并修改默认文件名

```js
git clone -b "develop" 仓库地址 xbl
```

## 添加所有文件至暂存区

```js
git add .
// 或者 add 指定文件
```

## 把暂存区改动提交到本地的版本库

```js
git commit -m 'message'
```

如果使用了 `husky` 配置了 `git` 钩子函数，想要忽略检查可以在后面加上 `--no-verify` 参数

```js
git commit -m 'message' --no-verify
```

## 将分支推送至远程

```js
git push origin
```

如果当前分支只有一个追踪分支，那么主机名都可以省略。即 `git push`

如果是本地新建的分支，而远程不存在，需要使用下面命令

```js
git push --set-upstream origin dev
// 可以简写为 git push --u origin dev
```

## 查看/切换/新建分支

```js
// 查看本地所有分支，当前分支用绿色表示
git branch

// 查看所有分支，远程仓库会用红色表示出来，一般是 remote/origin/master
git branch -a

// 切换至develop分支，没有则会新建
git checkout develop

// 拉取远程分支，并在本地创建一个与远程分支名字一样的分支
git checkout -b 本地分支名 origin/远程分支名

// 查看当前文件状态，如果修改了文件，则会显示一个修改文件的List
git status
```

## 本地同步远程仓库代码

```js
git pull  // git pull 是git fecth 与 git merge的集合

// 或者
git fetch

git merge // git merge实际上是本地分支与remote分支进行合并
```

## 合并分支

如果是在本地进行分支合并，可以使用下面的步骤，将 dev 分支合并至 master 分支

```js
git checkout master // 切换至本地master分支

git merge dev // 本地master分支与 本地dev分支进行合并

git push -u origin master // 将本地 master分支推送至 remote master  存在多个远程仓库才会用到 -u
```

合并分支在远程仓库也包括 `PR` (pull request)

## 删除分支

删除本地 develop 分支

```js
git branch -D develop
```

删除远程仓库 develop 分支

```js
git push origin --delete develop
```

## 撤销本地 commit

```js
git reset --soft HEAD^
```

HEAD^: 上一个版本，也可以写成 HEAD~1, 如果你进行了 2 次 commit，想都撤回，可以使用 HEAD~2

--soft: 不删除工作空间改动代码，撤销 commit，不撤销 git add .

--mixed: 意思是：不删除工作空间改动代码，撤销 commit，并且撤销 git add . 操作
这个为默认参数,git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的。

--hard: 删除工作空间改动代码，撤销 commit，撤销 git add . 注意完成这个操作后，就恢复到了上一次的 commit 状态。

_如果只是 commit 注释写错了，只是想改注释_

`git commit --amend` 进入 vim 编辑器修改注释然后保存即可

## 版本切换/回滚

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

## 查看当前分支信息/上游分支

```js
git branch -vv
```

## 查看远程分支

remote branch 也叫远程分支，一般分支名为 origin/master 等

```js
git remote // 列出远程所有主机，比如 origin
git branch -r // 列出远程分支
```

如果没有更新到某个主机最新的分支，重新获取 origin 上面的分支

```js
git remote update origin --prune
```

## git 贮藏

[git 工具贮藏与清理](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E8%B4%AE%E8%97%8F%E4%B8%8E%E6%B8%85%E7%90%86#_git_stashing)

有时，当你在项目的一部分上已经工作一段时间后，所有东西都进入了混乱的状态， 而这时你想要切换到另一个分支做一点别的事情。 问题是，你不想仅仅因为过会儿回到这一点而为做了一半的工作创建一次提交。 针对这个问题的答案是 git stash 命令。

需要注意的是，在贮藏的时候不要忘记把非版本跟踪的文件也贮藏起来

```js
git status

git stash // 执行贮藏命令，当前工作目录是干净的了

// gist stash save '暂存修改' 可以在暂存的时候备注暂存信息

git stash list // 贮藏列表

git checkout xxx // 切换到另一个分支

// 做出改动之后，切换至原分支

git checkout xxx

git stash apply // 应用最近一次的贮藏
```

## 合并仓库

- [git 之两个仓库的合并操作](https://www.jianshu.com/p/42a10bbfbf97)

## 创建一个空分支

- [在 GIT 中创建一个空分支](https://segmentfault.com/a/1190000004931751)

## 常见报错信息

### git push fatal: No configured push destination.

git 本地仓库没有远程分支连接  
git remote -v #察看当前远程分支列表  
如果不显示,git remote add origin url  
再次推送

### git push fatal: The current branch master has no upstream branch.

本地分支没有与远程仓库的分支进行关联
To push the current branch and set the remote as upstream, use git push --set-upstream origin master
