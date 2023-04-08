# C端Next.js项目踩坑

## C端和B端的不同

- `C端` 对样式要求较高，需要注意相关约定
- 框架不同，需选用 `SSR`组件库
- 引入 SSG SSR

## 设计稿规范

需要和 `UI` 约定主体设计内容宽度。推荐 `1200px` 可以满足大部分屏幕需要。

### 约定主题色并定义全局变量

定义 CSS 全局变量

```css
// 定义
html {
  --font-color: #000000;
  --bg-color: #0000;
}
// 入口文件引入全局样式
// 使用
.main {
  color: var(--font-color);
}
```

### 约定并引入指定字体

```css
@font-face {
  font-family: 'Inter-Semi Bold, Inter';
  src: url(../common/font/Inter-SemiBold.ttf);
}

html {
  --semi-bold-font: 'Inter-Semi Bold, Inter';
}
```

### M端需要自适应字体

通过 `postcss-pxtorem` 插件，把px转换成rem，同时需要监听 ua resize 根元素 html 的 rem

### 定义交互规范，比如按钮以及输入框样式

以 input 为例，需要注意 default foucs hover 等状态及样式

页面的 loading list-empty 图片占位图等需要提前和 UI 约定一致

## 项目构建注意事项

使用 `yarn create next-app --typescript` 命令即可初始化一个 `Next.js` 项目。

`package.json` 有几个比较常用的命令

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

`dev` 命令在开发时使用，可以实现快速刷新。

`build` 用于打包。`start` 用于启动生产模式的 `server` 必须在 `build` 之后才能执行。

`Next.js` 不需要过多的配置，可以直接上手开发。可以按需配置一些功能。

### 接入 eslint/prettier

next.js 默认的规则较少，需要用到的是一些 eslit/styleint/prettier 校验及格式化规则，项目中用的是内部的 npm 包，可以配置开源社区相关流行库

```js
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'next',
    require.resolve('xxx'),
  ],
};

// .prettierrc.js
module.exports = {
  ...require('xxx'),
};

// .stylelintrc.js
module.exports = {
  extends: [require.resolve('xxx')],
};
```

可以新建 `.vscode/settings.json` 添加统一的 `VS Code` 配置，方便团队统一管理

主要配置 autoFormat 以及 format 默认采用的扩展选项

```js
{
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": ["javascript", "typescript"],
  "editor.formatOnSave": true,
  // ...
}
```

#### 配置 next.config.js

由于 `Next.js` 是动态服务，需要用 `Docker Node` 镜像，使用不了 `Nginx` 镜像。需要配置环境变量

在 Docker 容器会注入环境变量， Next 项目可以获取到这个环境变量

```js
// 配置前缀路径
module.exports = {
  basePath: process.env.BASE_URL || 'http://xxx.com',
};
```

在本地开发时，如果直接调用测试环境，会存在跨域问题，使用 `Next.js` ，推荐使用中间的 `Node` 层，即在请求路径加上 `/api` 前缀，`Next.js` 会自动通过 `Node` 发送请求。就不会存在跨域问题。

例如 `/api` 目录下的一个 `demo`：

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetcher } from 'utils/index';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { token, siteuid } = req?.headers;
  const options = {
    method,
    body,
  };
  // ... 处理参数
  const response = await fetcher('/', options);
  res.status(200).json(response);
};

export default handler;
```

#### 封装 fetch

- 对权限报错统一处理，并允许跳过报错处理
- 客户端/Node层 通用
- 支持 `mock` `api` `http` 等调用方式

```js

const getEnv = () => {
  const { publicRuntimeConfig: env } = getConfig();
  return env || {};
};

// fetch 函数
const fetcher = async (url, options, proxy = '') => {
  if (typeof url !== 'string')
    throw new TypeError('url must be required and of string type');
  const env = getEnv();
  const isClient = typeof window !== 'undefined';

  // ...

  //  不同环境区分不同的 请求路径 地址
  let targetUrl;
  if (options.mock) {
    targetUrl = `${env.MOCK_URL}${parseUrl.replace('/api', '')}`;
  } else if (!isClient) {
    targetUrl = `${env.BASE_URL}${parseUrl}`;
  } else if (url.startsWith('http')) {
    targetUrl = url;
  } else if (parseUrl.startsWith('/api/')) {
    targetUrl = parseUrl;
  }

  return fetch(targetUrl, newOptions)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      // 是否跳过 token失效跳转 等 错误处理。例如获取用户信息接口
      const skipErrorHandler = newOptions?.skipErrorHandler;
      if (skipErrorHandler) {
        return res;
      }
      // token expired/forbidden
      if (isClient && (res?.code === '100002' || res?.code === '100003')) {
        router.push(`/login?redirect=${window?.location?.href}`);
        store.dispatch(updateUserInfo({ login: false }));
        return res;
      }
      // 其他报错
      if (
        isClient &&
        !(String(res?.code) === '0' || String(res?.status) === '0')
      ) {
        Toast.error(String(res?.code) || res?.msg);
        return res;
      }
      return res;
    })
    .catch((e) => {
      console.error('fetch error: ', targetUrl, e);
    });
};
```

## 其他技术栈

### 接入极验与风控

极验验证是一种在计算机领域用于区分自然人和机器人的，通过简单集成的方式，为开发者提供安全、便捷的云端验证服务。

前端主要做的事情是，引入极验实例，并且初始化实例。

- 页面上对按钮做了透明处理，用户点击极验按钮的时候，无感知。
- 在每次点击完极验按钮之后，需要手动 `destroy` 极验实例，并且重新初始化极验实例
- 传给极验初始化的 Login 函数，不能够获取到最新的 state，需要把要传递的数据记录在 ref 上面进行动态更新
- 触发风险二次校验，需要配置 bind 模式，并且手动调用 gtInstance.click，这样验证图片可以直接弹出

### 埋点

一种是曝光/点击埋点

还有一种是报错埋点，通过 React 的 ErrorBounding、componentDidCatch

### 国际化

国家化需要使用 `getStaticProps` api 生成 翻译文件，并传递给页面级组件。

#### redux

如何在使用 updateState 的时候，进行友好提示，即提示更新的属性

```ts
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import store from './root-store';

interface State {
  /** 登录状态 */
  login: boolean;
}

export type UserState = Partial<State>;

// 此处需要给 SliceCaseReducers 传递泛型
export const userStore = createSlice<UserState, SliceCaseReducers<UserState>>({
  name: 'user',
  initialState: {
  },
  reducers: {
    updateUserInfo: (state: UserState, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateUserInfo } = userStore.actions;

export const updateUserState = (state: UserState) => {
  store.dispatch(updateUserInfo(state));
};

export default userStore.reducer;
```

### Swiper插件