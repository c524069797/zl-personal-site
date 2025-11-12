import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

async function migratePosts() {
  try {
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

    console.log('👤 使用用户:', user.email)

    // 读取 markdown 文件
    const postsDir = path.join(process.cwd(), 'content/posts')

    if (!fs.existsSync(postsDir)) {
      console.log('❌ content/posts 目录不存在')
      return
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

    if (files.length === 0) {
      console.log('ℹ️  没有找到 markdown 文件')
      return
    }

    console.log(`📝 找到 ${files.length} 个文章文件`)

    let successCount = 0
    let skipCount = 0

    for (const file of files) {
      try {
        const filePath = path.join(postsDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const { data, content: body } = matter(content)
        const slug = file.replace(/\.(md|mdx)$/, '')

        // 检查文章是否已存在
        const existingPost = await prisma.post.findUnique({
          where: { slug },
        })

        if (existingPost) {
          console.log(`⏭️  跳过已存在的文章: ${slug}`)
          skipCount++
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
        await prisma.post.create({
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

        console.log(`✅ 导入成功: ${slug}`)
        successCount++
      } catch (error) {
        console.error(`❌ 导入失败 ${file}:`, error)
      }
    }

    console.log('\n📊 迁移完成！')
    console.log(`✅ 成功: ${successCount} 篇`)
    console.log(`⏭️  跳过: ${skipCount} 篇`)
  } catch (error) {
    console.error('❌ 迁移失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migratePosts()

