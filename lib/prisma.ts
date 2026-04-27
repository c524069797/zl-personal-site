import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const rawPrisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = rawPrisma
}

// 代理包装：每次查询方法调用前自动确保连接
// 解决 Next.js 开发模式下 Turbopack 热重载导致 Engine 断开的问题
const queryMethods = new Set([
  'findMany', 'findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow',
  'count', 'aggregate', 'groupBy', 'create', 'createMany', 'update', 'updateMany',
  'upsert', 'delete', 'deleteMany', '$queryRaw', '$queryRawUnsafe', '$executeRaw',
  '$executeRawUnsafe', '$transaction',
])

export const prisma = new Proxy(rawPrisma, {
  get(target, prop) {
    const value = (target as unknown as Record<string | symbol, unknown>)[prop]

    if (typeof value === 'function' && queryMethods.has(String(prop))) {
      return async function (...args: unknown[]) {
        try {
          await target.$connect()
        } catch {
          // 已连接时 $connect 可能抛错，忽略
        }
        return (value as (...args: unknown[]) => unknown).apply(target, args)
      }
    }

    return value
  },
}) as PrismaClient
