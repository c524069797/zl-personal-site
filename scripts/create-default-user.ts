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

  } catch (error) {
    console.error('❌ 创建用户失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultUser()

