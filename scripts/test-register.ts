import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function testRegister() {
  try {
    await prisma.$connect()

    const testPassword = 'czl990515'

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
  } catch (error: unknown) {
    console.error('❌ 测试失败:', error.message)
    console.error('详细错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()

