---
title: "开始使用 Next.js"
date: "2024-01-15"
summary: "学习如何使用 Next.js 构建现代化的 Web 应用。"
tags: ["Next.js", "教程", "前端"]
draft: false
---

# 开始使用 Next.js

Next.js 是一个强大的 React 框架，提供了许多开箱即用的功能。

## 为什么选择 Next.js？

- **服务端渲染（SSR）**：提升 SEO 和首屏加载速度
- **静态站点生成（SSG）**：预渲染页面，提供最佳性能
- **API 路由**：可以创建 API 端点
- **文件系统路由**：基于文件结构的路由系统

## 安装

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## 基本概念

### 页面路由

在 `app` 目录下创建文件即可自动生成路由：

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[slug]/page.tsx` → `/blog/:slug`

### 数据获取

Next.js 支持多种数据获取方式：

\`\`\`typescript
// 服务端组件
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
\`\`\`

## 总结

Next.js 是一个功能强大且易于使用的框架，适合构建各种类型的 Web 应用。

