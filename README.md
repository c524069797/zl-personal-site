# 个人网站

一个使用 Next.js + TypeScript + Tailwind CSS 构建的个人网站，包含博客和简历功能。

## 功能特性

- ✅ **博客系统**：支持 Markdown 格式的文章，带有语法高亮
- ✅ **简历展示**：清晰的简历页面，支持 PDF 导出
- ✅ **主题切换**：支持暗色和亮色主题
- ✅ **响应式设计**：在移动设备和桌面设备上都有良好的体验
- ✅ **SEO 优化**：包含 sitemap.xml、robots.txt 和 RSS feed
- ✅ **性能优化**：使用 Next.js 的静态生成和图片优化

## 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **Markdown**：react-markdown + remark-gfm + rehype-highlight
- **主题**：next-themes

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 项目结构

```
personal-site/
├── app/                    # Next.js App Router 页面
│   ├── blog/              # 博客相关页面
│   │   ├── [slug]/        # 博客详情页
│   │   └── page.tsx       # 博客列表页
│   ├── resume/            # 简历页面
│   ├── feed.xml/          # RSS feed
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # sitemap.xml
├── components/            # React 组件
│   ├── ThemeProvider.tsx  # 主题提供者
│   ├── ThemeToggle.tsx    # 主题切换按钮
│   └── CopyLinkButton.tsx # 复制链接按钮
├── content/               # 内容文件
│   └── posts/            # 博客文章（Markdown）
├── lib/                  # 工具函数
│   ├── posts.ts          # 文章处理函数
│   └── utils.ts          # 工具函数
└── public/               # 静态资源
```

## 添加博客文章

在 `content/posts/` 目录下创建 Markdown 文件，使用以下 frontmatter 格式：

```markdown
---
title: "文章标题"
date: "2024-01-01"
summary: "文章摘要"
tags: ["标签1", "标签2"]
draft: false
---

文章内容...
```

## 自定义配置

### 更新个人信息

1. **首页**：编辑 `app/page.tsx` 中的姓名和标语
2. **简历**：编辑 `app/resume/page.tsx` 中的个人信息
3. **SEO**：编辑 `app/layout.tsx` 中的 metadata

### 设置网站 URL

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 设置环境变量 `NEXT_PUBLIC_SITE_URL`
4. 点击部署

或者使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

## 性能优化

- 使用 Next.js 的静态生成（SSG）
- 图片使用 `next/image` 组件优化
- 代码分割和懒加载
- CSS 优化和压缩

## 许可证

MIT
