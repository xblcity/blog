# nginx在window下的配置与使用

nginx1.16版本，使用的腾讯云window2016服务器

## 安装与运行

在nginx官网下载对应压缩包 [下载](http://nginx.org/en/download.html)

笔者使用的是1.16版本

解压后的目录如下：

```js

├── conf
│    ├── nginx.conf // 配置文件
├── contrib
├── docs
├── html
     ├── index.html // index html页面
     ├── 50x.html 
├── logs
├── temp
└── nginx.exe

```

在当前文件夹打开命令行，输入start nginx即可启动nginx啦~(或者点击exe文件)

在浏览器中输入`127.0.0.1`或者`localhost`，如果出现了`welcome to nginx`界面，则说明nginx启动成功啦~，在服务器配置的话，在外网访问服务器ip地址也会进入nginx欢迎页面哦

nginx常用命令

```js
start nginx // 启动nginx
nginx -t // 检查语法
nginx -s reload // 重启，每次修改conf配置文件后都需要重新加载 
nginx -s stop/quit // 停止nginx或退出
```

## 配置

nginx配置文件是conf文件夹下的nginx.conf文件，nginx初始配置文件大概是这个样子

```js
// ...
http {
  include       mime.types;
  default_type  application/octet-stream;

  #access_log  logs/access.log  main;

  sendfile        on;
  #tcp_nopush     on;

  #keepalive_timeout  0;
  keepalive_timeout  65;

  #gzip  on;

  // ...

  server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   html;  // 指定文件路径，如果有/等字符，需要加双引号
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    } 

    // ...
  }
  // ...
}
```

我们只需要关心在http部分以及server部分的配置

http里面的通用配置可以作用于每个server，一个server可以代表是一个子域名或者端口

改写默认配置，将80端口配置成域名，也就是把server_name改成域名。这里是`xblcity.com`

在nginx.exe所在文件夹打开命令行，输入`nginx -t`检查语法无误后，输入`nginx -s reload`重启nginx

然后我们在外网访问`xblcity.com`就可以直接访问到nginx欢迎界面啦~

chrome提示我们这不是安全链接，那么如何在nginx里面配置https证书呢(这里你需要先去服务器控制台申请SSL证书)

可以注意到配置文件已经有https的server配置，只需要解开注释，也可以参照腾讯云nginx配置https的参考[nginx配置Https](https://cloud.tencent.com/document/product/400/35244)，这里推荐使用nginx配置文件中自带的内容，我们只需要修改 `server_name`, `ssl_certificate`, `ssl_certificate_key`这几个选项即可，如下

```js
server {
  # ...
  server_name  xblcity.com;

  ssl_certificate      "certificate\xblcity\1_xblcity.com_bundle.crt"; 
  ssl_certificate_key  "certificate\xblcity\2_xblcity.com.key";

  # ...
}
```

命令行输入`nginx -t`检查无误后，输入`nginx -s reload`重启，然后在外网访问`https://xblcity.com`，应该就没问题了。如果提示是安全证书存在问题？检查证书文件是否与域名对应，如果不对应，修改为正确的证书之后可能不会立即生效。nginx出了问题，看是不是启动了多个nginx，杀掉nginx多个进程重新启动一个即可。

如何让http的链接自动跳https呢，需要在80端口的server增加一个选项`rewrite ^(.*)$ https://$host$1 permanent;`进行页面重定向就好啦~

## 配置子域名

现在要配置一个子域名 `reading.xblcity.com`

按照之前的配置，只改变了server_name以及证书位置

很重要的一部是要给子域名配置解析，腾讯云子域名解析，[链接](https://cloud.tencent.com/document/product/302/7800),找到协作子域名添加解析并设置

这时打开`reading.xblcity.com`就可以看到我们想要的网页效果啦~

## 其他注意事项

静态资源会有缓存，建议把文件夹直接删除，更新整个文件夹

将首页文件配置为home.html的时候，指向的一直是index.html，因为用了vuepress的缘故，只能进行重定向了--

nginx 开启 gzip 并配置 [链接](https://cloud.tencent.com/document/product/214/5404)

```js
gzip on;
gzip_min_length 1k; # 设置允许压缩的页面最小字节数
gzip_buffers 4 16k; # 设置系统获取几个单位的缓存用于存储 gzip 的压缩结果数据流。
gzip_http_version 1.1; # 可以使用 gzip 功能的 HTTP 最低版本
gzip_comp_level 2; # 压缩比，范围为1 - 9。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript image/jpeg image/jpg image/gif image/png; # MIME 类型进行压缩
```