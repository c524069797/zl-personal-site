import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { categorizeBlog } from '../lib/blog-category'

async function migratePostsForce() {
  try {
    console.log('🚀 开始强制迁移博客文章（覆盖已存在的）...\n')

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
    let updateCount = 0
    let errorCount = 0
    const successFiles: string[] = []
    const updateFiles: string[] = []
    const errorFiles: string[] = []

    for (const file of files) {
      try {
        const filePath = path.join(postsDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const { data, content: body } = matter(content)
        const slug = file.replace(/\.(md|mdx)$/, '')

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

        // 自动分类博客
        const categoryInfo = categorizeBlog(data.title || '', data.summary || '')
        const category = data.category || categoryInfo.category

        const existingPost = await prisma.post.findUnique({
          where: { slug },
          include: { tags: true },
        })

        if (existingPost) {
          // 删除旧的标签关联
          await prisma.postTag.deleteMany({
            where: { postId: existingPost.id },
          })

          // 更新文章
          const post = await prisma.post.update({
            where: { id: existingPost.id },
            data: {
              title: data.title || 'Untitled',
              content: body,
              summary: data.summary || '',
              date: data.date ? new Date(data.date) : new Date(),
              published: !data.draft,
              category,
              tags: {
                create: tagConnections.map(tag => ({
                  tagId: tag.id,
                })),
              },
            },
          })

          updateCount++
          updateFiles.push(file)
          const status = post.published ? '✅ 已更新（已发布）' : '📝 已更新（草稿）'
          console.log(`${status}: ${data.title || slug}`)
        } else {
          // 创建新文章
          const post = await prisma.post.create({
            data: {
              slug,
              title: data.title || 'Untitled',
              content: body,
              summary: data.summary || '',
              date: data.date ? new Date(data.date) : new Date(),
              published: !data.draft,
              category,
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
          const status = post.published ? '✅ 已创建（已发布）' : '📝 已创建（草稿）'
          console.log(`${status}: ${data.title || slug}`)
        }
      } catch (error) {
        errorCount++
        errorFiles.push(file)
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`❌ 导入失败 ${file}:`, errorMessage)
      }
    }

    // 显示统计信息
    console.log('\n' + '='.repeat(50))
    console.log('📊 迁移统计:')
    console.log('='.repeat(50))
    console.log(`✅ 成功创建: ${successCount} 篇`)
    if (successFiles.length > 0) {
      successFiles.forEach(f => console.log(`   - ${f}`))
    }
    console.log(`\n🔄 成功更新: ${updateCount} 篇`)
    if (updateFiles.length > 0) {
      updateFiles.forEach(f => console.log(`   - ${f}`))
    }
    console.log(`\n❌ 失败: ${errorCount} 篇`)
    if (errorFiles.length > 0) {
      errorFiles.forEach(f => console.log(`   - ${f}`))
    }
    console.log('='.repeat(50))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ 迁移失败:', errorMessage)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migratePostsForce()

