# 使用服务器

开始学前端的时候，总是希望能够吧自己写的网站放到互联网上，我刚开始使用的是免费的[neocities](https://neocities.org/browse)。用来放静态网站还是不错的。

后来想着能有自己的存储空间，后来便在腾讯云买了一个属于自己的服务器。基础配置1核2G1M带宽。中间也踩了不少坑，目前用的是window server2016。linux对于新手来说还是有点麻烦，后面有时间再做打算。

## 配置一个网站

想要外网访问的服务器的内容，需要安装nginx作为代理。为了能够使用https协议，还需要在腾讯云申请免费SSL证书，并配置于nginx配置文件。

当配置子域名后，腾讯云会自动进行DNS验证以及域名解析。并生成一条解析记录。

关于nginx的配置，可以参照这里[nginx配置](../nginx)

## 关于Linux的版本

### linux发行版介绍

linux发行版有很多，这里主要介绍以debian的代表ubuntu以及centos代表的red hat一族。

### ubuntu18安装软件  

debian系安装的软件包一般以.deb结尾，red-hat一族，软件包是以.rpm结尾(red hat package manger)，如果是使用yum安装的rpm包，是不用加后缀名的

debian安装软件的操作  
`apt-get`以前用这个比较多，现在一般用`apt`
```js
// 软件包的更新
sudo apt update
// 搜索软件包
sudo apt search xxx
// 安装软件吧
sudo apt install xxx
// 删除软件包
sudo apt autoremove xxx  
```

### centos7
> CentOS（Community Enterprise Operating System，中文意思是社区企业操作系统）是Linux发行版之一，它是来自于Red Hat Enterprise Linux依照开放源代码规定释出的源代码所编译而成。由于出自同样的源代码，因此有些要求高度稳定性的服务器以CentOS替代商业版的Red Hat Enterprise Linux使用。两者的不同，在于CentOS完全开源。--- 摘自百度百科

centos安装软件的命令，rpm, RPM 是Red-Hat Package Manager（RPM软件包管理器）的缩写
```js
rpm -i example.rpm  // 安装 example.rpm 包；
rpm -iv example.rpm  // 安装 example.rpm 包并在安装过程中显示正在安装的文件信息；
rpm -ivh example.rpm  // 安装 example.rpm 包并在安装过程中显示正在安装的文件信息及安装进度
// 删除已安装的包
rpm -e example  // 不用加后缀.rpm
// 升级软件包
rpm -Uvh example.rpm
// 查询软件包
rpm -q example
```
rpm缺点：由于Linux中的程序大多是小程序。程序与程序之间存在非常复杂的依赖关系。RPM无法解决软件包的依赖关系。

yum也是centos安装包管理的命令之一，Yum是RedHat以及CentOS中的软件包管理器。能够通过互联网下载 .rpm 包并且安装，并可以自动处理依赖性关系，无须繁琐地一次次下载、安装。(PS: YUM是生产最佳实践)，现在一般用yum
```js
// yum安装软件
yum install example // 不需要包后缀名
// yum移除软件
yum remove example -y
// yum更新软件
yum update example -y
```

## 参考

 - [Linux软件安装中RPM与YUM 区别和联系](https://www.cnblogs.com/LiuChunfu/p/8052890.html)
