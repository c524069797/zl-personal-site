import { prisma } from '../lib/prisma'
import { hashPassword } from '../lib/auth'

async function testRegister() {
  try {
    console.log('测试数据库连接...')

    // 测试数据库连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 测试查询
    const userCount = await prisma.user.count()
    console.log(`✅ 当前用户数量: ${userCount}`)

    // 测试密码加密
    const testPassword = 'czl990515'
    const hashed = hashPassword(testPassword)
    console.log(`✅ 密码加密测试: ${testPassword} -> ${hashed.substring(0, 20)}...`)

    // 测试创建用户
    const testEmail = 'test@example.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    })

    if (existingUser) {
      console.log('⚠️  测试用户已存在，跳过创建')
    } else {
      const hashedPassword = hashPassword(testPassword)
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          password: hashedPassword,
          name: '测试用户',
          role: 'author',
        },
      })
      console.log('✅ 测试用户创建成功:', user.email)

      // 清理测试用户
      await prisma.user.delete({
        where: { id: user.id },
      })
      console.log('✅ 测试用户已清理')
    }

    console.log('\n✅ 所有测试通过！')
  } catch (error: any) {
    console.error('❌ 测试失败:', error.message)
    console.error('详细错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()

