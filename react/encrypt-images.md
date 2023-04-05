# 加密图片

正常情况下的 img 标签，在 src 里面放静态资源的地址，浏览器加在加载 img 标签的时候，会自动向 src 的地址发送 get 请求，拿到资源并进行解析，如下

```js
<img className={styles.pic} src='https://xxx.png' />
```

用户直接在浏览器打开新的 tab 页，输入 `https://xxx.png` 地址也能够成功访问该图片资源

加密图片与正常图片不同的是，不能直接通过 `https://xxx.png` 的路径地址进行访问，需要进行加密请求获取到资源，加密请求一般会携带用户的登录凭证，比如 token。

在 `src="http://xxx.com/xx"` 的属性中没有办法加自定义 header 所以需要手动发送请求

- 图片列表绑定 ref，对 ref 进行遍历
- 生成 responseType 为 blob 的 http 请求
- 添加自定义 header
- 通过浏览器提供的 api 解析后端返回资源，并插入到 src 中

代码入下：

```js
// import ...

const Acomponent = () => {
  const picListRef = useRef([]);

  const getRef = (dom) => picListRef.current.push(dom);

  const getImgUrl = () => {
    picListRef.current.forEach((dom) => {
      if (dom) {
        const idKey = dom.getAttribute('dataidkey');
        let request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open(
          'get',
          `/api/designer/material/preview?idKey=${idKey}&width=289`,
          true
        );
        request.setRequestHeader('token', localStorage.getItem('token'));
        let imgRef = dom;
        request.onreadystatechange = (e) => {
          if (
            request.readyState == XMLHttpRequest.DONE &&
            request.status == 200
          ) {
            // imgRef.src = URL.createObjectURL(request.response); // 将生成的blob对象的值赋值给img的src属性
            // imgRef.onLoad = () => {
            //   URL.revokeObjectURL(imgRef.src); // 在图片加载完成后释放
            // };
            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => {
                // convert image file to base64 string
                imgRef.src = reader.result;
              },
              false
            );
            if (request.response) {
              reader.readAsDataURL(request.response);
            }
          }
        };
        request.send(null);
      }
    });
  };

  useEffect(() => {
    if (materialPageList?.length) {
      getImgUrl();
    }
  }, [materialPageList]);

  return (
    <div>
      {xx.map((materialItem) => (
        <div className={styles.imgWrapper}>
          <img
            className={styles.pic}
            alt={materialItem.filename}
            dataidkey={materialItem.idKey}
            ref={getRef}
          />
        </div>
      ))}
    </div>
  );
};
```

浏览器可以借助 URL api 或者 FileReader 生成 blob 对象，但是前者在奇安信扫描的时候会被警告为中危。所以采用了第二个 api
