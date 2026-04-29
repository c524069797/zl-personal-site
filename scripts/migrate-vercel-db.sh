#!/bin/bash

# Vercel 数据库迁移脚本
# 使用方法：
# 1. 从 Vercel Dashboard 获取 DATABASE_URL
# 2. 运行: DATABASE_URL="your-vercel-db-url" ./scripts/migrate-vercel-db.sh

set -e

if [ -z "$DATABASE_URL" ]; then
  echo "❌ 错误: 请设置 DATABASE_URL 环境变量"
  echo "使用方法: DATABASE_URL="your-database-url" ./scripts/migrate-vercel-db.sh"
  exit 1
fi

# 隐藏密码显示
DB_URL_PREVIEW=$(echo "$DATABASE_URL" | sed -E 's/:\/\/[^:]+:[^@]+@/:\/\/***:***@/')

echo "🚀 开始迁移 Vercel 数据库..."
echo "数据库: $DB_URL_PREVIEW"

# 检查是否有 psql 命令
if ! command -v psql &> /dev/null; then
  echo "⚠️  psql 未找到，尝试使用 Prisma..."

  # 使用 Prisma 执行迁移
  echo "使用 Prisma 执行迁移..."
  npx prisma db execute --url "$DATABASE_URL" --file prisma/migrations/20251117083304_add_ai_fields/migration.sql --schema prisma/schema.prisma || {
    echo "⚠️  Prisma 迁移失败，尝试使用 Node.js 脚本..."
    DATABASE_URL="$DATABASE_URL" npx tsx scripts/add-ai-fields.ts
  }
else
  # 使用 psql 执行 SQL
  echo "使用 psql 执行迁移..."
  psql "$DATABASE_URL" << 'EOF'
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
EOF
fi

echo "✅ 迁移完成！"
