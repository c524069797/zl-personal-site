#!/usr/bin/env tsx
/**
 * 测试登录功能
 * 使用方法: npx tsx scripts/test-login.ts <email> <password>
 */

import { prisma } from '../lib/prisma'
import { verifyPassword } from '../lib/auth'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('使用方法: npx tsx scripts/test-login.ts <email> <password>')
  process.exit(1)
}

async function testLogin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error('❌ 用户不存在')
      process.exit(1)
    }

    const isValid = verifyPassword(password, user.password)
    if (!isValid) {
      const defaultSecret = 'password-secret-key'
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const crypto = require('crypto')
      const testHashWithDefault = crypto
        .createHmac('sha256', defaultSecret)
        .update(password)
        .digest('hex')

      if (testHashWithDefault === user.password) {
        // 使用默认 PASSWORD_SECRET 验证成功
      }
    }

    await prisma.$disconnect()
  } catch (error: unknown) {
    console.error('❌ 错误:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testLogin()

