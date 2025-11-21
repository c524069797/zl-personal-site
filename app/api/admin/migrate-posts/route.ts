/**
 * 在Vercel上执行博客文章迁移的API路由
 * GET/POST /api/admin/migrate-posts
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { categorizeBlog } from '@/lib/blog-category'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  return await migratePosts()
}

export async function POST() {
  return await migratePosts()
}

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
      return NextResponse.json(
        { success: false, error: 'content/posts 目录不存在' },
        { status: 404 }
      )
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有找到markdown文件' },
        { status: 404 }
      )
    }

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
          await prisma.post.update({
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
        } else {
          // 创建新文章
          await prisma.post.create({
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
        }
      } catch (error) {
        errorCount++
        errorFiles.push(file)
        console.error(`导入失败 ${file}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `博客迁移完成！创建 ${successCount} 篇，更新 ${updateCount} 篇`,
      created: successCount,
      updated: updateCount,
      errors: errorCount,
      createdFiles: successFiles,
      updatedFiles: updateFiles,
      errorFiles: errorFiles.length > 0 ? errorFiles : undefined,
    })
  } catch (error) {
    console.error('迁移博客失败:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

