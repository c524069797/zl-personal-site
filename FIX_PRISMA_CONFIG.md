# Prisma 配置修复说明

## 🔧 已修复的问题

### 问题
错误信息：`Error validating datasource 'db': the URL must start with the protocol 'prisma://' or 'prisma+postgres://'`

### 原因
项目使用了 `prisma.config.ts` 配置文件，这是 Prisma 的新配置方式，它期望使用 Prisma 格式的连接字符串（`prisma://` 或 `prisma+postgres://`），而不是标准的 PostgreSQL 连接字符串。

### 解决方案
1. ✅ **删除了 `prisma.config.ts` 文件**
   - 这个文件不是必需的
   - 标准的 Prisma 配置只需要 `schema.prisma` 文件

2. ✅ **简化了 `lib/prisma.ts`**
   - 移除了手动配置 datasource 的代码
   - Prisma Client 现在会直接从 `schema.prisma` 读取配置

3. ✅ **确保 `.env` 文件使用标准 PostgreSQL 连接字符串**
   ```env
   DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
   ```

---

## 📝 当前配置

### Prisma Schema (`prisma/schema.prisma`)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 环境变量 (`.env`)
```env
DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
```

### Prisma Client (`lib/prisma.ts`)
```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

---

## 🚀 下一步

### 1. 重新生成 Prisma Client

```bash
export DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
npx prisma generate
```

### 2. 重启开发服务器

**重要**：必须重启开发服务器！

```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

### 3. 测试注册功能

访问 http://localhost:3000/register 并尝试注册。

---

## ✅ 验证修复

运行以下命令验证配置：

```bash
# 1. 验证 Prisma Client 生成
export DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
npx prisma generate

# 2. 测试数据库连接
npx tsx scripts/test-register.ts
```

如果测试通过，注册功能应该可以正常工作了！

---

## 📚 说明

### 为什么删除 `prisma.config.ts`？

- `prisma.config.ts` 是 Prisma 的新配置方式，主要用于 Prisma Cloud 和 Prisma Accelerate
- 对于标准的本地 PostgreSQL 数据库，不需要这个文件
- `schema.prisma` 文件已经包含了所有必要的配置
- 删除后，Prisma 会使用标准的配置方式，更简单可靠

### Prisma 配置优先级

1. `schema.prisma` 文件中的 `datasource` 配置
2. `.env` 文件中的 `DATABASE_URL` 环境变量
3. 系统环境变量 `DATABASE_URL`

