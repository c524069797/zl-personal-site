import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function testRegister() {
  try {
    await prisma.$connect()

    const userCount = await prisma.user.count()

    const testPassword = 'czl990515'
    const hashed = hashPassword(testPassword)

    const testEmail = 'test@example.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    })

    if (!existingUser) {
      const hashedPassword = hashPassword(testPassword)
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          password: hashedPassword,
          name: '测试用户',
          role: 'author',
        },
      })

      await prisma.user.delete({
        where: { id: user.id },
      })
    }
  } catch (error: any) {
    console.error('❌ 测试失败:', error.message)
    console.error('详细错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()

