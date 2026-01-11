import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取可用模型列表
export async function GET(request: NextRequest) {
  const settingId = request.nextUrl.searchParams.get('settingId')
  if (!settingId) {
    return NextResponse.json({ error: 'settingId required' }, { status: 400 })
  }

  const setting = await prisma.aISetting.findUnique({ where: { id: settingId } })
  if (!setting) {
    return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
  }

  try {
    const response = await fetch(`${setting.baseUrl}/models`, {
      headers: { Authorization: `Bearer ${setting.apiKey}` },
    })
    const data = await response.json()
    const models = data.data?.map((m: { id: string }) => m.id) || []
    return NextResponse.json({ models })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}
