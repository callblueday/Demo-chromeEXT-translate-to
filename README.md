## 开发模式

1、 将 `sample.env.local` 更名为 `.env.local` 文件，配置谷歌翻译API key

```
PLASMO_PUBLIC_GOOGLE_API_KEY=your_actual_api_key_here
```

2、运行
```bash
pnpm dev
```

3、在浏览器扩展程序中加载 `build` 文件夹，浏览器地址打开：chrome://extensions/，然后【点击加载已解压的扩展程序】，选择 `build` 文件夹，就可以体验了。


## 生产模式
```bash
pnpm build
```