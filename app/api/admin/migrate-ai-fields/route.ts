import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * API 路由：在 Vercel 数据库中添加 AI 相关字段
 * 使用方法：在 Vercel 部署后，访问 https://your-domain.com/api/admin/migrate-ai-fields
 * 或者在本地运行：curl http://localhost:3000/api/admin/migrate-ai-fields
 */
export async function GET(request: NextRequest) {
  try {
    console.log('开始添加 AI 相关字段到数据库...')

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

    // 创建索引（使用 IF NOT EXISTS 避免重复创建）
    try {
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "comments_aiChecked_idx" ON "comments"("aiChecked");
      `)
      console.log('✓ comments_aiChecked_idx 索引已创建')
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        throw error
      }
      console.log('⚠ comments_aiChecked_idx 索引已存在')
    }

    try {
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "posts_vectorized_idx" ON "posts"("vectorized");
      `)
      console.log('✓ posts_vectorized_idx 索引已创建')
    } catch (error: any) {
      if (!error.message.includes('already exists')) {
        throw error
      }
      console.log('⚠ posts_vectorized_idx 索引已存在')
    }

    return NextResponse.json({
      success: true,
      message: '所有 AI 字段和索引已成功添加！',
      details: {
        posts: ['aiKeywords', 'aiSummary', 'aiSummaryAt', 'vectorized'],
        comments: ['aiAutoReply', 'aiChecked', 'aiCheckedAt', 'aiSpamScore', 'aiToxicScore'],
        indexes: ['comments_aiChecked_idx', 'posts_vectorized_idx'],
      },
    })
  } catch (error: any) {
    console.error('❌ 添加字段时出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

