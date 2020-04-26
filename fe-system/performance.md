# 性能优化

## 代码中优化

- 减少react组件渲染次数，react异步更新
- 减少重排重绘
- 数据缓存，减少请求次数
- 多个请求一起发出
- 防抖节流
- 对图片进行压缩

## webpack 中优化

- webpack对打包的代码进行压缩
- 代码分割，按需加载
- tree-shaking
- 使用CDN替代过大的包
- 使用splitChunks将app.js这个包分的尽可能小
- 多线程打包，减少打包时间

## 网络层面

- 使用CDN资源
- 减少cookie的使用，可以使用storage进行替代
- 使用cache-control设置http缓存，包含强缓存与协商缓存