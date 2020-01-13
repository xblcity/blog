# mysql数据库

## mySQL的安装

### mySQL@5 @8 版本的安装

操作系统：*window8.1 64位* *mySQL@5.7.19zip压缩版* 

操作系统：*window10 64位* *mySQL@8.0.18zip压缩版* 

1. 下载[地址](https://dev.mysql.com/downloads/mysql/)，解压至纯英文目录
2. 初始化并获取临时访问密码

在安装目录bin文件夹下调用命令行工具`powershell/cmd`(快捷键是shift+右键->在此处打开命令行窗口)。 输入`mysqld --initialize --user=mysql --console`。 如果提示`mysqld`不是命令，请按照提示信息替换成`.\mysqld`。保存得到的临时密码`password`。

3. 将mySQL安装为服务。

管理员运行`powershell`，并进入`bin`文件夹。(以笔者安装在D盘为例，管理员运行powershell/cmd，依次输入命令，`cd d:` `cd "D:\Program Files\mysql-8.0.18-winx64\bin"`，记得路径加引号)

输入命令 `mysqld --install MySQL`(window10可能要把`mysqld`替换成`.\mysqld`)。回车即可提示服务安装成功。

4. 安装服务成功后启动服务并连接数据库修改密码(在bin目录下操作)

- 启动服务，命令行输入`net start MySQL` 。连接数据库 `mysql(或.\mysql) -u root -p` u代表user p代表password
- 提示要输入密码。Enter password: xxx(输入安装时系统给的默认密码)
- 数据库连接成功，查看数据库 `show databases;` 注意要加分号
- 这时系统提示**必须要重新设置密码**，设置密码： `set password for root@localhost = password('123456');`(@8版本会提示语法错误，输入`set password for root@localhost = '123456';`)
- 再次输入`show databases;` 查看数据库
- `exit;` 退出数据库
- 再次执行`mysql -u root -p` 验证新密码正确与否

### 卸载 

- `sc delete MySQL` 卸载服务
- `net start MySQL` 启动服务(需要有管理员权限,在任意位置执行命令行)
- `net stop MySQL` 关闭服务(需要有管理员权限,在任意位置执行命令行)

## window下命令行操作

- 进入bin目录，连接数据库(要先启动服务) `mysql -u root -p`
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