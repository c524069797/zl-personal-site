# 快速执行数据库迁移

## 当前状态

代码已推送到 GitHub，Vercel 正在自动部署。部署完成后（通常需要 2-5 分钟），可以使用以下方法执行迁移。

## 方法一：使用浏览器访问（最简单）

等待 Vercel 部署完成后，在浏览器中打开：

```
https://www.clczl.asia/api/admin/migrate-category-field
```

## 方法二：使用 curl 命令

```bash
curl https://www.clczl.asia/api/admin/migrate-category-field
```

## 方法三：使用 Vercel CLI（如果 API 暂时不可用）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 链接项目
vercel link

# 4. 拉取环境变量
vercel env pull .env.local

# 5. 运行迁移脚本
npx tsx scripts/add-category-field.ts
```

## 检查部署状态

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 选择你的项目
3. 查看 "Deployments" 标签页，确认最新部署已完成
4. 部署完成后，访问迁移 API

## 迁移内容

迁移会执行：
1. 添加 `category` 字段到 `posts` 表
2. 创建 `posts_category_idx` 索引  
3. 根据标题和摘要自动分类所有文章

## 验证迁移

迁移成功后，访问以下 URL 验证：
- 技术博客：https://www.clczl.asia/blog?category=tech
- 生活记录：https://www.clczl.asia/blog?category=life

