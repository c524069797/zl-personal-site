# Vercel 部署和数据库迁移指南

## 部署步骤

### 1. 代码已自动部署
代码推送到 GitHub 后，Vercel 会自动检测并开始部署。

### 2. 执行数据库迁移

部署完成后，需要执行数据库迁移来添加 `category` 字段。

#### 方法一：使用浏览器访问（最简单）

在浏览器中打开以下 URL：
```
https://your-domain.com/api/admin/migrate-category-field
```

#### 方法二：使用 curl 命令

```bash
curl -X POST https://your-domain.com/api/admin/migrate-category-field
```

#### 方法三：使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接项目
vercel link

# 4. 获取环境变量
vercel env pull

# 5. 运行迁移脚本
DATABASE_URL="your-vercel-database-url" npx tsx scripts/add-category-field.ts
```

## 迁移内容

迁移 API 会执行以下操作：

1. **添加 category 字段**：
   - 在 `posts` 表中添加 `category` 字段（VARCHAR(255)，默认值为 'tech'）
   - 创建 `posts_category_idx` 索引

2. **自动分类现有文章**：
   - 根据标题和摘要中的关键词自动分类
   - React、Next.js、Vue 等关键词 → 技术博客
   - 表达、沟通、习惯等关键词 → 生活记录

## 验证迁移

迁移完成后，API 会返回：
```json
{
  "success": true,
  "message": "成功添加category字段！共更新 X 篇文章",
  "updatedCount": X
}
```

可以通过以下方式验证：

1. **检查 API 响应**：
   ```bash
   curl https://your-domain.com/api/posts?category=tech
   curl https://your-domain.com/api/posts?category=life
   ```

2. **访问网站**：
   - 首页侧边栏的分类按钮应该可以正常点击
   - 点击"技术博客"或"生活记录"应该只显示对应分类的文章

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

