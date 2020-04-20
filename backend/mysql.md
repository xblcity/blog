# mysql 使用

本文主要记录window10系统下，mysql安装及服务开启，基本命令操作数据库等

- [mySQL 的安装](#mySQL的安装)
- [window 下命令行操作](#window下命令行操作)
- [安装workbench](#workbench)
- [使用 ORM](#使用ORM)

## mySQL 的安装

### mySQL@5 @8 版本的安装

操作系统：_window10 64 位_ _mySQL@8.0.18zip 压缩版_

1. 下载[地址](https://dev.mysql.com/downloads/mysql/)，建议下载zip压缩包，解压至纯英文目录(不fq下载速度很慢)，笔者把它解压路径`C:\Program Files\mysql-8.0.19-winx64`

2. 初始化并获取临时访问密码

以管理员身份运行`powershell`，

然后输入命令`cd "C:\Program Files\mysql-8.0.19-winx64\bin"`

输入`.\mysqld --initialize --user=mysql --console`。 运行之后，会看最末尾` A temporary password is generated for root@localhost: uewEtCClu8.K` 保存得到的临时密码，上例是 `uewEtCClu8.K`。

> 笔者在Server2016 中出现错误 提示计算机丢失vcruntime140.dll vcruntime140_1.dll msvcp140.dll
> 网上搜一下上面三个文件并下载，把文件分别粘贴至 C:\Windows\SysWOW64  C:\Windows\System32 两个文件夹下
> 接着安装 Microsoft Visual C ++ 2015 Redistributable 就可以了~~~~~~~~

3. 将 mySQL 安装为服务。

仍然以管理员身份在bin目录下进行powershell命令操作。

输入命令 `.\mysqld --install MySQL`。回车即可提示服务安装成功。

4. 安装服务成功后启动服务并连接数据库修改密码(在 bin 目录下操作)

- 启动服务，命令行输入`net start MySQL` 。

- 连接数据库 `.\mysql -u root -p` `u` 代表 `user` `p` 代表 `password`

- 提示要输入密码。Enter password: xxx(输入安装时系统给的默认密码)

- 数据库连接成功，查看数据库 `show databases;` 注意要加分号

- 这时系统提示**必须要重新设置密码**

- 输入命令 `set password for root@localhost = '123456';`

- 再次输入`show databases;` 查看数据库, 默认有四个数据库，分别是`information_schema mysql performance_schema sys`

- `exit;` 退出数据库

- 再次执行`.\mysql -u root -p` 验证新密码正确与否

### 卸载

- `sc delete MySQL` 卸载服务
- `net start MySQL` 启动服务(需要有管理员权限,在任意位置执行命令行)
- `net stop MySQL` 关闭服务(需要有管理员权限,在任意位置执行命令行)

## window 下命令行操作

- 进入 bin 目录，连接数据库(要先启动服务) `mysql -u root -p`
- 输入`help;`查询所有命令

**注意：命令都要以分号结尾，不可省略**

新建数据库及建表：

```js
show databases; // 查看所有数据库
create database demo; // 创建demo数据库
use demo; // 使用demo数据库
show tables; // 查看demo数据库下的表格集合
create table users(id int, name char(5), age int, gender int); // 创建users数据表格，设置关键值及数据类型
show tables; //查看表格集合
desc users; // 查看users表格结构
select * from users  // 查看表格内所有信息
```

删除数据库及数据(接上面)：

```js
drop table users; // 删除users这个表格集合
show tables; // 查看当前数据库所有表
drop database demo; // 删除demo数据库
```

## 安装workbench

命令行操作有一定局限性，且不是很直观，这里可以安装`workbench`这个mysql可视化工具。[下载地址](https://dev.mysql.com/downloads/workbench/)

按照常规软件选择目录，下一步-下一步即可。

打开界面 `MySQL Connection`后面`+`号按照提示，输入`Connection Name` `UserName` `Password`即可

之后页面会多出一个连接，点击连接即可，就可以在里面创数据库啦，比如`create database test; use test;`(要刷新才能看见)

## 使用 ORM

`ORM`全称 `Object Relational Mapping` 即对象关系映射。作用是在关系型数据库和对象之间做一个映射。这样，我们在具体的操作数据库的时候，就不需要再去和复杂的 SQL 语句打交道，只要像平时操作对象一样操作它就可以了 。

这里使用的是`typeorm`，可以在 node 中**使用操作对象的语法来实现 mysql 创建表与查询的操作**

[typeorm 官方文档](https://typeorm.io/#/)

## 参考

- [使用TypeORM和MySQL](https://www.jianshu.com/p/ee5ecc310e23)