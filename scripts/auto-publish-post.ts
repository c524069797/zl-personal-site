import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { categorizeBlog } from '../lib/blog-category'

/**
 * 自动发布文章脚本（非交互式）
 * 用于 Cursor 工作流自动化发布
 * 
 * 用法:
 * 1. 发布单个文件: npx tsx scripts/auto-publish-post.ts <文件路径>
 * 2. 发布 content/posts 目录下的所有新文章: npx tsx scripts/auto-publish-post.ts
 * 3. 发布指定目录: npx tsx scripts/auto-publish-post.ts --dir <目录路径>
 */

interface PublishOptions {
  filePath?: string
  directory?: string
  autoPublish?: boolean // 是否自动发布（忽略 draft 标记）
  skipExisting?: boolean // 是否跳过已存在的文章
}

async function autoPublishPost(options: PublishOptions = {}) {
  try {
    const { filePath, directory, autoPublish = false, skipExisting = true } = options

    console.log('🚀 自动发布文章工具\n')
    console.log('='.repeat(50))

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

    console.log(`👤 使用作者: ${user.name} (${user.email})\n`)

    let filesToProcess: string[] = []

    // 确定要处理的文件列表
    if (filePath) {
      // 处理单个文件
      if (!fs.existsSync(filePath)) {
        console.log(`❌ 文件不存在: ${filePath}`)
        process.exit(1)
      }
      filesToProcess = [filePath]
    } else if (directory) {
      // 处理指定目录
      if (!fs.existsSync(directory)) {
        console.log(`❌ 目录不存在: ${directory}`)
        process.exit(1)
      }
      filesToProcess = fs
        .readdirSync(directory)
        .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
        .map(f => path.join(directory, f))
    } else {
      // 处理 content/posts 目录
      const postsDir = path.join(process.cwd(), 'content/posts')
      if (!fs.existsSync(postsDir)) {
        console.log('❌ content/posts 目录不存在')
        process.exit(1)
      }
      filesToProcess = fs
        .readdirSync(postsDir)
        .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
        .map(f => path.join(postsDir, f))
    }

    if (filesToProcess.length === 0) {
      console.log('❌ 没有找到要处理的文件')
      process.exit(0)
    }

    console.log(`📁 找到 ${filesToProcess.length} 个文件\n`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0
    const successFiles: string[] = []
    const skipFiles: string[] = []
    const errorFiles: string[] = []

    for (const filePath of filesToProcess) {
      try {
        const fileName = path.basename(filePath)
        console.log(`📄 处理文件: ${fileName}`)

        // 读取文件内容
        const content = fs.readFileSync(filePath, 'utf8')
        const { data, content: body } = matter(content)

        // 验证必需字段
        if (!data.title) {
          console.log(`  ⚠️  跳过: 缺少 title 字段\n`)
          skipCount++
          skipFiles.push(fileName)
          continue
        }

        // 生成 slug
        const slug = fileName.replace(/\.(md|mdx)$/, '')

        // 检查文章是否已存在
        const existingPost = await prisma.post.findUnique({
          where: { slug },
        })

        if (existingPost && skipExisting) {
          console.log(`  ⏭️  跳过: 文章已存在\n`)
          skipCount++
          skipFiles.push(fileName)
          continue
        }

        // 自动分类
        const autoCategory = categorizeBlog(data.title || '', data.summary || '')
        let category: 'tech' | 'life' = autoCategory.category as 'tech' | 'life'

        // 如果 frontmatter 中已有 category，使用它
        if (data.category === 'tech' || data.category === 'life') {
          category = data.category
        }

        // 处理标签
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

        // 确定发布状态
        const shouldPublish = autoPublish ? true : !data.draft

        if (existingPost) {
          // 更新已存在的文章
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
              published: shouldPublish,
              category,
              tags: {
                create: tagConnections.map(tag => ({
                  tagId: tag.id,
                })),
              },
            },
          })

          const status = post.published ? '✅ 已更新（已发布）' : '📝 已更新（草稿）'
          console.log(`  ${status}: ${data.title}`)
          successCount++
          successFiles.push(fileName)
        } else {
          // 创建新文章
          const post = await prisma.post.create({
            data: {
              slug,
              title: data.title || 'Untitled',
              content: body,
              summary: data.summary || '',
              date: data.date ? new Date(data.date) : new Date(),
              published: shouldPublish,
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
          console.log(`  ${status}: ${data.title}`)
          successCount++
          successFiles.push(fileName)
        }

        console.log('')
      } catch (error) {
        errorCount++
        errorFiles.push(path.basename(filePath))
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`  ❌ 处理失败: ${errorMessage}\n`)
      }
    }

    // 显示统计信息
    console.log('='.repeat(50))
    console.log('📊 发布统计:')
    console.log('='.repeat(50))
    console.log(`✅ 成功: ${successCount} 篇`)
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

    if (errorCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('\n❌ 发布失败:', errorMessage)
    if (error instanceof Error && error.stack) {
      console.error('\n错误堆栈:', error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 解析命令行参数
const args = process.argv.slice(2)
const options: PublishOptions = {}

if (args.length === 0) {
  // 没有参数，处理 content/posts 目录下的所有文件
  autoPublishPost(options)
} else if (args[0] === '--dir' && args[1]) {
  // 指定目录
  options.directory = args[1]
  if (args.includes('--auto-publish')) {
    options.autoPublish = true
  }
  if (args.includes('--force')) {
    options.skipExisting = false
  }
  autoPublishPost(options)
} else if (args[0] === '--help' || args[0] === '-h') {
  // 显示帮助信息
  console.log(`
用法:
  npx tsx scripts/auto-publish-post.ts [选项] [文件路径]

选项:
  --dir <目录>        处理指定目录下的所有 .md/.mdx 文件
  --auto-publish      自动发布（忽略 draft 标记）
  --force             强制更新已存在的文章
  --help, -h          显示帮助信息

示例:
  # 发布 content/posts 目录下的所有新文章
  npx tsx scripts/auto-publish-post.ts

  # 发布单个文件
  npx tsx scripts/auto-publish-post.ts content/posts/my-article.md

  # 发布指定目录下的所有文章
  npx tsx scripts/auto-publish-post.ts --dir content/posts

  # 自动发布（忽略 draft 标记）
  npx tsx scripts/auto-publish-post.ts --auto-publish

  # 强制更新已存在的文章
  npx tsx scripts/auto-publish-post.ts --force
`)
} else {
  // 单个文件路径
  options.filePath = args[0]
  if (args.includes('--auto-publish')) {
    options.autoPublish = true
  }
  if (args.includes('--force')) {
    options.skipExisting = false
  }
  autoPublishPost(options)
}





