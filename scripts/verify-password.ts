#!/usr/bin/env tsx
/**
 * 验证密码是否匹配哈希值
 * 使用方法: npx tsx scripts/verify-password.ts <password>
 */

import { hashPassword } from '../lib/auth'

const password = process.argv[2]
const storedHash = 'b0e2384787e87556dd45de56ec8e2664b5775c528b2355658ba2aee3e8a6334c'

if (!password) {
  console.error('使用方法: npx tsx scripts/verify-password.ts <password>')
  console.error('\n示例:')
  console.error('  npx tsx scripts/verify-password.ts "your-password"')
  process.exit(1)
}

console.log('🔍 验证密码...\n')
console.log(`存储的哈希值: ${storedHash}\n`)

const generatedHash = hashPassword(password)
console.log(`输入的密码: ${password}`)
console.log(`生成的哈希值: ${generatedHash}\n`)

if (generatedHash === storedHash) {
  console.log('✅ 密码匹配！')
} else {
  console.log('❌ 密码不匹配')
  console.log('\n提示:')
  console.log('- 检查密码是否正确')
  console.log('- 检查 PASSWORD_SECRET 环境变量是否与创建用户时一致')
}

