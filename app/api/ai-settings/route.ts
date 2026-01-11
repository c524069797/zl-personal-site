import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取设置列表
export async function GET() {
  const settings = await prisma.aISetting.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, baseUrl: true, name: true, isActive: true, createdAt: true },
  })
  return NextResponse.json(settings)
}

// 创建/更新设置
export async function POST(request: NextRequest) {
  const { id, baseUrl, apiKey, name } = await request.json()

  if (id) {
    const data: { baseUrl: string; name: string; apiKey?: string } = { baseUrl, name }
    if (apiKey) data.apiKey = apiKey
    const setting = await prisma.aISetting.update({ where: { id }, data })
    return NextResponse.json({ id: setting.id, baseUrl: setting.baseUrl, name: setting.name })
  }

  const setting = await prisma.aISetting.create({
    data: { baseUrl, apiKey, name },
  })
  return NextResponse.json({ id: setting.id, baseUrl: setting.baseUrl, name: setting.name })
}

// 删除设置
export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  await prisma.aISetting.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
