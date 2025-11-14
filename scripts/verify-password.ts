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

const generatedHash = hashPassword(password)

if (generatedHash === storedHash) {
  // 密码匹配
} else {
  // 密码不匹配
}

