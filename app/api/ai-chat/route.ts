import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { settingId, model, messages } = await request.json()

  if (!settingId || !model || !messages) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const setting = await prisma.aISetting.findUnique({ where: { id: settingId } })
  if (!setting) {
    return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
  }

  try {
    const response = await fetch(`${setting.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${setting.apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream: false }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'API error' }, { status: response.status })
    }

    return NextResponse.json({ content: data.choices?.[0]?.message?.content || '' })
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
