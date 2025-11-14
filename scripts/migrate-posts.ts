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

    const postsDir = path.join(process.cwd(), 'content/posts')

    if (!fs.existsSync(postsDir)) {
      return
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

    if (files.length === 0) {
      return
    }

    let successCount = 0
    let skipCount = 0

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

        successCount++
      } catch (error) {
        console.error(`❌ 导入失败 ${file}:`, error)
      }
    }
  } catch (error) {
    console.error('❌ 迁移失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migratePosts()

