/**
 * 添加category字段到posts表
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCategoryField() {
  try {
    console.log('开始添加category字段...')

    // 添加category列（如果不存在）
    await prisma.$executeRawUnsafe(`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT 'tech';
    `)

    // 创建索引（如果不存在）
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "posts_category_idx" ON posts(category);
    `)

    // 根据标题自动分类现有文章
    console.log('开始根据标题自动分类现有文章...')

    // 先获取所有文章（因为category字段可能还不存在或为null）
    const posts = await prisma.post.findMany()

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
        // React、Next.js、Vue等核心技术关键词，必须分类为技术博客
        category = 'tech'
      } else if (hasLifeKeyword) {
        // 包含生活关键词，分类为生活记录
        category = 'life'
      } else if (hasOtherTechKeyword) {
        // 包含其他技术关键词，分类为技术博客
        category = 'tech'
      }

      await prisma.post.update({
        where: { id: post.id },
        data: { category },
      })

      updatedCount++
      console.log(`已更新: ${post.title} -> ${category === 'life' ? '生活记录' : '技术博客'}`)
    }

    console.log(`✅ 成功添加category字段！共更新 ${updatedCount} 篇文章`)
  } catch (error) {
    console.error('❌ 添加category字段失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addCategoryField()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

