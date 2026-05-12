import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SILICONFLOW_FREE_MODELS, SILICONFLOW_FREE_SETTING_ID } from '@/lib/siliconflow'

const DEFAULT_MODELS = [
  ...SILICONFLOW_FREE_MODELS,
]

// 获取可用模型列表
export async function GET(request: NextRequest) {
  const settingId = request.nextUrl.searchParams.get('settingId')

  if (settingId === SILICONFLOW_FREE_SETTING_ID) {
    return NextResponse.json({ models: SILICONFLOW_FREE_MODELS })
  }

  // 如果没有 settingId，直接返回默认模型列表
  if (!settingId) {
    return NextResponse.json({ models: DEFAULT_MODELS })
  }

  const setting = await prisma.aISetting.findUnique({ where: { id: settingId } })

  // 如果数据库中找不到对应设置，也返回默认模型列表，不报错
  if (!setting) {
    return NextResponse.json({ models: DEFAULT_MODELS })
  }

  try {
    const response = await fetch(`${setting.baseUrl}/models`, {
      headers: { Authorization: `Bearer ${setting.apiKey}` },
    })
    const data = await response.json()
    const models = data.data?.map((m: { id: string }) => m.id) || []
    return NextResponse.json({ models })
  } catch {
    // 外部 API 请求失败时，回退到默认模型列表
    return NextResponse.json({ models: DEFAULT_MODELS })
  }
}
