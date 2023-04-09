# Next.js Node 层上传/接收文件流

贴上代码

## 上传

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { baseUrl } from '@/utils/env';
import { IncomingForm } from 'formidable';
import type { Fields, Files, File } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers } = req;
  const { token } = headers || {};
  // 处理 headers 逻辑
  // ...
  const form = new IncomingForm();
  const data = await new Promise<{ fields: Fields; files: Files }>((res, rej) => {
    form.parse(req, function (err, fields, files) {
      if (err) rej(err);
      res({ fields, files });
    });
  });
  const { fields, files } = data;
  const { filepath: filePath, originalFilename } = files.file as File;
  const newPath = path.join(path.dirname(filePath), originalFilename || '');

  fs.rename(filePath, newPath, async (err) => {
    if (err) {
      res.status(200).json({ code: '-1', msg: 'failed' });
      return;
    } else {
      const fileResult = fs.createReadStream(newPath);
      const fd = new FormData();
      fd.append('file', fileResult);
      fd.append('type', 1);
      Object.keys(fields)
        .filter((ele) => ele !== 'url')
        .forEach((key) => {
          fd.append(key, fields[key]);
        });

      const option = {
        method,
        body: fd as unknown as ReadableStream,
        headers: {
          token: token as string,
          // headers 逻辑
        },
      };

      try {
        const url = `${baseUrl}${decodeURIComponent('/file/upload')}`;
        console.log('Request URL: ', url);
        const r = await fetch(url, option)
          .then(function (response) {
            return response.json();
          })
          .catch((err) => {
            console.error('fetch error: ', err);
          });
        if (r) {
          res.status(200).json(r || {});
        } else {
          res.status(500).json({ code: '-1', msg: 'failed' });
        }
      } catch (_error) {
        res.status(200).json({ code: '-1', msg: 'failed' });
      }
    }
  });
};

export default handler;
```

## 接收

因为 Node 只做中间层，只需要把返回直接转发出去就行

```js
import { baseUrl } from '@/lib-utils';

const handler = async (req, res) => {
  const { method } = req;
  const { token } = req?.headers;
  const option = {
    method: 'get',
    headers: {
      token,
      'Content-Type': 'image/png',
      accept: 'image/png',
      // ... headers
    },
  };
  try {
    const r = await fetch(
      baseUrl +
      decodeURIComponent(
        `/xxx/preview?idKey=${req?.query?.idKey}&width=${req?.query?.width}`
      ),
      option
    )
      .then(function (response) {
        return response;
      })
      .catch((err) => {
        console.log('fetch error: ', err);
      });
    if (r) {
      res.writeHead(200, {
        'Content-Type': 'image/png',
      });
      res.send(r.body)
    } else {
      res.status(500).json({ code: '-1', msg: 'failed' });
    }
  } catch (error) {
    console.log('error: ', error);
    res.status(200).json({ code: '-1', msg: 'failed' });
  }
};

export default handler;
```
