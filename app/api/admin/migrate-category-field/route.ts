/**
 * 在Vercel上执行category字段迁移的API路由
 * GET/POST /api/admin/migrate-category-field
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  return await migrateCategoryField()
}

export async function POST() {
  return await migrateCategoryField()
}

async function migrateCategoryField() {
  try {
    // 添加category列（如果不存在）
    await prisma.$executeRawUnsafe(`
      ALTER TABLE posts 
      ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT 'tech';
    `)

    // 创建索引（如果不存在）
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "posts_category_idx" ON posts(category);
    `)

    // 核心技术关键词（React、Next.js、Vue等，这些必须分类为技术博客）
    const coreTechKeywords = [
      'vue', 'vuejs', 'vue.js', 'vue2', 'vue3', 
      'react', 'reactjs', 'react.js',
      'nextjs', 'next.js', 'next',
    ]

    // 其他技术关键词
    const otherTechKeywords = [
      'javascript', 'typescript', 'js', 'ts',
      '前端', '后端', '开发', '编程', '代码', '技术',
      '框架', '库', '工具', 'api', '接口', '数据库',
      '性能', '优化', '安全', 'xss', 'csrf',
      'webpack', 'vite', 'node', 'docker', 'git',
      '算法', '数据结构', '设计模式',
    ]

    // 生活记录相关关键词
    const lifeKeywords = [
      '表达', '表达能力', '沟通', '沟通框架', '沟通技巧',
      '习惯', '提升', '成长', '自我管理', '效率', '行动', '改变', '日常',
      '生活', '记录', '思考', '感悟', '心得', '经验', '分享',
      '工作', '职场', '团队', '协作', '会议', '交流',
      '学习', '读书', '阅读', '笔记', '门槛', '法则',
    ]

    // 获取所有文章
    const posts = await prisma.post.findMany()

    let updatedCount = 0
    for (const post of posts) {
      const searchText = `${post.title} ${post.summary || ''}`.toLowerCase()
      
      // 优先检查核心技术关键词（React、Next.js、Vue等）
      const hasCoreTechKeyword = coreTechKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      )
      
      // 检查其他技术关键词
      const hasOtherTechKeyword = otherTechKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      )
      
      // 检查生活关键词
      const hasLifeKeyword = lifeKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      )

      // 分类逻辑：
      // 1. 如果包含核心技术关键词（React、Next.js、Vue），必须分类为技术博客
      // 2. 如果包含生活关键词（表达、沟通、习惯等），分类为生活记录
      // 3. 如果包含其他技术关键词，分类为技术博客
      // 4. 否则默认为技术博客
      let category = 'tech'
      if (hasCoreTechKeyword) {
        category = 'tech'
      } else if (hasLifeKeyword) {
        category = 'life'
      } else if (hasOtherTechKeyword) {
        category = 'tech'
      }

      await prisma.post.update({
        where: { id: post.id },
        data: { category },
      })

      updatedCount++
    }

    return NextResponse.json({
      success: true,
      message: `成功添加category字段！共更新 ${updatedCount} 篇文章`,
      updatedCount,
    })
  } catch (error) {
    console.error('迁移category字段失败:', error)
    const errorMessage = error instanceof Error ? error.message : '迁移失败'
    const errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

