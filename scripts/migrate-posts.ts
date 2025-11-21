import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

async function migratePosts() {
  try {
    console.log('🚀 开始迁移博客文章...\n')

    // 获取或创建默认用户
    const user = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        password: 'changeme123',
        role: 'admin',
      },
    })

    console.log(`✅ 使用作者: ${user.name} (${user.email})\n`)

    const postsDir = path.join(process.cwd(), 'content/posts')

    if (!fs.existsSync(postsDir)) {
      console.log('❌ content/posts 目录不存在')
      return
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

    if (files.length === 0) {
      console.log('❌ 没有找到markdown文件')
      return
    }

    console.log(`📁 找到 ${files.length} 个文件\n`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0
    const successFiles: string[] = []
    const skipFiles: string[] = []
    const errorFiles: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(postsDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const { data, content: body } = matter(content)
        const slug = file.replace(/\.(md|mdx)$/, '')

        const existingPost = await prisma.post.findUnique({
          where: { slug },
        })

        if (existingPost) {
          skipCount++
          skipFiles.push(file)
          console.log(`⏭️  跳过: ${file} (已存在)`)
          continue
        }

        // 创建或查找标签
        const tagConnections = await Promise.all(
          (data.tags || []).map(async (tagName: string) => {
            const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
            const tag = await prisma.tag.upsert({
              where: { name: tagName },
              update: {},
              create: {
                name: tagName,
                slug: tagSlug,
              },
            })
            return { id: tag.id }
          })
        )

        // 创建文章
        const post = await prisma.post.create({
          data: {
            slug,
            title: data.title || 'Untitled',
            content: body,
            summary: data.summary || '',
            date: data.date ? new Date(data.date) : new Date(),
            published: !data.draft,
            authorId: user.id,
            tags: {
              create: tagConnections.map(tag => ({
                tagId: tag.id,
              })),
            },
          },
        })

        successCount++
        successFiles.push(file)
        const status = post.published ? '✅ 已发布' : '📝 草稿'
        console.log(`${status}: ${data.title || slug}`)
      } catch (error: any) {
        errorCount++
        errorFiles.push(file)
        console.error(`❌ 导入失败 ${file}:`, error.message || error)
      }
    }

    // 显示统计信息
    console.log('\n' + '='.repeat(50))
    console.log('📊 迁移统计:')
    console.log('='.repeat(50))
    console.log(`✅ 成功导入: ${successCount} 篇`)
    if (successFiles.length > 0) {
      successFiles.forEach(f => console.log(`   - ${f}`))
    }
    console.log(`\n⏭️  跳过: ${skipCount} 篇`)
    if (skipFiles.length > 0) {
      skipFiles.forEach(f => console.log(`   - ${f}`))
    }
    console.log(`\n❌ 失败: ${errorCount} 篇`)
    if (errorFiles.length > 0) {
      errorFiles.forEach(f => console.log(`   - ${f}`))
    }
    console.log('='.repeat(50))
  } catch (error: any) {
    console.error('❌ 迁移失败:', error.message || error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migratePosts()

