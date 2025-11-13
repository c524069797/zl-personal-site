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
    console.log('🔍 测试登录功能...\n')

    // 1. 查找用户
    console.log(`1. 查找用户: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error('❌ 用户不存在')
      process.exit(1)
    }

    console.log('✅ 用户存在')
    console.log(`   - ID: ${user.id}`)
    console.log(`   - 邮箱: ${user.email}`)
    console.log(`   - 角色: ${user.role}`)
    console.log(`   - 密码哈希: ${user.password.substring(0, 30)}...`)

    // 2. 检查环境变量
    console.log('\n2. 检查环境变量')
    const passwordSecret = process.env.PASSWORD_SECRET
    if (passwordSecret) {
      console.log('✅ PASSWORD_SECRET 已设置')
      console.log(`   - 值: ${passwordSecret.substring(0, 10)}...`)
    } else {
      console.log('⚠️  PASSWORD_SECRET 未设置，使用默认值')
    }

    // 3. 测试密码加密
    console.log('\n3. 测试密码加密')
    const testHash = hashPassword(password)
    console.log(`   - 输入密码: ${password}`)
    console.log(`   - 生成的哈希: ${testHash.substring(0, 30)}...`)
    console.log(`   - 存储的哈希: ${user.password.substring(0, 30)}...`)

    // 4. 验证密码
    console.log('\n4. 验证密码')
    const isValid = verifyPassword(password, user.password)
    if (isValid) {
      console.log('✅ 密码验证成功！')
    } else {
      console.log('❌ 密码验证失败')
      console.log('\n可能的原因:')
      console.log('1. 密码不正确')
      console.log('2. PASSWORD_SECRET 环境变量与注册时不一致')
      console.log('3. 数据库中的密码使用了不同的加密方式')

      // 尝试使用默认的 PASSWORD_SECRET 重新加密
      console.log('\n尝试使用默认 PASSWORD_SECRET 重新加密...')
      const defaultSecret = 'password-secret-key'
      const crypto = require('crypto')
      const testHashWithDefault = crypto
        .createHmac('sha256', defaultSecret)
        .update(password)
        .digest('hex')

      if (testHashWithDefault === user.password) {
        console.log('✅ 使用默认 PASSWORD_SECRET 验证成功！')
        console.log('   说明: 需要使用默认的 PASSWORD_SECRET 环境变量')
      } else {
        console.log('❌ 使用默认 PASSWORD_SECRET 也验证失败')
      }
    }

    // 5. 检查角色
    console.log('\n5. 检查用户角色')
    if (user.role === 'admin') {
      console.log('✅ 用户是管理员')
    } else {
      console.log(`⚠️  用户角色是: ${user.role}`)
      console.log('   需要将角色改为 admin 才能登录')
    }

    await prisma.$disconnect()
  } catch (error: any) {
    console.error('❌ 错误:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testLogin()

