-- Vercel 数据库迁移 SQL
-- 添加 AI 相关字段到 posts 和 comments 表
-- 使用方法：在数据库管理工具中执行此 SQL，或使用 psql 命令

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

-- 验证字段是否添加成功
SELECT
  'posts' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'posts'
AND column_name IN ('aiKeywords', 'aiSummary', 'aiSummaryAt', 'vectorized')
UNION ALL
SELECT
  'comments' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'comments'
AND column_name IN ('aiAutoReply', 'aiChecked', 'aiCheckedAt', 'aiSpamScore', 'aiToxicScore')
ORDER BY table_name, column_name;

