import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addAIFields() {
  try {
    console.log('开始添加 AI 相关字段...')

    // 添加 posts 表的 AI 字段
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "posts"
      ADD COLUMN IF NOT EXISTS "aiKeywords" TEXT,
      ADD COLUMN IF NOT EXISTS "aiSummary" TEXT,
      ADD COLUMN IF NOT EXISTS "aiSummaryAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "vectorized" BOOLEAN NOT NULL DEFAULT false;
    `)
    console.log('✓ posts 表字段已添加')

    // 添加 comments 表的 AI 字段
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "comments"
      ADD COLUMN IF NOT EXISTS "aiAutoReply" TEXT,
      ADD COLUMN IF NOT EXISTS "aiChecked" BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "aiCheckedAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "aiSpamScore" DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "aiToxicScore" DOUBLE PRECISION;
    `)
    console.log('✓ comments 表字段已添加')

    // 创建索引
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "comments_aiChecked_idx" ON "comments"("aiChecked");
    `)
    console.log('✓ comments_aiChecked_idx 索引已创建')

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "posts_vectorized_idx" ON "posts"("vectorized");
    `)
    console.log('✓ posts_vectorized_idx 索引已创建')

    console.log('✅ 所有 AI 字段和索引已成功添加！')
  } catch (error: unknown) {
    console.error('❌ 添加字段时出错:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addAIFields()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

