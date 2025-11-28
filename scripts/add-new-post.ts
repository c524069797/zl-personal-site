import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { categorizeBlog } from '../lib/blog-category'
import * as readline from 'readline'

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 询问用户输入
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function addNewPost() {
  try {
    console.log('🚀 新增文章部署工具\n')
    console.log('='.repeat(50))

    // 1. 获取文件路径
    const filePath = process.argv[2]
    if (!filePath) {
      console.log('❌ 请提供文件路径')
      console.log('用法: npx tsx scripts/add-new-post.ts <文件路径>')
      console.log('示例: npx tsx scripts/add-new-post.ts ~/Desktop/my-article.md')
      process.exit(1)
    }

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`❌ 文件不存在: ${filePath}`)
      process.exit(1)
    }

    // 检查文件扩展名
    if (!filePath.endsWith('.md') && !filePath.endsWith('.mdx')) {
      console.log('❌ 文件必须是 .md 或 .mdx 格式')
      process.exit(1)
    }

    console.log(`📄 源文件: ${filePath}\n`)

    // 2. 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8')
    const { data, content: body } = matter(content)

    // 验证必需字段
    if (!data.title) {
      console.log('❌ 文章缺少 title 字段')
      process.exit(1)
    }

    console.log(`📝 文章标题: ${data.title}`)
    if (data.summary) {
      console.log(`📄 文章摘要: ${data.summary}`)
    }
    if (data.tags && Array.isArray(data.tags)) {
      console.log(`🏷️  标签: ${data.tags.join(', ')}`)
    }
    console.log('')

    // 3. 询问博客分类
    const autoCategory = categorizeBlog(data.title || '', data.summary || '')
    console.log(`🤖 自动检测分类: ${autoCategory.label} (${autoCategory.category})`)
    console.log('')

    let category: 'tech' | 'life' = autoCategory.category as 'tech' | 'life'

    // 如果 frontmatter 中已有 category，使用它
    if (data.category === 'tech' || data.category === 'life') {
      category = data.category
      console.log(`📋 使用 frontmatter 中的分类: ${category === 'tech' ? '技术博客' : '生活记录'}`)
    } else {
      // 询问用户确认分类
      const answer = await question(
        `请选择博客分类:\n  1. 技术博客 (tech)\n  2. 生活记录 (life)\n  3. 使用自动检测 (${autoCategory.category})\n请输入选项 (1/2/3，默认3): `
      )

      if (answer.trim() === '1') {
        category = 'tech'
      } else if (answer.trim() === '2') {
        category = 'life'
      } else {
        category = autoCategory.category as 'tech' | 'life'
      }
    }

    console.log(`\n✅ 选择的分类: ${category === 'tech' ? '技术博客' : '生活记录'}\n`)

    // 4. 复制文件到 content/posts 目录
    const postsDir = path.join(process.cwd(), 'content/posts')
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true })
    }

    const fileName = path.basename(filePath)
    const targetPath = path.join(postsDir, fileName)

    // 如果目标文件已存在，询问是否覆盖
    if (fs.existsSync(targetPath)) {
      const overwrite = await question(
        `⚠️  文件 ${fileName} 已存在，是否覆盖？(y/N): `
      )
      if (overwrite.trim().toLowerCase() !== 'y') {
        console.log('❌ 操作已取消')
        process.exit(0)
      }
    }

    // 复制文件
    fs.copyFileSync(filePath, targetPath)
    console.log(`✅ 文件已复制到: ${targetPath}\n`)

    // 5. 获取或创建默认用户
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

    console.log(`👤 使用作者: ${user.name} (${user.email})\n`)

    // 6. 处理标签
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

    // 7. 生成 slug
    const slug = fileName.replace(/\.(md|mdx)$/, '')

    // 检查文章是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      const update = await question(
        `⚠️  文章 ${slug} 已存在，是否更新？(y/N): `
      )

      if (update.trim().toLowerCase() === 'y') {
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

        const status = post.published ? '✅ 已更新（已发布）' : '📝 已更新（草稿）'
        console.log(`\n${status}: ${data.title || slug}`)
      } else {
        console.log('❌ 操作已取消')
        process.exit(0)
      }
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

      const status = post.published ? '✅ 已创建（已发布）' : '📝 已创建（草稿）'
      console.log(`\n${status}: ${data.title || slug}`)
    }

    // 8. 显示统计信息
    console.log('\n' + '='.repeat(50))
    console.log('📊 部署完成！')
    console.log('='.repeat(50))
    console.log(`📄 文件: ${fileName}`)
    console.log(`📝 标题: ${data.title}`)
    console.log(`🏷️  分类: ${category === 'tech' ? '技术博客' : '生活记录'}`)
    console.log(`📅 日期: ${data.date || new Date().toISOString().split('T')[0]}`)
    console.log(`🏷️  标签: ${(data.tags || []).join(', ') || '无'}`)
    console.log(`📤 状态: ${data.draft ? '草稿' : '已发布'}`)
    console.log('='.repeat(50))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('\n❌ 部署失败:', errorMessage)
    if (error instanceof Error && error.stack) {
      console.error('\n错误堆栈:', error.stack)
    }
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

addNewPost()

