# TranslateTo
一个基于 plasmo 框架浏览器扩展教程Demo，用于将网页上的文本翻译成中文。

## 技术栈
- 框架：plasmo
- 语言：TypeScript
- 样式：TailwindCSS
- 工具：pnpm
- 翻译api：Google Translate API


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