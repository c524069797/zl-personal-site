# Vercel 数据库迁移指南 - Category 字段

本文档说明如何在 Vercel 上执行 category 字段的数据库迁移。

## 迁移步骤

### 方法一：使用 API 路由（推荐）

1. 部署代码到 Vercel 后，访问以下 URL：
   ```
   POST https://your-domain.com/api/admin/migrate-category-field
   ```

2. 可以使用 curl 命令：
   ```bash
   curl -X POST https://your-domain.com/api/admin/migrate-category-field
   ```

3. 或者在浏览器中打开该 URL（GET 请求也会执行迁移）

### 方法二：使用 Vercel CLI

1. 连接到 Vercel 数据库：
   ```bash
   # 获取数据库连接字符串
   vercel env pull
   ```

2. 运行迁移脚本：
   ```bash
   DATABASE_URL="your-vercel-database-url" npx tsx scripts/add-category-field.ts
   ```

## 迁移内容

迁移脚本会执行以下操作：

1. **添加 category 字段**：
   - 在 `posts` 表中添加 `category` 字段（VARCHAR(255)，默认值为 'tech'）
   - 创建 `posts_category_idx` 索引

2. **自动分类现有文章**：
   - 根据标题和摘要中的关键词自动分类
   - React、Next.js、Vue 等关键词 → 技术博客
   - 表达、沟通、习惯等关键词 → 生活记录

## 验证迁移

迁移完成后，可以通过以下方式验证：

1. 检查 API 响应：
   ```bash
   curl https://your-domain.com/api/posts?category=tech
   curl https://your-domain.com/api/posts?category=life
   ```

2. 检查数据库：
   ```sql
   SELECT id, title, category FROM posts;
   ```

## 注意事项

- 迁移脚本使用 `IF NOT EXISTS`，可以安全地多次执行
- 如果字段已存在，不会重复添加
- 迁移会自动更新所有现有文章的分类

## 回滚（如果需要）

如果需要回滚，可以执行以下 SQL：

```sql
ALTER TABLE posts DROP COLUMN IF EXISTS category;
DROP INDEX IF EXISTS posts_category_idx;
```

