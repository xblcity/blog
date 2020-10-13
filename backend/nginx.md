# nginx 在 window 下的配置与使用

记录 nginx 的使用

nginx 通常用于静态资源的处理转发，通常用于服务器

## 安装与运行

在 nginx 官网下载对应压缩包 [下载](http://nginx.org/en/download.html)

使用的是 1.16 版本，window 系统

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

在当前文件夹打开命令行，输入 start nginx 即可启动 nginx (或者点击 exe 文件)

在浏览器中输入`127.0.0.1`或者`localhost`，如果出现了`welcome to nginx`界面，则说明 nginx 启动成功（在服务器配置的话，输入服务器公网 ip 地址也会进入 nginx 欢迎页面）

nginx 常用命令

```js
start nginx // 启动nginx
nginx -t // 检查语法
nginx -s reload // 重启，每次修改conf配置文件后都需要重新加载
nginx -s stop/quit // 停止nginx或退出
```

## 配置

nginx 配置文件是 conf 文件夹下的 nginx.conf 文件，nginx 初始配置文件大概是这个样子

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

### 域名配置

我们只需要关心在 http 的 server 部分的配置

http 里面的通用配置可以作用于每个 server，一个 server 可以代表是一个子域名或者端口

改写默认配置，把 server_name 改成域名。这里是`xblcity.com`

在 nginx.exe 所在文件夹打开命令行，输入`.\nginx -t`检查语法无误后，输入`.\nginx -s reload`重启 nginx

然后我们在网页访问`xblcity.com`就可以直接访问到 nginx 欢迎界面

chrome 提示我们这不是安全链接，那么如何在 nginx 里面配置 https 证书呢(这里你需要先去服务器控制台申请 SSL 证书)

默认配置文件已经有 https 的 server 配置，只需要解开注释，也可以参照腾讯云 nginx 配置 https 的参考[nginx 配置 Https](https://cloud.tencent.com/document/product/400/35244)，这里推荐使用 nginx 配置文件中自带的内容，我们只需要修改 `server_name`, `ssl_certificate`, `ssl_certificate_key`这几个选项即可，如下

```js
server {
  # ...
  server_name  xblcity.com;

  ssl_certificate      "certificate\xblcity\1_xblcity.com_bundle.crt";
  ssl_certificate_key  "certificate\xblcity\2_xblcity.com.key";

  # ...
}
```

命令行输入`.\nginx -t`检查无误后，输入`.\nginx -s reload`重启，然后在外网访问`https://xblcity.com`，应该就没问题了。如果提示是安全证书存在问题？检查证书文件是否与域名对应，如果不对应，修改为正确的证书之后可能不会立即生效。nginx 出了问题，看是不是启动了多个 nginx，杀掉 nginx 多个进程重新启动一个即可。

如何让 http 的链接自动跳 https 呢，需要在 80 端口的 server 增加一个选项`rewrite ^(.*)$ https://$host$1 permanent;`进行页面重定向就可以了

### 配置子域名

现在要配置一个子域名 `reading.xblcity.com`

按照之前的配置，只改变了`server_name`以及证书位置，在`html`文件夹下新建`reading.xblcity`目录下添加`index.html`

很重要的一部是要给子域名配置解析，腾讯云子域名解析，[链接](https://cloud.tencent.com/document/product/302/7800),找到协作子域名**添加解析**并手动添加一条解析记录。注意，域名解析不会立即生效，需要等几分钟~建议自己查询一下域名是否可以 DNS 解析到

这时打开`reading.xblcity.com`就可以看到我们想要的网页效果

## nginx 代理转发

有时候我们不想直接把端口暴露，比如 3001 端口，可以进行代理，或者进行跨域处理。这时可以使用代理转发

以下配置在访问 `blogc.xblcity.com/api` 实际上访问的是 `http://118.25.215.189:3001`

```js
server {
    listen 80;
    server_name blogc.xblcity.com;

    location /api {
        proxy_pass http://118.25.215.189:3001;
    }
}
```

端口转发，以下配置在访问 `127.0.0.1:9001` 实际上访问的是 `http://xblcity.com`

```js
server {
    listen       9001;
    server_name  127.0.0.1;

    location / {
        proxy_pass http://xblcity.com;
    }
}
```

本地代理端口，以下配置在访问 `127.0.0.1` 实际上访问的是 `http://xblcity.com`。这个在本机没试成功。。不知道为什么，但在服务器上是可以的

```js
server {
    listen       80;
    server_name  127.0.0.1;

    location / {
        proxy_pass http://xblcity.com;
    }
}
```

转发方式更多参考 [nginx 端口转发 (proxy_pass 反向代理)](https://www.cnblogs.com/bneglect/p/11528499.html)

nginx 加上 window 配置本机域名解析，可以达到通过域名访问本机服务的效果

window 域名解析配置文件位置 `C:\Windows\System32\drivers\etc\hosts`

## 其他注意事项

- 静态资源会有缓存，建议把文件夹直接删除，更新整个文件夹
- 将首页文件配置为 home.html 的时候，指向的一直是 index.html，因为用了 vuepress 的缘故，只能进行重定向了--

nginx 开启 gzip 并配置 [链接](https://cloud.tencent.com/document/product/214/5404)

```js
gzip on;
gzip_min_length 1k; # 设置允许压缩的页面最小字节数
gzip_buffers 4 16k; # 设置系统获取几个单位的缓存用于存储 gzip 的压缩结果数据流。
gzip_http_version 1.1; # 可以使用 gzip 功能的 HTTP 最低版本
gzip_comp_level 2; # 压缩比，范围为1 - 9。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript image/jpeg image/jpg image/gif image/png; # MIME 类型进行压缩
```
