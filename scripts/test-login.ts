#!/usr/bin/env tsx
/**
 * 测试登录功能
 * 使用方法: npx tsx scripts/test-login.ts <email> <password>
 */

import { prisma } from '../lib/prisma'
import { hashPassword, verifyPassword } from '../lib/auth'

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

    const passwordSecret = process.env.PASSWORD_SECRET

    const testHash = hashPassword(password)

    const isValid = verifyPassword(password, user.password)
    if (!isValid) {
      const defaultSecret = 'password-secret-key'
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
  } catch (error: any) {
    console.error('❌ 错误:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testLogin()

