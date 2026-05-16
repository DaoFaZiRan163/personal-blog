# Eric Notes

一个轻量静态个人博客原型，可以直接部署到 Vercel。

## 本地预览

```powershell
npm run dev
```

然后打开 `http://127.0.0.1:5173`。

## 部署思路

1. 创建 GitHub 仓库并把本项目推上去。
2. 在 Vercel 新建项目，选择该 GitHub 仓库。
3. Framework Preset 选择 `Other`，Build Command 留空，Output Directory 留空或填 `.`。
4. 部署完成后，把 Vercel 域名绑定到你的自定义域名。

## 可替换内容

- `index.html` 里的名字、简介、文章标题、邮箱。
- `styles.css` 里的颜色和排版。
- 后续可以增加 `posts/` 目录，每篇文章一个 HTML 或 Markdown 文件。
