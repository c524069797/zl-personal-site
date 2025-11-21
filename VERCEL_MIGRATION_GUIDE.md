# Vercel 数据库迁移指南 - 添加 AI 字段

如果 Vercel 部署后出现 `The column posts.aiSummary does not exist` 错误，说明数据库缺少 AI 相关字段。按照以下方法添加：

## 方法一：使用 API 路由（最简单）⭐ 推荐

部署后，直接在浏览器访问或使用 curl：

```bash
# 访问你的 Vercel 域名
curl https://your-domain.com/api/admin/migrate-ai-fields

# 或者本地测试
curl http://localhost:3000/api/admin/migrate-ai-fields
```

成功后会返回 JSON：
```json
{
  "success": true,
  "message": "所有 AI 字段和索引已成功添加！",
  "details": {
    "posts": ["aiKeywords", "aiSummary", "aiSummaryAt", "vectorized"],
    "comments": ["aiAutoReply", "aiChecked", "aiCheckedAt", "aiSpamScore", "aiToxicScore"],
    "indexes": ["comments_aiChecked_idx", "posts_vectorized_idx"]
  }
}
```

## 方法二：使用迁移脚本（本地运行）

### 步骤 1：获取 Vercel 数据库连接字符串

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 找到 `DATABASE_URL`，复制其值

或者：

1. 进入 **Storage** 标签页
2. 点击你的 Postgres 数据库
3. 进入 **.env.local** 标签页
4. 复制 `POSTGRES_URL` 或 `DATABASE_URL`

### 步骤 2：运行迁移脚本

**选项 A：使用 Shell 脚本**
```bash
# 设置环境变量并运行
DATABASE_URL="postgres://default:xxxxx@xxxxx.vercel-storage.com:5432/verceldb" ./scripts/migrate-vercel-db.sh
```

**选项 B：使用 Node.js 脚本**
```bash
# 设置环境变量并运行
DATABASE_URL="postgres://default:xxxxx@xxxxx.vercel-storage.com:5432/verceldb" npm run db:add-ai-fields
```

**选项 C：使用 Prisma migrate deploy**
```bash
# 设置环境变量
export DATABASE_URL="postgres://default:xxxxx@xxxxx.vercel-storage.com:5432/verceldb"

# 运行迁移
npx prisma migrate deploy
```

## 方法三：使用 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 拉取环境变量
vercel env pull .env.production

# 运行迁移脚本
export $(cat .env.production | grep DATABASE_URL | xargs)
npm run db:add-ai-fields
```

## 方法四：直接执行 SQL（如果其他方法都失败）

如果你有数据库管理工具（如 Supabase Dashboard、pgAdmin），可以直接执行以下 SQL：

```sql
-- 添加 posts 表的 AI 字段
ALTER TABLE "posts"
ADD COLUMN IF NOT EXISTS "aiKeywords" TEXT,
ADD COLUMN IF NOT EXISTS "aiSummary" TEXT,
ADD COLUMN IF NOT EXISTS "aiSummaryAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "vectorized" BOOLEAN NOT NULL DEFAULT false;

-- 添加 comments 表的 AI 字段
ALTER TABLE "comments"
ADD COLUMN IF NOT EXISTS "aiAutoReply" TEXT,
ADD COLUMN IF NOT EXISTS "aiChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "aiCheckedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "aiSpamScore" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "aiToxicScore" DOUBLE PRECISION;

-- 创建索引
CREATE INDEX IF NOT EXISTS "comments_aiChecked_idx" ON "comments"("aiChecked");
CREATE INDEX IF NOT EXISTS "posts_vectorized_idx" ON "posts"("vectorized");
```

## 验证迁移是否成功

迁移完成后，可以通过以下方式验证：

1. **访问 API 路由**（方法一），查看返回的 JSON
2. **检查 Vercel 日志**，查看是否有错误
3. **访问网站**，测试 `/api/posts/hot` 和 `/api/posts/latest` 是否正常

## 常见问题

### Q: 迁移后仍然报错？
A:
1. 确保迁移脚本成功执行（检查返回的 JSON）
2. 清除 Vercel 缓存并重新部署
3. 检查 `DATABASE_URL` 环境变量是否正确

### Q: 如何确认字段已添加？
A: 使用数据库管理工具查询：
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'posts'
AND column_name LIKE 'ai%';
```

### Q: 迁移脚本执行失败？
A:
1. 检查数据库连接字符串格式是否正确
2. 确认数据库允许外部连接
3. 检查网络连接（某些地区可能需要 VPN）

## 预防措施

为了避免将来再次出现此问题，建议：

1. **在构建时自动运行迁移**（修改 `vercel.json`）：
```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && npm run build"
}
```

2. **使用 GitHub Actions**（已在 `.github/workflows/deploy.yml` 中配置）

3. **部署后立即运行迁移**：在 Vercel Dashboard 的部署日志中运行 `npx prisma migrate deploy`


