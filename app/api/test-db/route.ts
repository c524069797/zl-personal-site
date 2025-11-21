import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 检查环境变量
    const databaseUrl = process.env.DATABASE_URL
    const hasDatabaseUrl = !!databaseUrl
    const databaseUrlPreview = databaseUrl
      ? databaseUrl.substring(0, 20) + '...'
      : '未设置'

    // 尝试连接数据库
    await prisma.$connect()

    // 执行简单查询
    await prisma.$queryRaw`SELECT 1 as test`

    // 尝试查询表是否存在
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `

    return NextResponse.json({
      success: true,
      message: '数据库连接成功',
      hasDatabaseUrl,
      databaseUrlPreview,
      tables: Array.isArray(tables) ? tables.length : 0,
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    const errorWithCode = error as { code?: string }
    const databaseUrl = process.env.DATABASE_URL
    return NextResponse.json({
      success: false,
      error: errorObj.message,
      errorCode: errorWithCode.code,
      hasDatabaseUrl: !!databaseUrl,
      databaseUrlPreview: databaseUrl
        ? databaseUrl.substring(0, 20) + '...'
        : '未设置',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect().catch(() => {})
  }
}

