# 我的疑问与待做

解决了可能就会直接从这里删除，记录在其他部分

redux/dva中

是dispatch().then

还是dispatch与获取数据分开比较好


开心最重要，我现在


### mySQL的安装及命令行操作
#### window8.1 64位 mySQL为5.7.19zip压缩版
- 解压至纯英文目录
- 初始化并获取临时访问密码，在安装目录bin文件夹下下输入`mysqld --initialize --user=mysql --console` 保存得到的临时密码
- 将mySQL安装为服务(管理员运行)，并指定名称 `mysqld --install MySQL`
- 安装服务成功后启动服务
- 连接数据库(设置密码) `mysql -u root -p` u代表user p代表password
- Enter password: `之前保存的密码`
- 数据库连接成功，查看数据库 `show databases;` 注意要加分号
- 这时系统提示设置密码，设置易记的密码 `set password for root@localhost = password('123456');`
- 再次输入`show databases;`查看数据库
- `exit;`退出数据库
- 再次执行`mysql -u root -p`验证新密码正确与否

#### 卸载 
- `sc delete MySQL` 卸载服务
- `net start MySQl` 启动服务

*至此就安装成功啦！*

### window下命令行操作
- 进入bin目录，连接数据库(要先启动服务) `mysql -u root -p`
- 输入`help;`查询所有命令
- `show databases;`
- `create database demo;` 创建demo数据库
- `use demo;` 使用demo数据库
- `show tables;` 查看demo数据库下的表格集合
- `create table users (id int, name char(5), age int, gender int);` 创建users数据表格，设置关键值及数据类型
- 创建完表格之后，执行`show tables;`查看表格集合
- `drop table users;` 删除users这个表格集合
- `show tables;`
- `drop database demo;` 删除demo数据库
- `desc users;` 查看users表格结构
- `select * from users ` 查看表格内所有信息