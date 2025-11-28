import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取分类统计信息
export async function GET() {
  try {
    // 确保数据库连接
    await prisma.$connect()

    const [techCount, lifeCount] = await Promise.all([
      // 技术博客：category为'tech'或null的文章
      prisma.post.count({
        where: {
          published: true,
          OR: [
            { category: 'tech' },
            { category: null },
          ],
        },
      }),
      // 生活记录：category为'life'的文章
      prisma.post.count({
        where: {
          published: true,
          category: 'life',
        },
      }),
    ])

    return NextResponse.json({
      categories: [
        {
          id: 'tech',
          name: '技术博客',
          slug: 'tech',
          count: techCount,
          color: '#1890ff',
        },
        {
          id: 'life',
          name: '生活记录',
          slug: 'life',
          count: lifeCount,
          color: '#52c41a',
        },
      ],
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: errorMessage },
      { status: 500 }
    )
  }
}

