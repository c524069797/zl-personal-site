import { prisma } from '../lib/prisma'

async function createDefaultUser() {
  try {
    // 创建默认管理员用户
    const user = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        password: 'changeme123', // ⚠️ 请记得修改密码！
        role: 'admin',
      },
    })

    console.log('✅ 默认用户创建成功！')
    console.log('📧 邮箱:', user.email)
    console.log('👤 用户名:', user.name)
    console.log('🔑 密码: changeme123')
    console.log('⚠️  请记得修改密码！')
  } catch (error) {
    console.error('❌ 创建用户失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultUser()

